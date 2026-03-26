"""Pre-retrieval intent classifier for the PSEG Tech Manual Chatbot.

Classifies user input BEFORE the RAG pipeline runs.  Three outcomes:

  - GREETING / CHITCHAT / ACKNOWLEDGEMENT / SELF_DESCRIPTION / GIBBERISH
        → Return a canned friendly response.  No search, no LLM call.
  - VAGUE_QUERY
        → Return a polite clarification request.  No search, no LLM call.
  - TECHNICAL_QUESTION
        → Proceed to the full RAG pipeline (retrieve → gate → generate).

This module intentionally uses only deterministic pattern matching — no LLM
call — so it adds zero latency and zero cost.  The patterns are tuned for
a field-technician audience using a technical manual chatbot.
"""

import re
import logging

logger = logging.getLogger(__name__)

# ─── Intent types ──────────────────────────────────────────────────────────
INTENT_GREETING = "greeting"
INTENT_ACKNOWLEDGEMENT = "acknowledgement"
INTENT_SELF_DESCRIPTION = "self_description"
INTENT_GIBBERISH = "gibberish"
INTENT_VAGUE_QUERY = "vague_query"
INTENT_OUT_OF_SCOPE = "out_of_scope"
INTENT_TECHNICAL = "technical"

# ─── Pattern sets ──────────────────────────────────────────────────────────

# Greetings — exact or near-exact matches (lowered, stripped)
_GREETINGS = {
    "hi", "hello", "hey", "hiya", "howdy", "sup", "yo",
    "good morning", "good afternoon", "good evening", "good night",
    "morning", "afternoon", "evening",
    "hi there", "hello there", "hey there",
    "greetings", "hola", "namaste",
    "how are you", "how are you doing", "how's it going",
    "what's up", "whats up", "wassup",
}

# Acknowledgements / thank-yous / farewells
_ACKNOWLEDGEMENTS = {
    "ok", "okay", "k", "fine", "sure", "yes", "no", "yep", "nope",
    "got it", "understood", "alright", "right", "cool", "great",
    "thanks", "thank you", "thank you so much", "thanks a lot",
    "thx", "ty", "appreciate it", "cheers",
    "bye", "goodbye", "bye bye", "see you", "take care",
    "that's all", "thats all", "nothing else", "no more questions",
    "that is all", "no thanks", "no thank you",
    "good", "nice", "perfect", "awesome", "wonderful", "excellent",
}

# Self-description questions
_SELF_DESCRIPTION_PATTERNS = [
    r"^who are you",
    r"^what are you",
    r"^what can you do",
    r"^what do you do",
    r"^what is this",
    r"^what's this",
    r"^help$",
    r"^what is this (chat|bot|app|tool)",
    r"^how does this (work|chat|bot)",
    r"^are you (a |an )?(bot|ai|robot|chatbot|assistant)",
    r"^tell me about yourself",
    r"^introduce yourself",
]

# Out-of-scope patterns — clearly non-technical-manual questions
_OUT_OF_SCOPE_PATTERNS = [
    r"(weather|temperature|forecast)\s*(today|tomorrow|this week)?",
    r"(who is|who's) the (ceo|president|cfo|manager|director)",
    r"(write|create|generate|code|build)\s*(me )?(a |an )?(python|javascript|java|code|script|program|app|website)",
    r"(capital|population|area) of \w+",
    r"(recipe|cook|bake|ingredients)\s",
    r"(movie|film|song|music|game|sport)\s",
    r"(stock|crypto|bitcoin|market|invest)",
    r"(joke|funny|laugh|humor)",
    r"(translate|translation)\s",
    r"(news|politics|election)",
    r"(math|calculate|solve)\s.*\d",
    r"explain (quantum|relativity|evolution|philosophy|psychology)",
]

# ─── Canned responses ──────────────────────────────────────────────────────

GREETING_RESPONSE = (
    "Hello! I'm the PSEG Tech Manual Assistant. I can help you find information "
    "from PSEG technical manuals — including procedures, safety requirements, "
    "specifications, and troubleshooting steps.\n\n"
    "What would you like to know?"
)

ACKNOWLEDGEMENT_RESPONSE = (
    "You're welcome! Let me know if you have any other questions about the "
    "technical manuals."
)

SELF_DESCRIPTION_RESPONSE = (
    "I'm the PSEG Tech Manual Assistant. I answer questions using information "
    "from PSEG's technical manuals and procedure documents.\n\n"
    "I can help with:\n"
    "- Equipment procedures (installation, maintenance, testing)\n"
    "- Safety requirements and protocols\n"
    "- Technical specifications and ratings\n"
    "- Troubleshooting and fault procedures\n"
    "- Switching and grounding procedures\n\n"
    "Ask me a specific question and I'll find the relevant information "
    "with source citations."
)

GIBBERISH_RESPONSE = (
    "I didn't quite understand that. Could you ask a question about the PSEG "
    "technical manuals? For example:\n"
    "- \"What are the safety requirements for underground cable work?\"\n"
    "- \"How do I test insulation resistance?\"\n"
    "- \"What is the procedure for transformer maintenance?\""
)

OUT_OF_SCOPE_RESPONSE = (
    "I can only answer questions based on the PSEG technical manuals. "
    "That topic doesn't appear to be covered in the manuals I have access to.\n\n"
    "Try asking about equipment procedures, safety requirements, specifications, "
    "or troubleshooting steps."
)

VAGUE_QUERY_RESPONSE = (
    "Your question is a bit broad — the technical manuals cover many different "
    "equipment types and procedures.\n\n"
    "Could you be more specific? For example:\n"
    "- Which equipment or system are you asking about?\n"
    "- What specific procedure, task, or specification do you need?\n"
    "- Is there a particular voltage, model, or manual section?\n\n"
    "The more detail you provide, the better I can find the right information."
)


# ─── Classifier ────────────────────────────────────────────────────────────

def _strip_punctuation(text: str) -> str:
    """Remove trailing punctuation and extra whitespace."""
    return re.sub(r"[.!?,;:]+$", "", text.strip()).strip()


def _count_meaningful_words(text: str) -> int:
    """Count words that aren't stopwords or filler."""
    stopwords = {
        "a", "an", "the", "is", "are", "was", "were", "be", "been",
        "am", "do", "does", "did", "have", "has", "had", "will",
        "would", "could", "should", "can", "may", "might", "shall",
        "to", "of", "in", "on", "at", "by", "for", "with", "from",
        "up", "out", "if", "or", "and", "but", "not", "no", "so",
        "as", "it", "its", "this", "that", "what", "how", "which",
        "when", "where", "who", "why", "me", "my", "i", "you", "your",
        "we", "our", "they", "them", "their", "he", "she", "his", "her",
        "please", "tell", "give", "show", "explain", "about",
    }
    words = re.findall(r"[a-z0-9]+", text.lower())
    return sum(1 for w in words if w not in stopwords and len(w) > 1)


def _is_gibberish(text: str) -> bool:
    """Detect keyboard spam, random characters, or meaningless input."""
    cleaned = re.sub(r"[^a-zA-Z0-9\s]", "", text).strip()
    if not cleaned:
        return True
    # Very short with no real words
    words = cleaned.split()
    if len(words) <= 2 and all(len(w) <= 2 for w in words):
        return True
    # Repeated characters like "aaaaaa" or "asdfgh"
    if len(cleaned) >= 3 and len(set(cleaned.replace(" ", ""))) <= 3:
        return True
    return False


def _is_vague_no_history(question: str, has_history: bool) -> bool:
    """Detect vague queries that need clarification.

    Only triggers for genuinely vague questions — NOT for specific short
    questions like 'transformer maintenance procedure'.
    """
    q = question.lower().strip()
    meaningful = _count_meaningful_words(q)

    # Very vague single-concept queries without specificity
    vague_patterns = [
        r"^(what|how)\s+(about|is|are)\s+(the\s+)?(procedure|steps|process|requirements?|specifications?|specs?)(\?)?$",
        r"^(tell|show|give)\s+me\s+(about\s+)?(the\s+)?(procedure|steps|process|requirements?|specifications?|specs?)(\?)?$",
        r"^(safety|maintenance|installation|testing|troubleshooting|inspection|procedure)(\?)?$",
        r"^(what|how)\s+(about|is)\s+(safety|maintenance|installation|testing)(\?)?$",
        r"^(the\s+)?(procedure|steps|requirements?|specifications?)(\?)?$",
    ]
    if any(re.match(p, q) for p in vague_patterns):
        return True

    # Pronoun-heavy with no history (first message in conversation)
    if not has_history:
        pronoun_patterns = [
            r"\b(it|this|that|these|those|the one|the same)\b",
        ]
        if meaningful <= 1 and any(re.search(p, q) for p in pronoun_patterns):
            return True

    return False


def classify_intent(
    question: str,
    has_history: bool = False,
) -> tuple[str, str | None]:
    """Classify user intent before retrieval.

    Parameters
    ----------
    question : str
        The raw user input.
    has_history : bool
        Whether there are prior messages in this conversation.

    Returns
    -------
    (intent, canned_response)
        If canned_response is not None, the pipeline should short-circuit
        and return it directly (no retrieval, no LLM).
        If canned_response is None, proceed with the full RAG pipeline.
    """
    raw = question.strip()
    if not raw:
        return INTENT_GIBBERISH, GIBBERISH_RESPONSE

    normalized = _strip_punctuation(raw).lower()

    # 1. Exact-match greetings
    if normalized in _GREETINGS:
        logger.info("Intent: greeting | input=%r", raw)
        return INTENT_GREETING, GREETING_RESPONSE

    # 2. Exact-match acknowledgements
    if normalized in _ACKNOWLEDGEMENTS:
        logger.info("Intent: acknowledgement | input=%r", raw)
        return INTENT_ACKNOWLEDGEMENT, ACKNOWLEDGEMENT_RESPONSE

    # 3. Self-description questions
    for pattern in _SELF_DESCRIPTION_PATTERNS:
        if re.match(pattern, normalized):
            logger.info("Intent: self_description | input=%r", raw)
            return INTENT_SELF_DESCRIPTION, SELF_DESCRIPTION_RESPONSE

    # 4. Gibberish / nonsense
    if _is_gibberish(raw):
        logger.info("Intent: gibberish | input=%r", raw)
        return INTENT_GIBBERISH, GIBBERISH_RESPONSE

    # 5. Out-of-scope topics
    for pattern in _OUT_OF_SCOPE_PATTERNS:
        if re.search(pattern, normalized):
            logger.info("Intent: out_of_scope | input=%r", raw)
            return INTENT_OUT_OF_SCOPE, OUT_OF_SCOPE_RESPONSE

    # 6. Vague queries needing clarification
    if _is_vague_no_history(raw, has_history):
        logger.info("Intent: vague_query | input=%r", raw)
        return INTENT_VAGUE_QUERY, VAGUE_QUERY_RESPONSE

    # 7. Proceed with RAG pipeline
    return INTENT_TECHNICAL, None
