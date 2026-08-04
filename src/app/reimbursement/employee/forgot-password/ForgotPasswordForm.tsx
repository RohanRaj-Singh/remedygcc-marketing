"use client";

import { useState, useCallback } from "react";
import { Mail, Building2, AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";
import type {
  Tenant,
  ForgotPasswordResponse,
} from "@/types/employee-access";

interface ForgotPasswordFormProps {
  tenants: Tenant[];
  preselectedSlug: string;
}

export default function ForgotPasswordForm({
  tenants,
  preselectedSlug,
}: ForgotPasswordFormProps) {
  const [selectedSlug, setSelectedSlug] = useState(preselectedSlug);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");

      // Client-side validation
      if (!selectedSlug) {
        setError("Please select your organization.");
        return;
      }

      if (!email.trim() || !email.includes("@")) {
        setError("Please enter a valid email address.");
        return;
      }

      setLoading(true);

      try {
        const res = await fetch("/api/employee-access/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tenantSlug: selectedSlug,
            email: email.trim(),
          }),
        });

        const data: ForgotPasswordResponse = await res.json();

        if (!data.success) {
          setError(data.error ?? "Something went wrong. Please try again.");
          setLoading(false);
          return;
        }

        // Always show the same generic confirmation (enumeration-safe).
        setSubmitted(true);
        setLoading(false);
      } catch {
        setError("An error occurred. Please try again.");
        setLoading(false);
      }
    },
    [selectedSlug, email],
  );

  // ── Success state ─────────────────────────────────────────────────────────

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-primary/5 to-white pt-28 pb-10">
        <div className="w-full max-w-md mx-auto px-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h1 className="font-roca-one text-2xl text-primary mb-2">
              Check Your Email
            </h1>
            <p className="font-satoshi text-gray-500 text-sm mb-8">
              If an account exists for that email, we&apos;ve sent a link to
              reset your password. The link is valid for one hour.
            </p>
            <Link
              href="/reimbursement/employee"
              className="inline-block w-full bg-primary text-white font-satoshi font-bold py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Form ──────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-primary/5 to-white pt-28 pb-10">
      <div className="w-full max-w-md mx-auto px-4">
        {/* Back link */}
        <Link
          href="/reimbursement/employee"
          className="inline-flex items-center gap-2 text-sm text-primary font-satoshi hover:underline mb-8"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to sign in
        </Link>

        {/* Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Mail className="w-7 h-7 text-primary" />
            </div>
            <h1 className="font-roca-one text-2xl text-primary mb-1">
              Forgot Password
            </h1>
            <p className="text-gray-500 font-satoshi text-sm">
              Enter your organization and email to receive a reset link
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p className="font-satoshi text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Organization */}
            <div>
              <label
                htmlFor="fp-organization"
                className="block font-satoshi font-bold text-sm text-primary mb-1.5"
              >
                Organization
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <select
                  id="fp-organization"
                  value={selectedSlug}
                  onChange={(e) => setSelectedSlug(e.target.value)}
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg font-satoshi text-sm text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors appearance-none"
                >
                  <option value="">Select your organization</option>
                  {tenants.map((t) => (
                    <option key={t.slug} value={t.slug}>
                      {t.name}
                    </option>
                  ))}
                </select>
                <svg
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="fp-email"
                className="block font-satoshi font-bold text-sm text-primary mb-1.5"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="fp-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@organization.com"
                  disabled={loading}
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg font-satoshi text-sm text-primary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
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
                  Sending link...
                </>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>

          {/* Sign in link */}
          <div className="mt-6 text-center">
            <p className="font-satoshi text-sm text-gray-500">
              Remember your password?{" "}
              <Link
                href="/reimbursement/employee"
                className="text-primary font-bold hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
