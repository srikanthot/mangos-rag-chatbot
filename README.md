# PSEG Tech Manual Chatbot

Enterprise RAG chatbot for querying technical manuals. Uses Azure OpenAI, Azure AI Search, and Azure Cosmos DB on GCC High. Streams answers with structured citations via Server-Sent Events.

## Architecture

```
User ──► Next.js Frontend ──► FastAPI Backend ──► Azure OpenAI (GPT)
                                     │
                                     ├──► Azure AI Search (hybrid retrieval)
                                     └──► Azure Cosmos DB (chat history)
```

**Frontend** — Next.js 14 single-page app with multi-conversation chat UI, SSE streaming, citation panel, feedback, and dark mode.

**Backend** — FastAPI service implementing an agent-pattern RAG pipeline: query rewriting → hybrid search (keyword + vector + semantic reranker) → confidence gate → streaming generation → structured citations → persistence.

The frontend and backend are independently deployable. They communicate over HTTP/SSE and share no code or dependencies.

## Repository Structure

```
frontend/          Next.js 14 + React 18 + TypeScript chat UI
  app/             App Router pages and global styles
  components/      React components (chat, sidebar, auth, layout)
  lib/             API client, types, utilities, auth config
  public/          Static assets
  server.js        Custom production server for Azure App Service
  DEPLOYMENT.md    Frontend deployment guide

backend/           Python/FastAPI RAG agent service
  app/             Application package
    agent_runtime/ Retrieve → gate → generate → cite pipeline
    api/           HTTP routes and Pydantic schemas
    auth/          User identity resolution
    config/        Environment-driven settings
    llm/           Agent Framework + OpenAI integration
    storage/       Cosmos DB client and chat store
    tools/         Hybrid search retrieval
  main.py          FastAPI entry point
  startup.sh       Azure App Service startup script
  DEPLOYMENT.md    Backend deployment guide
```

## Prerequisites

- **Frontend**: Node.js >= 18, npm
- **Backend**: Python 3.10+
- **Azure services**: Azure OpenAI, Azure AI Search (with a populated index), Azure Cosmos DB (optional)

## Quick Start

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env        # Fill in Azure credentials
uvicorn main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
# Optionally create .env.local with NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
npm run dev
```

Frontend runs at `http://localhost:3000`, backend at `http://localhost:8000`.

In local dev mode, no Azure Entra auth is required. The frontend generates a debug user ID automatically.

## Environment Files

Each app has its own `.env.example`:

- **`backend/.env.example`** — Azure OpenAI, AI Search, Cosmos DB, CORS, identity settings
- **`frontend/.env.example`** — Backend API URL, Entra ID placeholders

Copy each to `.env` (backend) or `.env.local` (frontend) and fill in values. Never commit actual `.env` files.

## What Is Implemented

- Agent-pattern RAG pipeline with query rewriting and confidence gating
- Hybrid search: keyword + vector + optional semantic reranker with diversity filtering
- SSE streaming responses with keepalive pings
- Structured citations extracted from search results
- Multi-conversation management (create, rename, soft-delete)
- Message history persistence in Cosmos DB with multi-user isolation
- Thumbs-up / thumbs-down feedback storage
- Health check endpoint probing all Azure dependencies
- Dark mode, starter prompts, typing indicator
- Standalone Next.js production server for Azure App Service
- CORS configuration with automatic credential handling

## What Requires Environment Setup

- **Azure OpenAI** — endpoint, API key, and deployment names must be configured
- **Azure AI Search** — endpoint, API key, and a populated search index
- **Azure Cosmos DB** — optional; the backend runs in-memory without it (no persistence)
- **Azure Entra ID** — auth scaffolding exists in the frontend but is not wired; the app uses debug user mode until MSAL is integrated
- **Document URLs** — citation URLs depend on `source_url` field values in the search index

## Deployment

Frontend and backend are deployed independently as separate Azure App Services.

- **Frontend**: Node.js 18+ Web App, startup command `node server.js`. See [frontend/DEPLOYMENT.md](frontend/DEPLOYMENT.md).
- **Backend**: Python 3.10+ Web App, startup command `bash startup.sh`. See [backend/DEPLOYMENT.md](backend/DEPLOYMENT.md).
