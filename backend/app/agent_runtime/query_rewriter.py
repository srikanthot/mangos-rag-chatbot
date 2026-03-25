"""Query rewriter — reformulates follow-up questions into standalone search queries.
 
When a user asks "explain more about this" or "what about the technical requirements",
the retrieval system has no context from the prior conversation. This module uses a
fast LLM call to rewrite such follow-up questions into self-contained search queries
that include the necessary context (e.g., equipment type, kV rating, topic).
 
The rewrite only fires when there is conversation history AND the question looks like
a follow-up (short, contains pronouns/demonstratives, lacks technical specificity).
"""
 
import logging
 
from openai import AzureOpenAI
 
from app.config.settings import (
    AZURE_OPENAI_API_KEY,
    AZURE_OPENAI_API_VERSION,
    AZURE_OPENAI_CHAT_DEPLOYMENT,
    AZURE_OPENAI_ENDPOINT,
    TRACE_MODE,
)
 
logger = logging.getLogger(__name__)
 
_REWRITE_SYSTEM = (
    "You are a query rewriter for a RAG system. Given a conversation snippet and a "
    "follow-up question, rewrite the follow-up into a single standalone natural-language "
    "question. Focus ONLY on the most recent topic in the conversation \u2014 ignore "
    "earlier unrelated topics. Include the specific subject, equipment type, voltage, "
    "or procedure from the immediately preceding exchange. Preserve the user's intent "
    "and any format instructions (e.g. 'in one line', 'step by step', 'in 15 points'). "
    "Return ONLY the rewritten question — no explanation, no quotes."
)
 
# Module-level singleton client (shared with aoai_embeddings via same config).
_client: AzureOpenAI | None = None
 
 
def _get_client() -> AzureOpenAI:
    global _client
    if _client is None:
        _client = AzureOpenAI(
            azure_endpoint=AZURE_OPENAI_ENDPOINT,
            api_key=AZURE_OPENAI_API_KEY,
            api_version=AZURE_OPENAI_API_VERSION,
            max_retries=3,
        )
    return _client
 
 
def _needs_rewrite(question: str) -> bool:
    """Heuristic: does this question look like a follow-up that needs context?
 
    Returns True for short, vague, or pronoun-heavy questions that would
    retrieve poorly without conversation context.
    """
    q = question.lower().strip()
 
    # Very short questions are almost always follow-ups
    if len(q.split()) <= 6:
        return True
 
    # Contains demonstratives / pronouns referring to prior context
    follow_up_markers = [
        "this", "that", "these", "those", "it ", "its ",
        "the above", "more about", "explain more", "tell me more",
        "elaborate", "go deeper", "expand on", "what about",
        "same ", "previous", "earlier", "you mentioned",
        "can you clarify", "in detail",
    ]
    return any(marker in q for marker in follow_up_markers)
 
 
def rewrite_query(
    question: str,
    history: list,
    max_history_chars: int = 1500,
) -> str:
    """Rewrite a follow-up question into a standalone search query.
 
    Parameters
    ----------
    question:
        The user's current question.
    history:
        List of MessageRecord objects (chronological) from prior turns.
    max_history_chars:
        Truncate history context to this many chars to keep the rewrite fast.
 
    Returns
    -------
    str
        The rewritten standalone query, or the original question if rewriting
        is not needed or fails.
    """
    if not history or not _needs_rewrite(question):
        return question
 
    # Build a compact history summary for the rewrite prompt
    lines: list[str] = []
    total = 0
    for msg in reversed(history):
        role = "User" if msg.role == "user" else "Assistant"
        content = msg.content
        if len(content) > 400:
            content = content[:397] + "…"
        line = f"{role}: {content}"
        if total + len(line) > max_history_chars:
            break
        lines.insert(0, line)
        total += len(line)
 
    if not lines:
        return question
 
    history_text = "\n".join(lines)
 
    try:
        client = _get_client()
        resp = client.chat.completions.create(
            model=AZURE_OPENAI_CHAT_DEPLOYMENT,
            messages=[
                {"role": "system", "content": _REWRITE_SYSTEM},
                {"role": "user", "content": (
                    f"Conversation history:\n{history_text}\n\n"
                    f"Follow-up question: {question}\n\n"
                    "Rewritten standalone search query:"
                )},
            ],
            max_tokens=150,
            temperature=0.0,
        )
        rewritten = resp.choices[0].message.content.strip()
 
        if rewritten and len(rewritten) > 5:
            if TRACE_MODE:
                logger.info(
                    "TRACE | query_rewrite: %r → %r", question, rewritten
                )
            return rewritten
 
    except Exception:
        logger.warning("Query rewrite failed — using original question", exc_info=True)
 
    return question
 
