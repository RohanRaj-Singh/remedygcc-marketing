"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  FileText,
  AlertCircle,
  Loader2,
  Plus,
  Search,
} from "lucide-react";
import NotificationBell from "@/components/claims/NotificationBell";

// ── Types ──────────────────────────────────────────────────────────────────

interface Claim {
  reimbursementId: string;
  claimNumber?: string;
  amount: number;
  description: string;
  clinicId?: string;
  clinicName?: string;
  receiptUrl?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  latestUpdate?: {
    status: string;
    actorRole: "employee" | "tenantAdmin";
    note: string | null;
    timestamp: string;
  } | null;
}

interface ClaimsListProps {
  employeeName: string;
  employeeCode: string;
  tenantName: string;
}

type FilterValue = "all" | "pending" | "in_progress" | "approved" | "to_be_paid" | "rejected" | "frozen" | "paid";

// ── Status helpers ─────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { label: string; class: string }> = {
  pending: {
    label: "Pending",
    class: "bg-amber-50 text-amber-700 border-amber-200",
  },
  in_progress: {
    label: "In Progress",
    class: "bg-blue-50 text-blue-700 border-blue-200",
  },
  approved: {
    label: "Approved",
    class: "bg-green-50 text-green-700 border-green-200",
  },
  to_be_paid: {
    label: "Awaiting Payout",
    class: "bg-orange-50 text-orange-700 border-orange-200",
  },
  rejected: {
    label: "Rejected",
    class: "bg-red-50 text-red-700 border-red-200",
  },
  frozen: {
    label: "Frozen",
    class: "bg-sky-50 text-sky-700 border-sky-200",
  },
  paid: {
    label: "Paid",
    class: "bg-purple-50 text-purple-700 border-purple-200",
  },
};

const FILTER_OPTIONS: { value: FilterValue; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In Progress" },
  { value: "approved", label: "Approved" },
  { value: "to_be_paid", label: "Awaiting Payout" },
  { value: "rejected", label: "Rejected" },
  { value: "frozen", label: "Frozen" },
  { value: "paid", label: "Paid" },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatAmount(amount: number) {
  return `OMR ${amount.toFixed(3)}`;
}

function shortId(id: string) {
  return id.length > 12 ? id.slice(0, 12) + "…" : id;
}

// ── Component ──────────────────────────────────────────────────────────────

export default function ClaimsList({
  employeeName,
  employeeCode,
  tenantName,
}: ClaimsListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [claims, setClaims] = useState<Claim[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // Read initial filter from URL, default to "all"
  const [activeFilter, setActiveFilter] = useState<FilterValue>(() => {
    const status = searchParams?.get("status");
    return (status as FilterValue) ?? "all";
  });

  // ── Fetch claims ─────────────────────────────────────────────────────────

  const fetchClaims = useCallback(async (filter: FilterValue) => {
    setLoading(true);
    setError("");

    try {
      const params = filter !== "all" ? `?status=${filter}` : "";
      const res = await fetch(`/api/employee-access/claims${params}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error ?? "Failed to load claims.");
        setClaims([]);
        setTotal(0);
      } else {
        setClaims(data.claims ?? []);
        setTotal(data.total ?? 0);
      }
    } catch {
      setError("An error occurred while loading claims.");
      setClaims([]);
      setTotal(0);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchClaims(activeFilter);
  }, [activeFilter, fetchClaims]);

  // ── Filter change ────────────────────────────────────────────────────────

  const handleFilterChange = useCallback(
    (filter: FilterValue) => {
      setActiveFilter(filter);
      // Update URL without reloading
      const newParams = new URLSearchParams(searchParams?.toString() ?? "");
      if (filter === "all") {
        newParams.delete("status");
      } else {
        newParams.set("status", filter);
      }
      router.replace(`/reimbursement/employee/claims?${newParams.toString()}`);
    },
    [router, searchParams]
  );

  // ── Loading skeleton ─────────────────────────────────────────────────────

  if (loading && claims.length === 0) {
    return (
      <div className="min-h-[60vh] bg-gradient-to-br from-primary/5 to-white pt-28 pb-10">
        <div className="w-full max-w-4xl mx-auto px-4">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-48" />
            <div className="h-4 bg-gray-200 rounded w-64" />
            <div className="h-12 bg-gray-200 rounded w-full" />
            <div className="h-32 bg-gray-200 rounded w-full" />
            <div className="h-32 bg-gray-200 rounded w-full" />
          </div>
        </div>
      </div>
    );
  }

  // ── Empty state ──────────────────────────────────────────────────────────

  const showEmpty = !loading && claims.length === 0 && !error;

  return (
    <div className="min-h-[60vh] bg-gradient-to-br from-primary/5 to-white pt-28 pb-10">
      <div className="w-full max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            type="button"
            onClick={() => router.push("/reimbursement/portal")}
            className="inline-flex items-center gap-2 text-sm text-primary font-satoshi hover:underline mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Portal
          </button>

          <div className="flex items-start justify-between">
            <div>
              <span className="inline-block px-4 py-2 bg-primary/10 text-primary font-satoshi font-bold rounded-full text-sm mb-4">
                My Claims
              </span>
              <h1 className="text-4xl md:text-5xl font-roca-one text-primary mb-2">
                Your Claims
              </h1>
              <p className="text-gray-500 font-satoshi">
                {employeeName} &middot; {tenantName}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <NotificationBell />
              <button
                type="button"
                onClick={() => router.push("/reimbursement/employee/new")}
                className="hidden md:flex items-center gap-2 bg-primary text-white font-satoshi font-bold px-5 py-2.5 rounded-lg hover:bg-primary/90 transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                New Claim
              </button>
            </div>
          </div>
        </div>

        {/* Error state */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-satoshi text-sm text-red-700">{error}</p>
              <button
                type="button"
                onClick={() => fetchClaims(activeFilter)}
                className="font-satoshi text-xs text-red-600 underline mt-1 hover:no-underline"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleFilterChange(opt.value)}
              className={`font-satoshi font-bold text-sm px-4 py-2 rounded-lg border transition-colors whitespace-nowrap ${
                activeFilter === opt.value
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-gray-600 border-gray-200 hover:border-primary/30 hover:text-primary"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Loading overlay */}
        {loading && claims.length > 0 && (
          <div className="flex items-center justify-center py-4 text-gray-400 font-satoshi text-sm gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Updating...
          </div>
        )}

        {/* Claims count */}
        {!loading && !showEmpty && !error && (
          <p className="font-satoshi text-xs text-gray-400 mb-4">
            {total} {total === 1 ? "claim" : "claims"}
            {activeFilter !== "all" ? ` (${activeFilter})` : ""}
          </p>
        )}

        {/* Empty state */}
        {showEmpty && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-6">
              <Search className="w-7 h-7 text-gray-300" />
            </div>
            <h2 className="font-satoshi font-bold text-primary text-xl mb-2">
              No claims submitted yet
            </h2>
            <p className="text-gray-500 font-satoshi text-sm mb-8 max-w-sm mx-auto">
              Submit your first reimbursement claim for therapy or counselling sessions.
            </p>
            <button
              type="button"
              onClick={() => router.push("/reimbursement/employee/new")}
              className="inline-flex items-center gap-2 bg-primary text-white font-satoshi font-bold px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create New Claim
            </button>
          </div>
        )}

        {/* Claims list */}
        {!showEmpty && (
          <div className="space-y-4">
            {claims.map((claim) => {
              const statusCfg = STATUS_CONFIG[claim.status] ?? {
                label: claim.status,
                class: "bg-gray-50 text-gray-600 border-gray-200",
              };

              return (
                <button
                  key={claim.reimbursementId}
                  type="button"
                  onClick={() =>
                    router.push(
                      `/reimbursement/employee/claims/${claim.reimbursementId}`,
                    )
                  }
                  className="w-full text-left bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-primary/20 transition-all duration-200 group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-satoshi font-bold text-primary text-sm truncate">
                          {claim.claimNumber ?? shortId(claim.reimbursementId)}
                        </span>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full border font-satoshi font-bold text-xs ${statusCfg.class}`}
                        >
                          {statusCfg.label}
                        </span>
                      </div>
                      <p className="font-satoshi text-sm text-gray-500 mb-1">
                        {claim.clinicName ?? "Clinic"}
                      </p>
                      <p className="font-satoshi text-xs text-gray-400">
                        {formatDate(claim.createdAt)}
                      </p>
                      {claim.updatedAt && claim.updatedAt !== claim.createdAt && (
                        <p className="font-satoshi text-xs text-gray-400 mt-0.5">
                          Updated {formatDate(claim.updatedAt)}
                        </p>
                      )}
                      {claim.latestUpdate?.note && (
                        <p className="font-satoshi text-xs text-gray-500 mt-0.5 truncate max-w-[360px]">
                          {claim.latestUpdate.note}
                        </p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-satoshi font-bold text-primary">
                        {formatAmount(claim.amount)}
                      </p>
                      <span className="inline-flex items-center gap-1 text-xs font-satoshi font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity mt-1">
                        View
                        <span aria-hidden="true">&rarr;</span>
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Mobile: New Claim button */}
        <div className="mt-8 text-center md:hidden">
          <button
            type="button"
            onClick={() => router.push("/reimbursement/employee/new")}
            className="inline-flex items-center gap-2 bg-primary text-white font-satoshi font-bold px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-5 h-5" />
            New Claim
          </button>
        </div>
      </div>
    </div>
  );
}
