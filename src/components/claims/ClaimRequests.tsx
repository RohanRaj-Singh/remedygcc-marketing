"use client";

import { useCallback, useEffect, useState } from "react";
import { HelpCircle, Loader2, Send, MessageSquareText } from "lucide-react";

interface RequestParticipant {
  role: string;
  id: string;
  name: string;
}

interface ClaimRequest {
  requestId: string;
  status: "pending" | "approved" | "rejected" | "more_info" | "converted_to_chat";
  subject: string;
  body: string;
  requester: RequestParticipant;
  responder?: RequestParticipant;
  resolutionNote?: string;
  createdAt: string;
}

interface ClaimRequestsProps {
  claimId: string;
  /** Base URL for the claim's requests, e.g. `/api/employee-access/claims/{id}/requests`. */
  apiBase: string;
  /** If true, the user can only view (used for read-only surfaces if ever needed). */
  readOnly?: boolean;
}

const STATUS_CONFIG: Record<string, { label: string; class: string }> = {
  pending: { label: "Pending", class: "bg-amber-50 text-amber-700 border-amber-200" },
  approved: { label: "Approved", class: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  rejected: { label: "Rejected", class: "bg-red-50 text-red-700 border-red-200" },
  more_info: { label: "Needs more info", class: "bg-sky-50 text-sky-700 border-sky-200" },
  converted_to_chat: { label: "Moved to chat", class: "bg-violet-50 text-violet-700 border-violet-200" },
};

function formatTime(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Errors come as `{ error: string }` or `{ error: { message } }`; always render a string. */
function errorText(data: { error?: unknown } | null, fallback: string): string {
  if (!data) return fallback;
  const e = data.error;
  if (typeof e === "string" && e.trim()) return e;
  if (e && typeof e === "object") {
    const msg = (e as { message?: unknown }).message;
    if (typeof msg === "string" && msg.trim()) return msg;
  }
  return fallback;
}

export default function ClaimRequests({
  claimId,
  apiBase,
  readOnly = false,
}: ClaimRequestsProps) {
  const [requests, setRequests] = useState<ClaimRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");

  const fetchRequests = useCallback(async () => {
    try {
      const res = await fetch(apiBase);
      if (res.ok) {
        const data = await res.json();
        setRequests(data.requests ?? []);
      } else {
        const data = await res.json().catch(() => null);
        setError(errorText(data, "Failed to load requests."));
      }
    } catch {
      setError("Failed to load requests.");
    }
    setLoading(false);
  }, [apiBase]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!subject.trim() || !body.trim()) {
        setError("Please provide a subject and a description.");
        return;
      }
      setSending(true);
      setError("");
      try {
        const res = await fetch(apiBase, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subject: subject.trim(), body: body.trim() }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(errorText(data, "Failed to send request."));
        }
        setSubject("");
        setBody("");
        await fetchRequests();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to send request.");
      } finally {
        setSending(false);
      }
    },
    [subject, body, apiBase, fetchRequests],
  );

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-amber-100">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-amber-100 bg-amber-50/50">
        <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
          <HelpCircle className="w-4.5 h-4.5 text-amber-700" />
        </div>
        <div className="min-w-0">
          <p className="font-satoshi text-[10px] font-bold uppercase tracking-widest text-amber-700/70">
            Ask the organization
          </p>
          <p className="font-satoshi font-bold text-sm text-slate-800 leading-tight">
            Requests
          </p>
        </div>
        <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded-full border border-amber-200 bg-white font-satoshi font-bold text-[11px] text-amber-700">
          {loading ? "…" : `${requests.length}`}
        </span>
      </div>

      {/* Error */}
      {error && !loading && (
        <div className="px-4 pt-3">
          <p className="font-satoshi text-xs text-red-600">{error}</p>
        </div>
      )}

      {/* List */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-[100px]">
        {loading && (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="w-5 h-5 animate-spin text-amber-700" />
          </div>
        )}

        {!loading && requests.length === 0 && (
          <div className="text-center py-5 px-2">
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-3">
              <MessageSquareText className="w-5 h-5 text-amber-600" />
            </div>
            <p className="font-satoshi font-bold text-sm text-slate-700">
              Nothing to ask yet
            </p>
            <p className="font-satoshi text-xs text-slate-400 mt-1">
              Check whether something is possible before you file a claim.
            </p>
          </div>
        )}

        {requests.map((req) => {
          const cfg = STATUS_CONFIG[req.status] ?? {
            label: req.status,
            class: "bg-gray-50 text-gray-600 border-gray-200",
          };
          return (
            <div
              key={req.requestId}
              className="rounded-lg border border-gray-100 p-3 space-y-1.5"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="font-satoshi font-bold text-sm text-slate-800">{req.subject}</p>
                <span className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded-full border font-satoshi font-bold text-[11px] ${cfg.class}`}>
                  {cfg.label}
                </span>
              </div>
              <p className="font-satoshi text-xs text-slate-600 whitespace-pre-wrap">{req.body}</p>
              <p className="font-satoshi text-[11px] text-slate-400">
                {req.requester.name} &middot; {formatTime(req.createdAt)}
              </p>
              {req.resolutionNote && (
                <p className="font-satoshi text-xs text-slate-600 bg-slate-50 rounded-md px-2 py-1.5">
                  <span className="font-bold text-slate-700">Reply:</span> {req.resolutionNote}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Composer */}
      {!readOnly && (
        <form onSubmit={handleSubmit} className="border-t border-amber-100 bg-amber-50/30 px-4 py-3 space-y-2">
          <p className="font-satoshi text-[11px] font-semibold text-amber-800">
            Check before you claim
          </p>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject — e.g. Is an expensive assessment covered?"
            disabled={sending}
            className="w-full rounded-lg border border-amber-200 bg-white px-3 py-2 font-satoshi text-sm text-slate-800 placeholder-slate-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={2}
            placeholder="Describe what you'd like to check with the organization…"
            disabled={sending}
            className="w-full rounded-lg border border-amber-200 bg-white px-3 py-2 font-satoshi text-sm text-slate-800 placeholder-slate-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
          />
          <button
            type="submit"
            disabled={sending}
            className="flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 font-satoshi text-xs font-bold text-white hover:bg-amber-700 disabled:opacity-50"
          >
            {sending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            Send Request
          </button>
        </form>
      )}
    </div>
  );
}