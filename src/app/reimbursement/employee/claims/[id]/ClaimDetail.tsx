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
} from "lucide-react";

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
  approved: {
    label: "Approved",
    description: "Your claim has been approved.",
    icon: <CheckCircle className="w-5 h-5" />,
    class: "bg-green-50 text-green-700 border-green-200",
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
    class: "bg-blue-50 text-blue-700 border-blue-200",
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
      <div className="w-full max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
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

        {/* Status banner */}
        <div
          className={`rounded-xl border p-4 mb-6 flex items-start gap-3 ${statusCfg.class}`}
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

        {/* Claim details card */}
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
                  <iframe
                    src={`/api/employee-access/receipts/${claim.reimbursementId}`}
                    className="w-full h-[500px] border-0"
                    title="Receipt preview"
                    sandbox="allow-scripts allow-same-origin"
                  />
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

        {/* Claim History */}
        {claim.history && claim.history.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <p className="font-satoshi text-xs text-gray-400 uppercase tracking-wider mb-4">
              Claim History
            </p>
            <ol className="relative border-l border-gray-200 ml-2 space-y-4">
              {claim.history.map((entry, i) => (
                <li key={i} className="pl-5 relative">
                  <span
                    className={`absolute -left-1.5 top-1 h-3 w-3 rounded-full border-2 border-white ${
                      entry.status === "approved" ? "bg-green-500" :
                      entry.status === "rejected" ? "bg-red-500" :
                      entry.status === "frozen"   ? "bg-blue-500" :
                      entry.status === "paid"     ? "bg-purple-500" :
                      "bg-amber-500"
                    }`}
                  />
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`font-satoshi font-bold text-xs capitalize px-2 py-0.5 rounded-full ${
                      entry.status === "approved" ? "bg-green-50 text-green-700" :
                      entry.status === "rejected" ? "bg-red-50 text-red-700" :
                      entry.status === "frozen"   ? "bg-blue-50 text-blue-700" :
                      entry.status === "paid"     ? "bg-purple-50 text-purple-700" :
                      "bg-amber-50 text-amber-700"
                    }`}>
                      {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                    </span>
                    <span className="font-satoshi text-xs text-gray-400">
                      {entry.actorRole === "employee" ? "You" : "Reviewer"}
                    </span>
                    <span className="font-satoshi text-xs text-gray-400">&middot; {formatDate(entry.timestamp)}</span>
                  </div>
                  {entry.note && (
                    <p className="mt-1 font-satoshi text-xs text-gray-600">{entry.note}</p>
                  )}
                </li>
              ))}
            </ol>
          </div>
        )}

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
