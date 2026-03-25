"""FastAPI application entry point for the PSEG Tech Manual Chatbot Prototype."""
 
import asyncio
import logging
from concurrent.futures import ThreadPoolExecutor
from contextlib import asynccontextmanager
 
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
 
from app.api.routes import router
from app.config.settings import ALLOWED_ORIGINS, CORS_ALLOW_CREDENTIALS
 
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
)
 
# Suppress verbose Azure SDK HTTP-level logging (floods console with every
# Cosmos request/response header dump).  Our app-level logs stay at INFO.
logging.getLogger("azure.cosmos").setLevel(logging.WARNING)
logging.getLogger("azure.core").setLevel(logging.WARNING)
 
logger = logging.getLogger(__name__)
 
 
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize and tear down shared resources (Cosmos DB client)."""
    from app.storage.cosmos_client import close_cosmos, init_cosmos
 
    # Widen the default thread pool used by asyncio.to_thread().
    # retrieve() and rewrite_query() are synchronous and each block a worker
    # for ~1-3 s while waiting on Azure OpenAI / Search HTTP calls.  The
    # default pool (40 workers) saturates at ~40 concurrent users; 100 gives
    # comfortable headroom for a field-technician workload.
    loop = asyncio.get_running_loop()
    loop.set_default_executor(ThreadPoolExecutor(max_workers=100))
 
    logger.info("Starting up — initializing Cosmos DB storage...")
    await init_cosmos()
    logger.info("Startup complete.")
    yield
    logger.info("Shutting down — closing Cosmos DB client...")
    await close_cosmos()
    logger.info("Shutdown complete.")
 
 
app = FastAPI(
    title="PSEG Tech Manual Chatbot Prototype",
    description=(
        "Agent-pattern RAG chatbot for GCC High. "
        "Hybrid Azure AI Search + Azure OpenAI, streamed SSE with structured citations. "
        "Persistent chat history via Azure Cosmos DB."
    ),
    version="2.0.0",
    lifespan=lifespan,
)
 
# CORS — production-safe:
#   ALLOWED_ORIGINS="*"         → wildcard, credentials disabled (browser-safe)
#   ALLOWED_ORIGINS=<explicit>  → named origins, credentials enabled
# Both modes are set automatically from the ALLOWED_ORIGINS env var.
# See settings.py for the derivation logic.
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=CORS_ALLOW_CREDENTIALS,
    allow_methods=["*"],
    allow_headers=["*"],
)
 
app.include_router(router)
 
 
@app.get("/health")
async def health() -> dict:
    """Health-check endpoint — probes Cosmos, Search, and OpenAI."""
    from app.config.settings import (
        AZURE_OPENAI_API_KEY,
        AZURE_OPENAI_API_VERSION,
        AZURE_OPENAI_CHAT_DEPLOYMENT,
        AZURE_OPENAI_ENDPOINT,
        AZURE_SEARCH_API_KEY,
        AZURE_SEARCH_ENDPOINT,
        AZURE_SEARCH_INDEX,
    )
    from app.storage.cosmos_client import is_storage_enabled
 
    status: dict[str, str] = {
        "storage": "cosmos" if is_storage_enabled() else "in-memory",
    }
 
    # Probe Azure AI Search — lightweight GET on index stats
    try:
        import httpx
 
        r = httpx.get(
            f"{AZURE_SEARCH_ENDPOINT}/indexes/{AZURE_SEARCH_INDEX}/stats?api-version=2024-05-01-preview",
            headers={"api-key": AZURE_SEARCH_API_KEY},
            timeout=5,
        )
        status["search"] = "ok" if r.status_code == 200 else f"http_{r.status_code}"
    except Exception as exc:
        status["search"] = f"error: {type(exc).__name__}"
 
    # Probe Azure OpenAI — lightweight list-models call
    try:
        import httpx
 
        r = httpx.post(
            f"{AZURE_OPENAI_ENDPOINT}openai/deployments/{AZURE_OPENAI_CHAT_DEPLOYMENT}"
            f"/chat/completions?api-version={AZURE_OPENAI_API_VERSION}",
            headers={"api-key": AZURE_OPENAI_API_KEY},
            json={"messages": [{"role": "user", "content": "ping"}], "max_tokens": 1},
            timeout=10,
        )
        status["openai"] = "ok" if r.status_code == 200 else f"http_{r.status_code}"
    except Exception as exc:
        status["openai"] = f"error: {type(exc).__name__}"
 
    overall = "ok" if all(v == "ok" or v == "cosmos" for v in status.values()) else "degraded"
    return {"status": overall, **status}
 