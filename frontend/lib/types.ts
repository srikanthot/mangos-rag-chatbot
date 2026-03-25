export type ThemeMode = "light" | "dark";

/** Matches backend ConversationRecord response */
export interface Conversation {
  thread_id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  last_message_at: string | null;
  last_user_message_preview: string;
  last_assistant_message_preview: string;
  message_count: number;
  is_deleted: boolean;
}

/** Matches backend MessageRecord response */
export interface Message {
  id: string;
  thread_id: string;
  role: "user" | "assistant";
  content: string;
  citations: Citation[];
  created_at: string;
  sequence: number;
  status: "complete" | "partial" | "error";
}

/** Matches backend citation shape from SSE citations event */
export interface Citation {
  source: string;
  title: string;
  section: string;
  page: string;
  url: string;
  chunk_id: string;
}

/** POST /chat or /chat/stream request body */
export interface ChatRequest {
  question: string;
  session_id: string | null;
}

/** POST /chat response body */
export interface ChatResponse {
  answer: string;
  citations: Citation[];
  thread_id: string;
  session_id: string;
}

/** POST /feedback request body */
export interface FeedbackPayload {
  thread_id: string;
  message_id: string;
  rating: "up" | "down";
  comment: string;
}

/** GET /health response */
export interface HealthStatus {
  status: "ok" | "degraded";
  storage: string;
  search: string;
  openai: string;
}

/** Parsed result from streaming chat */
export interface StreamResult {
  content: string;
  citations: Citation[];
  thread_id: string | null;
}
