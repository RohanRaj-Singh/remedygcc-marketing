"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  FileText,
  AlertCircle,
  Loader2,
  ExternalLink,
  Calendar,
  Building2,
  DollarSign,
  CheckCircle,
  Clock,
  XCircle,
  Snowflake,
  Eye,
  EyeOff,
  Edit3,
} from "lucide-react";
import ClaimTimeline from "@/components/claims/ClaimTimeline";
import ClaimChat from "@/components/claims/ClaimChat";
import ClaimRequests from "@/components/claims/ClaimRequests";

// ── Types ──────────────────────────────────────────────────────────────────

interface ClaimHistoryEntry {
  status: string;
  actorRole: "employee" | "tenantAdmin";
  note?: string;
  timestamp: string;
}

interface Claim {
  reimbursementId: string;
  claimNumber?: string;
  amount: number;
  description: string;
  clinicId?: string;
  clinicName?: string;
  receiptUrl?: string;
  serviceDate?: string;
  status: string;
  history?: ClaimHistoryEntry[];
  createdAt: string;
  updatedAt: string;
}

interface ClaimDetailProps {
  employeeCode: string;
  employeeName: string;
  tenantName: string;
}

// ── Status helpers ─────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  string,
  { label: string; description: string; icon: React.ReactNode; class: string }
> = {
  pending: {
    label: "Pending",
    description: "Your claim is waiting for review by the tenant.",
    icon: <Clock className="w-5 h-5" />,
    class: "bg-amber-50 text-amber-700 border-amber-200",
  },
  in_progress: {
    label: "In Progress",
    description: "Your claim is being reviewed by the tenant.",
    icon: <Clock className="w-5 h-5" />,
    class: "bg-blue-50 text-blue-700 border-blue-200",
  },
  approved: {
    label: "Approved",
    description: "Your claim has been approved.",
    icon: <CheckCircle className="w-5 h-5" />,
    class: "bg-green-50 text-green-700 border-green-200",
  },
  to_be_paid: {
    label: "Awaiting Payout",
    description: "Your claim has been approved for payout and is waiting for the payment to be processed.",
    icon: <Clock className="w-5 h-5" />,
    class: "bg-orange-50 text-orange-700 border-orange-200",
  },
  rejected: {
    label: "Rejected",
    description: "Your claim was not approved.",
    icon: <XCircle className="w-5 h-5" />,
    class: "bg-red-50 text-red-700 border-red-200",
  },
  frozen: {
    label: "Frozen",
    description: "Your claim is temporarily on hold.",
    icon: <Snowflake className="w-5 h-5" />,
    class: "bg-sky-50 text-sky-700 border-sky-200",
  },
  paid: {
    label: "Paid",
    description: "Your claim has been paid.",
    icon: <CheckCircle className="w-5 h-5" />,
    class: "bg-purple-50 text-purple-700 border-purple-200",
  },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatAmount(amount: number) {
  return `OMR ${amount.toFixed(3)}`;
}

// ── Component ──────────────────────────────────────────────────────────────

export default function ClaimDetail({
  employeeCode,
  employeeName,
  tenantName,
}: ClaimDetailProps) {
  const router = useRouter();
  const params = useParams();
  const claimId = params.id as string;

  const [claim, setClaim] = useState<Claim | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showReceipt, setShowReceipt] = useState(false);

  // ── Edit & Resubmit (rejected claims) ─────────────────────────────────────
  const [editing, setEditing] = useState(false);
  const [editAmount, setEditAmount] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editNote, setEditNote] = useState("");
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState("");

  const startEditing = useCallback(() => {
    if (!claim) return;
    setEditAmount(String(claim.amount));
    setEditDescription(claim.description);
    setEditNote("");
    setEditError("");
    setEditing(true);
  }, [claim]);

  // ── Fetch claim ──────────────────────────────────────────────────────────

  const fetchClaim = useCallback(async () => {
    if (!claimId) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/employee-access/claims/${claimId}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error ?? "Claim not found.");
        setClaim(null);
      } else {
        setClaim(data.claim);
      }
    } catch {
      setError("An error occurred while loading the claim.");
      setClaim(null);
    }

    setLoading(false);
  }, [claimId]);

  useEffect(() => {
    fetchClaim();
  }, [fetchClaim]);

  const handleResubmit = useCallback(async () => {
    const amount = Number(editAmount);
    const description = editDescription.trim();
    if (!Number.isFinite(amount) || amount <= 0) {
      setEditError("Amount must be greater than 0.");
      return;
    }
    if (!description) {
      setEditError("Description is required.");
      return;
    }
    setEditSaving(true);
    setEditError("");
    try {
      const res = await fetch(`/api/employee-access/claims/${claimId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, description, notes: editNote.trim() || undefined }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error ?? "Failed to resubmit claim.");
      }
      // Resubmit succeeded — redirect to claims list showing pending claims
      // (the claim just moved from rejected → pending)
      router.push("/reimbursement/employee/claims?status=pending");
    } catch (err) {
      setEditError(err instanceof Error ? err.message : "Failed to resubmit claim.");
    } finally {
      setEditSaving(false);
    }
  }, [claimId, editAmount, editDescription, editNote, router]);

  // ── Loading ──────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-[60vh] bg-gradient-to-br from-primary/5 to-white pt-28 pb-10">
        <div className="w-full max-w-2xl mx-auto px-4">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-48" />
            <div className="h-4 bg-gray-200 rounded w-64" />
            <div className="h-64 bg-gray-200 rounded w-full" />
          </div>
        </div>
      </div>
    );
  }

  // ── Error / Not found ────────────────────────────────────────────────────

  if (error || !claim) {
    return (
      <div className="min-h-[60vh] bg-gradient-to-br from-primary/5 to-white pt-28 pb-10">
        <div className="w-full max-w-2xl mx-auto px-4">
          <button
            type="button"
            onClick={() => router.push("/reimbursement/employee/claims")}
            className="inline-flex items-center gap-2 text-sm text-primary font-satoshi hover:underline mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to My Claims
          </button>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h2 className="font-satoshi font-bold text-primary text-xl mb-2">
              {error || "Claim not found"}
            </h2>
            <p className="text-gray-500 font-satoshi text-sm mb-6">
              This claim may have been removed or you may not have permission to view it.
            </p>
            <button
              type="button"
              onClick={() => router.push("/reimbursement/employee/claims")}
              className="inline-flex items-center gap-2 bg-primary text-white font-satoshi font-bold px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              View My Claims
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Detail view ──────────────────────────────────────────────────────────

  const statusCfg = STATUS_CONFIG[claim.status] ?? {
    label: claim.status,
    description: "",
    icon: <FileText className="w-5 h-5" />,
    class: "bg-gray-50 text-gray-600 border-gray-200",
  };

  return (
    <div className="min-h-[60vh] bg-gradient-to-br from-primary/5 to-white pt-28 pb-10">
      <div className="w-full max-w-6xl mx-auto px-4">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start">
          {/* Chat — full-height right sticky panel on lg; after Requests on mobile */}
          <div className="order-7 min-w-0 lg:order-none lg:col-start-2 lg:row-start-1 lg:row-end-7 lg:self-start lg:sticky lg:top-6 lg:h-[560px]">
            <ClaimChat
              claimId={claimId}
              apiBase={`/api/employee-access/claims/${claimId}/messages`}
              variant="panel"
            />
          </div>

          {/* Requests — below the history timeline (left column on lg) */}
          <div className="order-6 min-w-0 lg:order-none lg:col-start-1 lg:row-start-6 lg:self-start">
            <ClaimRequests
              claimId={claimId}
              apiBase={`/api/employee-access/claims/${claimId}/requests`}
            />
          </div>

          {/* Header */}
          <div className="order-1 min-w-0 lg:order-none lg:col-start-1 lg:row-start-1">
            <div>
              <button
                type="button"
                onClick={() => router.push("/reimbursement/employee/claims")}
                className="inline-flex items-center gap-2 text-sm text-primary font-satoshi hover:underline mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to My Claims
              </button>

              <span className="inline-block px-4 py-2 bg-primary/10 text-primary font-satoshi font-bold rounded-full text-sm mb-4">
                Claim Details
              </span>
              <h1 className="text-3xl md:text-4xl font-roca-one text-primary mb-1">
                {formatAmount(claim.amount)}
              </h1>
              <p className="text-gray-500 font-satoshi text-sm">
                {employeeName} &middot; {tenantName}
              </p>
            </div>
          </div>

          {/* Status banner */}
          <div className="order-2 min-w-0 lg:order-none lg:col-start-1 lg:row-start-2">
            <div
              className={`rounded-xl border p-4 flex items-start gap-3 ${statusCfg.class}`}
            >
              <div className="shrink-0 mt-0.5">{statusCfg.icon}</div>
              <div>
                <p className="font-satoshi font-bold text-sm">{statusCfg.label}</p>
                {statusCfg.description && (
                  <p className="font-satoshi text-xs mt-0.5 opacity-80">
                    {statusCfg.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Claim details card */}
          <div className="order-3 min-w-0 lg:order-none lg:col-start-1 lg:row-start-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-5">
              {/* Claim Number */}
              <div className="flex items-start justify-between pb-4 border-b border-gray-100">
                <div>
                  <p className="font-satoshi text-xs text-gray-400 uppercase tracking-wider mb-1">
                    Reference Number
                  </p>
                  <p className="font-satoshi font-bold text-primary text-base tracking-wider">
                    {claim.claimNumber ?? claim.reimbursementId}
                  </p>
                </div>
              </div>

              {/* Clinic */}
              {claim.clinicName && (
                <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
                  <Building2 className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-satoshi text-xs text-gray-400 uppercase tracking-wider mb-1">
                      Clinic
                    </p>
                    <p className="font-satoshi font-medium text-primary">
                      {claim.clinicName}
                    </p>
                  </div>
                </div>
              )}

              {/* Amount */}
              <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
                <DollarSign className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-satoshi text-xs text-gray-400 uppercase tracking-wider mb-1">
                    Amount
                  </p>
                  <p className="font-satoshi font-bold text-primary text-lg">
                    {formatAmount(claim.amount)}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="pb-4 border-b border-gray-100">
                <p className="font-satoshi text-xs text-gray-400 uppercase tracking-wider mb-2">
                  Description
                </p>
                <p className="font-satoshi text-sm text-primary leading-relaxed whitespace-pre-wrap">
                  {claim.description}
                </p>
              </div>

              {/* Receipt Preview */}
              {claim.receiptUrl && (
                <div className="pb-4 border-b border-gray-100">
                  <p className="font-satoshi text-xs text-gray-400 uppercase tracking-wider mb-2">
                    Receipt
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowReceipt(!showReceipt)}
                    className="inline-flex items-center gap-2 font-satoshi font-bold text-sm text-primary hover:text-primary/70 transition-colors"
                  >
                    {showReceipt ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    {showReceipt ? "Hide Receipt" : "View Receipt"}
                  </button>

                  {showReceipt && (
                    <div className="mt-3 rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
                      {claim.receiptUrl?.toLowerCase().endsWith('.pdf') ? (
                        <iframe
                          src={`/api/employee-access/receipts/${claim.reimbursementId}`}
                          className="w-full h-[500px] border-0"
                          title="Receipt preview"
                        />
                      ) : (
                        <img
                          src={`/api/employee-access/receipts/${claim.reimbursementId}`}
                          alt="Receipt"
                          className="w-full h-auto max-h-[500px] object-contain"
                        />
                      )}
                      <div className="flex items-center justify-between px-4 py-2 bg-white border-t border-gray-200">
                        <span className="font-satoshi text-xs text-gray-400">
                          Secure preview
                        </span>
                        <a
                          href={`/api/employee-access/receipts/${claim.reimbursementId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 font-satoshi font-bold text-xs text-primary hover:text-primary/70 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Open in new tab
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Service Date */}
              {claim.serviceDate && (
                <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
                  <Calendar className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-satoshi text-xs text-gray-400 uppercase tracking-wider mb-1">
                      Service Date
                    </p>
                    <p className="font-satoshi font-medium text-primary">{claim.serviceDate}</p>
                  </div>
                </div>
              )}

              {/* Submission Date */}
              <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
                <Calendar className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-satoshi text-xs text-gray-400 uppercase tracking-wider mb-1">
                    Submitted
                  </p>
                  <p className="font-satoshi font-medium text-primary">
                    {formatDate(claim.createdAt)}
                  </p>
                </div>
              </div>

              {/* Last Updated */}
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-satoshi text-xs text-gray-400 uppercase tracking-wider mb-1">
                    Last Updated
                  </p>
                  <p className="font-satoshi font-medium text-primary">
                    {formatDate(claim.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Edit & Resubmit — rejected claims */}
          {claim.status === "rejected" && (
            <div className="order-4 min-w-0 lg:order-none lg:col-start-1 lg:row-start-4">
              <div className="bg-white rounded-xl shadow-sm border border-amber-200 p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-satoshi font-bold text-amber-700 text-sm">This claim was not approved</p>
                    <p className="font-satoshi text-xs text-amber-600 mt-1">
                      You can still edit the details and resubmit it for review.
                    </p>
                  </div>
                </div>

                {!editing ? (
                  <button
                    type="button"
                    onClick={startEditing}
                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-satoshi text-xs font-bold text-white transition hover:bg-primary/90"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Edit &amp; Resubmit
                  </button>
                ) : (
                  <div className="mt-4 space-y-3">
                    <div>
                      <label className="font-satoshi text-xs text-gray-400 uppercase tracking-wider mb-1 block">Amount (OMR)</label>
                      <input
                        type="number"
                        step="0.001"
                        min="0"
                        value={editAmount}
                        onChange={(e) => setEditAmount(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 font-satoshi text-sm placeholder-gray-400 focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/10"
                      />
                    </div>
                    <div>
                      <label className="font-satoshi text-xs text-gray-400 uppercase tracking-wider mb-1 block">Description</label>
                      <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        rows={3}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 font-satoshi text-sm placeholder-gray-400 focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/10"
                      />
                    </div>
                    <div>
                      <label className="font-satoshi text-xs text-gray-400 uppercase tracking-wider mb-1 block">Note to reviewer (optional)</label>
                      <textarea
                        value={editNote}
                        onChange={(e) => setEditNote(e.target.value)}
                        rows={2}
                        placeholder="Explain any changes…"
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 font-satoshi text-sm placeholder-gray-400 focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/10"
                      />
                    </div>

                    {editError && <p className="font-satoshi text-xs text-red-600">{editError}</p>}

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleResubmit}
                        disabled={editSaving}
                        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-satoshi text-xs font-bold text-white transition hover:bg-primary/90 disabled:opacity-50"
                      >
                        {editSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                        Save &amp; Resubmit
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditing(false)}
                        disabled={editSaving}
                        className="rounded-lg border border-gray-200 bg-white px-4 py-2 font-satoshi text-xs font-bold text-gray-500 transition hover:bg-gray-50 disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Claim History */}
          {claim.history && claim.history.length > 0 && (
            <div className="order-5 min-w-0 lg:order-none lg:col-start-1 lg:row-start-5">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <p className="font-satoshi text-xs text-gray-400 uppercase tracking-wider mb-4">
                  Claim History
                </p>
                <ClaimTimeline history={claim.history} />
              </div>
            </div>
          )}
        </div>

        {/* Back button */}
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => router.push("/reimbursement/employee/claims")}
            className="inline-flex items-center gap-2 text-sm text-gray-400 font-satoshi hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to My Claims
          </button>
        </div>
      </div>
    </div>
  );
}
