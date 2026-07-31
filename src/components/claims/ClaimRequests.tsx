"use client";

import { useCallback, useEffect, useState } from "react";
import { ClipboardList, Loader2, Send } from "lucide-react";

interface ClaimRequest {
  requestId: string;
  subject: string;
  details: string;
  status: "pending" | "approved" | "rejected" | "more_info" | "converted_to_chat";
  requester: { role: string; id: string; name: string };
  decisionNote?: string;
  createdAt: string;
}

const STATUS_CONFIG: Record<string, { label: string; class: string }> = {
  pending: { label: "Pending", class: "bg-amber-50 text-amber-700 border-amber-200" },
  approved: { label: "Approved", class: "bg-green-50 text-green-700 border-green-200" },
  rejected: { label: "Rejected", class: "bg-red-50 text-red-700 border-red-200" },
  more_info: { label: "Needs more info", class: "bg-blue-50 text-blue-700 border-blue-200" },
  converted_to_chat: { label: "Converted to chat", class: "bg-purple-50 text-purple-700 border-purple-200" },
};

interface ClaimRequestsProps {
  claimId: string;
  /** Base URL for the claim's requests, e.g. `/api/employee-access/claims/{id}/requests`. */
  apiBase: string;
  canCreate?: boolean;
  canDecide?: boolean;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ClaimRequests({
  claimId,
  apiBase,
  canCreate = false,
  canDecide = false,
}: ClaimRequestsProps) {
  const [requests, setRequests] = useState<ClaimRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [newSubject, setNewSubject] = useState("");
  const [newDetails, setNewDetails] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const fetchRequests = useCallback(async () => {
    try {
      const res = await fetch(apiBase);
      if (res.ok) {
        const data = await res.json();
        setRequests(data.requests ?? []);
      }
    } catch {
      /* ignore */
    }
    setLoading(false);
  }, [apiBase]);

  useEffect(() => {
    fetchRequests();
    const interval = setInterval(fetchRequests, 30_000);
    return () => clearInterval(interval);
  }, [fetchRequests]);

  const handleCreate = useCallback(async () => {
    const subject = newSubject.trim();
    const details = newDetails.trim();
    if (!subject || !details || creating) return;
    setCreating(true);
    setError("");
    try {
      const res = await fetch(apiBase, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, details }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to create request.");
      }
      setNewSubject("");
      setNewDetails("");
      await fetchRequests();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create request.");
    } finally {
      setCreating(false);
    }
  }, [newSubject, newDetails, creating, apiBase, fetchRequests]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="mb-3 flex items-center gap-2">
        <ClipboardList className="w-4 h-4 text-primary" />
        <p className="font-satoshi text-xs text-gray-400 uppercase tracking-wider">Requests</p>
      </div>

      <div className="space-y-3">
        {loading && (
          <p className="py-6 text-center font-satoshi text-xs text-gray-400">Loading requests…</p>
        )}
        {!loading && requests.length === 0 && (
          <p className="py-6 text-center font-satoshi text-xs text-gray-400">No requests yet.</p>
        )}

        {requests.map((req) => {
          const cfg = STATUS_CONFIG[req.status] ?? STATUS_CONFIG.pending;
          return (
            <div key={req.requestId} className="rounded-lg border border-gray-100 bg-gray-50 p-4">
              <div className="flex items-center gap-2">
                <span className="font-satoshi text-sm font-bold text-primary">{req.subject}</span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full border font-satoshi font-bold text-xs ${cfg.class}`}>
                  {cfg.label}
                </span>
              </div>
              <p className="mt-1 font-satoshi text-sm text-gray-600 whitespace-pre-wrap">{req.details}</p>
              <p className="mt-1 font-satoshi text-[11px] text-gray-400">
                {req.requester.name} · {formatDate(req.createdAt)}
              </p>

              {req.decisionNote && (
                <p className="mt-2 rounded-lg border border-gray-100 bg-white p-2 font-satoshi text-xs text-gray-600">
                  <span className="font-bold">Decision:</span> {req.decisionNote}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {canCreate && (
        <div className="mt-4 border-t border-gray-100 pt-4">
          <p className="mb-2 font-satoshi text-xs text-gray-400 uppercase tracking-wider">
            New request
          </p>
          <input
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            placeholder="Subject — e.g. Pre-approval for assessment"
            className="mb-2 w-full rounded-lg border border-gray-200 px-3 py-2 font-satoshi text-sm placeholder-gray-400 focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/10"
          />
          <textarea
            value={newDetails}
            onChange={(e) => setNewDetails(e.target.value)}
            rows={2}
            placeholder="Details — e.g. Can we do this assessment?"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 font-satoshi text-sm placeholder-gray-400 focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/10"
          />
          {error && <p className="mt-1 font-satoshi text-xs text-red-600">{error}</p>}
          <div className="mt-2 flex justify-end">
            <button
              type="button"
              onClick={handleCreate}
              disabled={creating || !newSubject.trim() || !newDetails.trim()}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-satoshi text-xs font-bold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {creating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              Send request
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
