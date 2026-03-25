import type {
  Conversation,
  Message,
  Citation,
  FeedbackPayload,
  HealthStatus,
} from "./types";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  // Debug user identity for local dev without Entra auth.
  // In production, the backend extracts identity from the Entra token
  // forwarded by Azure App Service EasyAuth. This header is ignored
  // when real auth is active.
  if (typeof window !== "undefined") {
    const debugUser = localStorage.getItem("debug_user_id");
    if (debugUser) {
      headers["X-Debug-User-Id"] = debugUser;
    }
  }
  return headers;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { ...getHeaders(), ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new ApiError(res.status, text);
  }
  return res.json() as Promise<T>;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public body: string
  ) {
    super(`API ${status}: ${body}`);
    this.name = "ApiError";
  }
}

// ─── Health ────────────────────────────────────────────────────────
export async function checkHealth(): Promise<HealthStatus> {
  return request<HealthStatus>("/health");
}

// ─── Conversations ─────────────────────────────────────────────────
export async function listConversations(
  limit = 20
): Promise<Conversation[]> {
  return request<Conversation[]>(`/conversations?limit=${limit}`);
}

export async function createConversation(
  title?: string
): Promise<Conversation> {
  return request<Conversation>("/conversations", {
    method: "POST",
    body: JSON.stringify({ title: title ?? null }),
  });
}

export async function renameConversation(
  threadId: string,
  title: string
): Promise<Conversation> {
  return request<Conversation>(`/conversations/${threadId}`, {
    method: "PATCH",
    body: JSON.stringify({ title }),
  });
}

export async function deleteConversation(
  threadId: string
): Promise<{ deleted: boolean }> {
  return request<{ deleted: boolean }>(`/conversations/${threadId}`, {
    method: "DELETE",
  });
}

// ─── Messages ──────────────────────────────────────────────────────
export async function getMessages(
  threadId: string,
  limit = 50
): Promise<Message[]> {
  return request<Message[]>(
    `/conversations/${threadId}/messages?limit=${limit}`
  );
}

// ─── Chat (streaming) ──────────────────────────────────────────────
export interface StreamCallbacks {
  onToken: (token: string) => void;
  onCitations: (citations: Citation[]) => void;
  onDone: () => void;
  onError: (error: Error) => void;
}

/**
 * Stream a chat response via SSE.
 * Pass an AbortSignal to cancel the stream when the user switches
 * conversations or starts a new chat mid-generation.
 */
export async function streamChat(
  question: string,
  sessionId: string | null,
  callbacks: StreamCallbacks,
  signal?: AbortSignal
): Promise<void> {
  if (signal?.aborted) return;

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}/chat/stream`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ question, session_id: sessionId }),
      signal,
    });
  } catch (err) {
    // AbortError is expected when caller cancels — not a real error
    if (err instanceof DOMException && err.name === "AbortError") return;
    callbacks.onError(
      err instanceof Error ? err : new Error("Network error")
    );
    return;
  }

  if (!res.ok || !res.body) {
    const text = await res.text().catch(() => res.statusText);
    callbacks.onError(new ApiError(res.status, text));
    return;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      if (signal?.aborted) {
        reader.cancel();
        return;
      }

      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      // Keep incomplete last line in buffer
      buffer = lines.pop() ?? "";

      let currentEvent = "";
      for (const line of lines) {
        if (line.startsWith("event: ")) {
          currentEvent = line.slice(7).trim();
        } else if (line.startsWith("data: ")) {
          const data = line.slice(6);

          if (data === "[DONE]") {
            callbacks.onDone();
            return;
          }

          if (currentEvent === "citations") {
            try {
              const parsed = JSON.parse(data);
              if (parsed.citations) {
                callbacks.onCitations(parsed.citations);
              }
            } catch {
              // Ignore malformed citation JSON
            }
            currentEvent = "";
          } else if (currentEvent === "ping") {
            // Ignore keepalive
            currentEvent = "";
          } else {
            // Content token — unescape literal \n back to newlines
            const token = data.replace(/\\n/g, "\n");
            callbacks.onToken(token);
            currentEvent = "";
          }
        } else if (line === "") {
          // Blank line resets event context per SSE spec
          currentEvent = "";
        }
      }
    }
    // Stream ended without [DONE] — still notify
    callbacks.onDone();
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") return;
    callbacks.onError(
      err instanceof Error ? err : new Error("Stream read error")
    );
  }
}

// ─── Feedback ──────────────────────────────────────────────────────
export async function submitFeedback(
  payload: FeedbackPayload
): Promise<void> {
  await request<{ status: string }>("/feedback", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
