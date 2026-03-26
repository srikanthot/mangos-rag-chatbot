"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import EmptyState from "@/components/layout/EmptyState";
import ChatShell from "@/components/chat/ChatShell";
import InfoModal from "@/components/layout/InfoModal";
import WelcomeModal from "@/components/layout/WelcomeModal";
import * as api from "@/lib/api";
import { getDebugUserId, getUserName, setUserName } from "@/lib/utils";
import { isEntraConfigured } from "@/lib/auth-config";
import type { Conversation, Message, Citation, ThemeMode } from "@/lib/types";

interface Toast {
  id: number;
  message: string;
  type: "error" | "success";
}

let toastIdCounter = 0;

export default function Home() {
  const [theme, setTheme] = useState<ThemeMode>("light");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [infoOpen, setInfoOpen] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [backendOnline, setBackendOnline] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [showWelcome, setShowWelcome] = useState(false);

  // Ref to track the streaming assistant message content for stable updates
  const streamContentRef = useRef("");
  const streamCitationsRef = useRef<Citation[]>([]);
  const streamMsgIdRef = useRef("");
  // AbortController for cancelling in-flight streams
  const abortControllerRef = useRef<AbortController | null>(null);
  // Track active conversation ID during stream to detect stale callbacks
  const activeThreadRef = useRef<string | null>(null);

  // ── Toast helper ────────────────────────────────────────────────
  const showToast = useCallback(
    (message: string, type: "error" | "success" = "error") => {
      const id = ++toastIdCounter;
      setToasts((prev) => [...prev.slice(-2), { id, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3500);
    },
    []
  );

  // ── Theme persistence ──────────────────────────────────────────
  useEffect(() => {
    const saved = localStorage.getItem("theme") as ThemeMode | null;
    if (saved === "dark" || saved === "light") {
      setTheme(saved);
      document.documentElement.setAttribute("data-theme", saved);
    }
    // In debug mode: ensure debug user exists and prompt for name
    // In Entra mode: identity comes from Microsoft — skip WelcomeModal
    if (!isEntraConfigured()) {
      getDebugUserId();
      if (!getUserName()) {
        setShowWelcome(true);
      }
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  };

  // ── Load conversations on mount ────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const convs = await api.listConversations();
        if (!cancelled) {
          setConversations(convs);
          setBackendOnline(true);
        }
      } catch {
        if (!cancelled) setBackendOnline(false);
      } finally {
        if (!cancelled) setLoadingConversations(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // ── Periodic health check (every 30s) ──────────────────────────
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await api.checkHealth();
        setBackendOnline(true);
      } catch {
        setBackendOnline(false);
      }
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // ── Keep activeThreadRef in sync ───────────────────────────────
  useEffect(() => {
    activeThreadRef.current = activeConversation?.thread_id ?? null;
  }, [activeConversation]);

  // ── Cancel any active stream ──────────────────────────────────
  const cancelStream = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);
  }, []);

  // ── Select conversation & load messages ────────────────────────
  const handleSelectConversation = useCallback(
    async (conv: Conversation) => {
      cancelStream();
      setActiveConversation(conv);
      setMessages([]);
      setLoadingMessages(true);
      try {
        const msgs = await api.getMessages(conv.thread_id);
        setMessages(msgs);
      } catch {
        setMessages([]);
        showToast("Failed to load messages");
      } finally {
        setLoadingMessages(false);
      }
    },
    [cancelStream, showToast]
  );

  // ── New chat — creates a real backend conversation ─────────────
  const handleNewChat = useCallback(async () => {
    cancelStream();
    try {
      const conv = await api.createConversation("New Chat");
      setActiveConversation(conv);
      setMessages([]);
      setConversations((prev) => [conv, ...prev]);
    } catch {
      // Fallback: clear UI even if backend fails
      setActiveConversation(null);
      setMessages([]);
      showToast("Failed to create conversation");
    }
  }, [cancelStream, showToast]);

  // ── Keyboard shortcuts (Ctrl+N for new chat) ────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "n") {
        e.preventDefault();
        handleNewChat();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleNewChat]);

  // ── Helper: ensure an active conversation exists ───────────────
  const ensureConversation = useCallback(async (): Promise<Conversation | null> => {
    if (activeConversation) return activeConversation;
    try {
      const conv = await api.createConversation("New Chat");
      setActiveConversation(conv);
      setMessages([]);
      setConversations((prev) => [conv, ...prev]);
      return conv;
    } catch {
      showToast("Failed to create conversation");
      return null;
    }
  }, [activeConversation, showToast]);

  // ── Delete conversation ────────────────────────────────────────
  const handleDeleteConversation = useCallback(
    async (threadId: string) => {
      // Optimistic removal
      setConversations((prev) =>
        prev.filter((c) => c.thread_id !== threadId)
      );
      if (activeConversation?.thread_id === threadId) {
        cancelStream();
        setActiveConversation(null);
        setMessages([]);
      }
      try {
        await api.deleteConversation(threadId);
      } catch {
        // Restore on failure — re-fetch list
        showToast("Failed to delete conversation");
        try {
          const convs = await api.listConversations();
          setConversations(convs);
        } catch {
          // ignore
        }
      }
    },
    [activeConversation, cancelStream, showToast]
  );

  // ── Rename conversation ────────────────────────────────────────
  const handleRenameConversation = useCallback(
    async (threadId: string, title: string) => {
      // Optimistic update
      setConversations((prev) =>
        prev.map((c) =>
          c.thread_id === threadId ? { ...c, title } : c
        )
      );
      if (activeConversation?.thread_id === threadId) {
        setActiveConversation((prev) =>
          prev ? { ...prev, title } : prev
        );
      }
      try {
        const updated = await api.renameConversation(threadId, title);
        setConversations((prev) =>
          prev.map((c) => (c.thread_id === threadId ? updated : c))
        );
        if (activeConversation?.thread_id === threadId) {
          setActiveConversation(updated);
        }
      } catch {
        showToast("Failed to rename conversation");
        // Re-fetch to restore
        try {
          const convs = await api.listConversations();
          setConversations(convs);
        } catch {
          // ignore
        }
      }
    },
    [activeConversation, showToast]
  );

  // ── Send message (streaming) ───────────────────────────────────
  const handleSendMessage = useCallback(
    async (content: string) => {
      // Cancel any in-flight stream before starting a new one
      cancelStream();

      // Ensure a real backend conversation exists before sending
      const conv = await ensureConversation();
      if (!conv) return;
      const sessionId = conv.thread_id;

      // Create AbortController for this stream
      const controller = new AbortController();
      abortControllerRef.current = controller;

      // Optimistic user message
      const tempUserId = `temp-user-${Date.now()}`;
      const userMsg: Message = {
        id: tempUserId,
        thread_id: sessionId,
        role: "user",
        content,
        citations: [],
        created_at: new Date().toISOString(),
        sequence: 0,
        status: "complete",
      };
      setMessages((prev) => [...prev, userMsg]);
      setIsStreaming(true);

      // Prepare streaming assistant placeholder
      const assistantMsgId = `temp-assistant-${Date.now()}`;
      streamMsgIdRef.current = assistantMsgId;
      streamContentRef.current = "";
      streamCitationsRef.current = [];

      const assistantPlaceholder: Message = {
        id: assistantMsgId,
        thread_id: sessionId,
        role: "assistant",
        content: "",
        citations: [],
        created_at: new Date().toISOString(),
        sequence: 0,
        status: "partial",
      };
      setMessages((prev) => [...prev, assistantPlaceholder]);

      await api.streamChat(
        content,
        sessionId,
        {
          onToken: (token) => {
            if (controller.signal.aborted) return;
            streamContentRef.current += token;
            const currentContent = streamContentRef.current;
            const id = streamMsgIdRef.current;
            setMessages((prev) =>
              prev.map((m) =>
                m.id === id ? { ...m, content: currentContent } : m
              )
            );
          },

          onCitations: (citations) => {
            if (controller.signal.aborted) return;
            streamCitationsRef.current = citations;
            const id = streamMsgIdRef.current;
            setMessages((prev) =>
              prev.map((m) => (m.id === id ? { ...m, citations } : m))
            );
          },

          onDone: () => {
            if (controller.signal.aborted) return;
            const id = streamMsgIdRef.current;
            const finalCitations = streamCitationsRef.current;
            setMessages((prev) =>
              prev.map((m) =>
                m.id === id
                  ? { ...m, status: "complete", citations: finalCitations }
                  : m
              )
            );
            setIsStreaming(false);

            // Refresh conversation list to pick up updated titles
            api
              .listConversations()
              .then((convs) => {
                setConversations(convs);
                // Update active conversation metadata (title may have changed)
                const updated = convs.find((c) => c.thread_id === sessionId);
                if (updated) {
                  setActiveConversation(updated);
                }
              })
              .catch(() => {});
          },

          onError: (error) => {
            if (controller.signal.aborted) return;
            const id = streamMsgIdRef.current;
            const errorContent =
              error instanceof api.ApiError && error.status === 404
                ? "Conversation not found. Please start a new chat."
                : "Sorry, an error occurred while generating the response. Please try again.";
            setMessages((prev) =>
              prev.map((m) =>
                m.id === id
                  ? {
                      ...m,
                      content: errorContent,
                      status: "error",
                      citations: [],
                    }
                  : m
              )
            );
            setIsStreaming(false);
          },
        },
        controller.signal
      );
    },
    [cancelStream, ensureConversation]
  );

  // ── Refresh conversations ──────────────────────────────────────
  const handleRefreshConversations = useCallback(async () => {
    try {
      const convs = await api.listConversations();
      setConversations(convs);
      setBackendOnline(true);
    } catch {
      // silent
    }
  }, []);

  // ── Starter prompt from empty state ────────────────────────────
  const handleStarterPrompt = useCallback(
    (prompt: string) => {
      handleSendMessage(prompt);
    },
    [handleSendMessage]
  );

  // ── Feedback (with optional comment) ───────────────────────────
  const handleFeedback = useCallback(
    async (messageId: string, rating: "up" | "down", comment?: string) => {
      const threadId = activeConversation?.thread_id;
      if (!threadId) return;
      try {
        await api.submitFeedback({
          thread_id: threadId,
          message_id: messageId,
          rating,
          comment: comment ?? "",
        });
      } catch {
        showToast("Failed to submit feedback");
      }
    },
    [activeConversation, showToast]
  );

  // ── Retry last message ────────────────────────────────────────
  const handleRetry = useCallback(
    (lastUserContent: string) => {
      if (!activeConversation || isStreaming) return;
      // Remove the last assistant message (and optionally the last user message
      // since we'll re-send it)
      setMessages((prev) => {
        const copy = [...prev];
        // Remove trailing assistant message
        if (copy.length > 0 && copy[copy.length - 1].role === "assistant") {
          copy.pop();
        }
        // Remove trailing user message (we'll re-add it via handleSendMessage)
        if (copy.length > 0 && copy[copy.length - 1].role === "user") {
          copy.pop();
        }
        return copy;
      });
      // Re-send the same question
      handleSendMessage(lastUserContent);
    },
    [activeConversation, isStreaming, handleSendMessage]
  );

  // ── Refresh messages for active conversation (tab focus) ─────
  const handleRefreshMessages = useCallback(async () => {
    if (!activeConversation) return;
    try {
      const msgs = await api.getMessages(activeConversation.thread_id);
      setMessages(msgs);
    } catch {
      // silent — don't disrupt the user
    }
  }, [activeConversation]);

  // Show ChatShell when there's an active conversation (even with 0 messages)
  const showChatShell = activeConversation !== null;

  // Extract up to 3 unique recent user questions for personalized "Try Asking"
  const recentQuestions = conversations
    .filter((c) => c.last_user_message_preview && c.last_user_message_preview.trim())
    .map((c) => c.last_user_message_preview.trim())
    .filter((q, i, arr) => arr.indexOf(q) === i) // deduplicate
    .slice(0, 3);

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        background: "var(--color-bg-sidebar)",
      }}
    >
      <Sidebar
        open={sidebarOpen}
        theme={theme}
        onToggleTheme={toggleTheme}
        conversations={conversations}
        activeConversationId={activeConversation?.thread_id ?? null}
        onNewChat={handleNewChat}
        onSelectConversation={handleSelectConversation}
        onDeleteConversation={handleDeleteConversation}
        onRenameConversation={handleRenameConversation}
        onRefreshConversations={handleRefreshConversations}
        loading={loadingConversations}
        backendOnline={backendOnline}
      />
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          background: "var(--color-bg-primary)",
          borderRadius: "14px 14px 6px 6px",
          margin: "8px 8px 2px 0",
          overflow: "hidden",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <Header
          conversationTitle={activeConversation?.title ?? null}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onOpenInfo={() => setInfoOpen(true)}
        />
        <main
          className="main-watermark"
          style={{ flex: 1, overflow: "hidden", position: "relative" }}
        >
          {!backendOnline && !activeConversation ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                gap: "var(--spacing-md)",
                padding: "var(--spacing-2xl)",
                textAlign: "center",
                position: "relative",
                zIndex: 1,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "var(--radius-lg)",
                  background: "var(--color-accent-light)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    stroke="var(--color-warning)"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M12 8v4M12 16v.01"
                    stroke="var(--color-warning)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h2
                style={{
                  fontSize: "var(--font-size-xl)",
                  fontWeight: 600,
                }}
              >
                Backend Unavailable
              </h2>
              <p
                style={{
                  fontSize: "var(--font-size-base)",
                  color: "var(--color-text-secondary)",
                  maxWidth: 420,
                  lineHeight: 1.6,
                }}
              >
                Unable to connect to the API server. Make sure the backend is
                running and <code>NEXT_PUBLIC_API_BASE_URL</code> is set
                correctly.
              </p>
              <button
                onClick={() => {
                  setLoadingConversations(true);
                  api
                    .listConversations()
                    .then((convs) => {
                      setConversations(convs);
                      setBackendOnline(true);
                    })
                    .catch(() => setBackendOnline(false))
                    .finally(() => setLoadingConversations(false));
                }}
                style={{
                  padding: "10px 24px",
                  borderRadius: "var(--radius-md)",
                  background: "var(--color-accent)",
                  color: "var(--color-text-inverse)",
                  fontWeight: 600,
                  fontSize: "var(--font-size-sm)",
                  marginTop: "var(--spacing-sm)",
                }}
              >
                Retry
              </button>
            </div>
          ) : showChatShell ? (
            <ChatShell
              conversation={activeConversation!}
              messages={messages}
              isStreaming={isStreaming}
              loadingMessages={loadingMessages}
              onSend={handleSendMessage}
              onFeedback={handleFeedback}
              onStarterPrompt={handleStarterPrompt}
              onRetry={handleRetry}
              onRefreshMessages={handleRefreshMessages}
            />
          ) : (
            <EmptyState onStarterPrompt={handleStarterPrompt} onNewChat={handleNewChat} recentQuestions={recentQuestions} />
          )}
        </main>
      </div>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <InfoModal open={infoOpen} onClose={() => setInfoOpen(false)} />

      {/* Welcome modal — first visit */}
      {showWelcome && (
        <WelcomeModal
          onSubmit={(name) => {
            setUserName(name);
            setShowWelcome(false);
          }}
        />
      )}

      {/* Toast notifications */}
      {toasts.length > 0 && (
        <div className="toast-container" role="status" aria-live="polite">
          {toasts.map((t) => (
            <div key={t.id} className={`toast toast-${t.type}`}>
              {t.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
