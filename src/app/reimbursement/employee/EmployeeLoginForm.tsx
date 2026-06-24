"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Key,
  User,
  AlertCircle,
  Lock,
} from "lucide-react";
import Link from "next/link";
import type { LoginResponse } from "@/types/employee-access";

interface EmployeeLoginFormProps {
  tenantSlug: string;
  tenant: { id: string; name: string; slug: string; description?: string } | null;
}

export default function EmployeeLoginForm({ tenantSlug, tenant }: EmployeeLoginFormProps) {
  const router = useRouter();

  const [employeeId, setEmployeeId] = useState("");
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lockedUntil, setLockedUntil] = useState<string | null>(null);

  // If no valid tenant slug, show a selection prompt
  if (!tenant) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-primary/5 to-white pt-28 pb-10">
        <div className="w-full max-w-md mx-auto px-4 text-center">
          <Link
            href="/reimbursement"
            className="inline-flex items-center gap-2 text-sm text-primary font-satoshi hover:underline mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to corporate selection
          </Link>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h2 className="font-satoshi font-bold text-lg text-primary mb-2">
              No Organisation Selected
            </h2>
            <p className="text-gray-500 font-satoshi text-sm mb-6">
              Please select your organisation first to access the employee
              portal.
            </p>
            <Link
              href="/reimbursement"
              className="inline-block bg-primary text-white font-satoshi font-bold px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Select Organisation
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
      setLockedUntil(null);

      if (!employeeId.trim()) {
        setError("Please enter your Employee ID.");
        return;
      }

      if (!pin.trim()) {
        setError("Please enter your PIN.");
        return;
      }

      if (pin.length < 4) {
        setError("PIN must be at least 4 digits.");
        return;
      }

      setLoading(true);

      try {
        const res = await fetch("/api/employee-access/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tenantSlug,
            employeeCode: employeeId.trim(),
            pin,
          }),
        });

        const data: LoginResponse = await res.json();

        if (!data.success) {
          if (data.errorCode === "EMPLOYEE_LOCKED" && data.lockedUntil) {
            setLockedUntil(data.lockedUntil);
          }
          setError(data.error || "Login failed. Please try again.");
          setLoading(false);
          return;
        }

        // Success — redirect to portal
        router.push("/reimbursement/portal");
      } catch {
        setError("An error occurred. Please try again.");
        setLoading(false);
      }
    },
    [employeeId, pin, tenantSlug, router],
  );

  // Compute lockout display info
  const lockoutInfo = lockedUntil
    ? (() => {
        const remainingMs = new Date(lockedUntil).getTime() - Date.now();
        const remainingMinutes = Math.max(1, Math.ceil(remainingMs / 60000));
        return {
          remainingMinutes,
          text: `Too many failed attempts. Please try again in ${remainingMinutes} minute${remainingMinutes === 1 ? "" : "s"}.`,
        };
      })()
    : null;

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-primary/5 to-white pt-28 pb-10">
      <div className="w-full max-w-md mx-auto px-4">
        {/* Back link */}
        <Link
          href="/reimbursement"
          className="inline-flex items-center gap-2 text-sm text-primary font-satoshi hover:underline mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Change organisation
        </Link>

        {/* Login Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          {/* Tenant header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <User className="w-7 h-7 text-primary" />
            </div>
            <h1 className="font-roca-one text-2xl text-primary mb-1">
              {tenant.name}
            </h1>
            <p className="text-gray-500 font-satoshi text-sm">
              Enter your Employee ID and PIN to continue
            </p>
          </div>

          {/* Lockout banner */}
          {lockoutInfo && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3">
              <Lock className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-satoshi font-bold text-sm text-red-700 mb-1">
                  Account Locked
                </p>
                <p className="font-satoshi text-xs text-red-600">
                  {lockoutInfo.text}
                </p>
              </div>
            </div>
          )}

          {/* Error message */}
          {error && !lockoutInfo && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p className="font-satoshi text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Employee ID */}
            <div>
              <label
                htmlFor="employeeId"
                className="block font-satoshi font-bold text-sm text-primary mb-1.5"
              >
                Employee ID
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="employeeId"
                  type="text"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  placeholder="e.g. OMT-001"
                  disabled={loading}
                  autoComplete="off"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg font-satoshi text-sm text-primary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                />
              </div>
            </div>

            {/* PIN */}
            <div>
              <label
                htmlFor="pin"
                className="block font-satoshi font-bold text-sm text-primary mb-1.5"
              >
                PIN
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="pin"
                  type={showPin ? "text" : "password"}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Enter your PIN"
                  disabled={loading || !!lockoutInfo}
                  maxLength={10}
                  autoComplete="off"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-lg font-satoshi text-sm text-primary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                  aria-label={showPin ? "Hide PIN" : "Show PIN"}
                >
                  {showPin ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !!lockoutInfo}
              className="w-full bg-primary text-white font-satoshi font-bold py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin w-5 h-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>

        {/* Help text */}
        <p className="text-center text-xs text-gray-400 font-satoshi mt-6">
          Your PIN is provided by your organisation&apos;s HR department.
          <br />
          If you don&apos;t have a PIN, please contact your HR administrator.
        </p>
      </div>
    </div>
  );
}
