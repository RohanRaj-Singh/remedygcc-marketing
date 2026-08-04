"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MessageSquare, Megaphone, Info, Loader2, Send } from "lucide-react";

interface ChatMessage {
  messageId: string;
  type: "message" | "official_update" | "system";
  participant: { role: string; id: string; name: string };
  body: string;
  createdAt: string;
}

interface ClaimChatProps {
  claimId: string;
  /** Base URL for the claim's messages, e.g. `/api/employee-access/claims/{id}/messages`. */
  apiBase: string;
  readOnly?: boolean;
  /** Visual mode. "card" (default) caps the message list at max-h-80; "panel" fills the parent height with a scrollable list and pinned composer. */
  variant?: "card" | "panel";
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ClaimChat({
  claimId,
  apiBase,
  readOnly = false,
  variant = "card",
}: ClaimChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  const fetchMessages = useCallback(
    async (markRead: boolean) => {
      try {
        const res = await fetch(apiBase);
        if (res.ok) {
          const data = await res.json();
          setMessages(data.messages ?? []);
        }
      } catch {
        /* ignore */
      }
      setLoading(false);
      if (markRead) {
        try {
          await fetch(`${apiBase}/read`, { method: "POST" });
        } catch {
          /* ignore */
        }
      }
    },
    [apiBase],
  );

  useEffect(() => {
    fetchMessages(true);
    const interval = setInterval(() => fetchMessages(true), 30_000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages.length]);

  const handleSend = useCallback(async () => {
    const body = text.trim();
    if (!body || sending) return;
    setSending(true);
    setError("");
    try {
      const res = await fetch(apiBase, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to send message.");
      }
      setText("");
      await fetchMessages(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message.");
    } finally {
      setSending(false);
    }
  }, [text, sending, apiBase, fetchMessages]);

  const isPanel = variant === "panel";

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 ${
        isPanel ? "flex h-full flex-col" : ""
      }`}
    >
      <div className={`mb-3 flex items-center gap-2 ${isPanel ? "shrink-0" : ""}`}>
        <MessageSquare className="w-4 h-4 text-primary" />
        <p className="font-satoshi text-xs text-gray-400 uppercase tracking-wider">Chat</p>
      </div>

      <div
        ref={listRef}
        className={`space-y-3 overflow-y-auto rounded-lg border border-gray-100 bg-gray-50 p-3 ${
          isPanel ? "min-h-0 flex-1" : "max-h-80"
        }`}
      >
        {loading && (
          <p className="py-6 text-center font-satoshi text-xs text-gray-400">Loading messages…</p>
        )}
        {!loading && messages.length === 0 && (
          <p className="py-6 text-center font-satoshi text-xs text-gray-400">
            No messages yet. Ask a question about this claim.
          </p>
        )}
        {messages.map((msg) => {
          if (msg.type === "official_update") {
            return (
              <div key={msg.messageId} className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                <div className="mb-1 flex items-center gap-1.5">
                  <Megaphone className="w-3.5 h-3.5 text-blue-600" />
                  <span className="font-satoshi text-xs font-bold uppercase tracking-wide text-blue-700">
                    Official update
                  </span>
                  <span className="ml-auto font-satoshi text-[11px] text-blue-400">
                    {msg.participant.name} · {formatTime(msg.createdAt)}
                  </span>
                </div>
                <p className="font-satoshi text-sm text-slate-800 whitespace-pre-wrap">{msg.body}</p>
              </div>
            );
          }
          if (msg.type === "system") {
            return (
              <div key={msg.messageId} className="flex justify-center">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 font-satoshi text-[11px] text-gray-500">
                  <Info className="w-3 h-3" />
                  {msg.body}
                  <span className="text-gray-400">· {formatTime(msg.createdAt)}</span>
                </span>
              </div>
            );
          }
          return (
            <div key={msg.messageId} className="rounded-lg bg-white p-3 shadow-sm border border-gray-100">
              <div className="mb-1 flex items-center gap-2">
                <span className="font-satoshi text-xs font-bold text-primary">{msg.participant.name}</span>
                <span className="font-satoshi text-[11px] text-gray-400">{formatTime(msg.createdAt)}</span>
              </div>
              <p className="font-satoshi text-sm text-gray-700 whitespace-pre-wrap">{msg.body}</p>
            </div>
          );
        })}
      </div>

      {!readOnly && (
        <div className={`mt-3 ${isPanel ? "shrink-0" : ""}`}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              // Enter sends; Shift+Enter inserts a newline
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            rows={2}
            placeholder="Write a message to the reviewer…"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 font-satoshi text-sm placeholder-gray-400 focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/10"
          />
          {error && <p className="mt-1 font-satoshi text-xs text-red-600">{error}</p>}
          <div className="mt-2 flex justify-end">
            <button
              type="button"
              onClick={handleSend}
              disabled={sending || !text.trim()}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-satoshi text-xs font-bold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {sending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
