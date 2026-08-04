"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Building2, ChevronRight, Loader2, Search, AlertCircle, UserRound } from "lucide-react";

interface Tenant {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export default function ReimbursementPage() {
  const router = useRouter();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchTenants() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/employee-access/tenants");
        if (!res.ok) throw new Error("Failed to load organisations.");
        const data = await res.json();
        setTenants(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load organisations.");
      } finally {
        setLoading(false);
      }
    }
    fetchTenants();
  }, []);

  const filteredTenants = useMemo(() => {
    if (!search.trim()) return tenants;
    const q = search.toLowerCase().trim();
    return tenants.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.slug.toLowerCase().includes(q) ||
        (t.description ?? "").toLowerCase().includes(q),
    );
  }, [tenants, search]);

  const showEmptyState = !loading && !error && filteredTenants.length === 0;

  return (
    <div className="min-h-[60vh] bg-gradient-to-br from-primary/5 to-white pt-28 pb-10">
      <div className="w-full max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary font-satoshi font-bold rounded-full text-sm mb-4">
            Employee Reimbursement
          </span>
          <h1 className="text-4xl md:text-5xl font-roca-one text-primary mb-2">
            Access Your Portal
          </h1>
          <p className="text-lg text-gray-600 font-satoshi max-w-lg mx-auto">
            Select your organisation to access the employee reimbursement portal.
          </p>
        </div>

        {/* Individual (public) sign-up — not part of an organisation */}
        <button
          type="button"
          onClick={() => router.push("/reimbursement/individual")}
          className="group w-full flex items-center gap-4 p-5 mb-6 bg-white rounded-xl shadow-sm border border-primary/20 hover:shadow-md hover:border-primary/40 transition-all duration-200 text-left cursor-pointer"
        >
          <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <UserRound className="w-6 h-6 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-satoshi font-bold text-base text-primary">
              I&apos;m an individual
            </h3>
            <p className="text-xs text-gray-500 font-satoshi mt-0.5">
              Not part of an organisation? Sign up or sign in for personal coverage.
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-300 shrink-0 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400 font-satoshi uppercase tracking-wide">
            Or select your organisation
          </span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Search */}
        {!loading && !error && tenants.length > 0 && (
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search your organisation..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoComplete="off"
              className="w-full pl-12 pr-4 py-3.5 bg-white rounded-xl shadow-sm border border-gray-100 font-satoshi text-sm text-primary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
            />
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-sm text-gray-400 font-satoshi">Loading organisations...</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl p-4">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-satoshi text-sm text-red-700">{error}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="font-satoshi text-xs text-red-600 underline mt-1 hover:no-underline"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {/* No results */}
        {showEmptyState && (
          <div className="text-center py-12">
            <Search className="w-10 h-10 text-gray-300 mx-auto mb-4" />
            <p className="font-satoshi font-bold text-primary text-lg mb-1">
              No organisations found
            </p>
            <p className="text-sm text-gray-500 font-satoshi">
              {search ? `No results for "${search}". Try a different name.` : "No organisations available yet."}
            </p>
          </div>
        )}

        {/* Corporate Selection */}
        {!loading && !error && filteredTenants.length > 0 && (
          <>
            {tenants.length > 0 && search && (
              <p className="text-xs text-gray-400 font-satoshi mb-3 text-center">
                {filteredTenants.length} of {tenants.length} organisations
              </p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredTenants.map((corp) => (
                <button
                  key={corp.slug}
                  type="button"
                  onClick={() => router.push(`/reimbursement/employee?tenant=${corp.slug}`)}
                  className="group flex flex-col items-start gap-2 p-5 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-primary/20 transition-all duration-200 text-left cursor-pointer"
                >
                  <div className="flex items-start justify-between w-full">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5 text-primary" />
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 shrink-0 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <div className="min-w-0 w-full">
                    <h3 className="font-satoshi font-bold text-base text-primary truncate">
                      {corp.name}
                    </h3>
                    <p className="text-xs text-gray-500 font-satoshi truncate mt-0.5">
                      {corp.description ?? `${corp.name} Employee Portal`}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {/* Footer note */}
        <p className="text-center text-xs text-gray-400 font-satoshi mt-8">
          Only employees of partner organisations can access this portal.
        </p>
      </div>
    </div>
  );
}
