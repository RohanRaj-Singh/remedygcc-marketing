"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  UserRound,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import type { LoginResponse } from "@/types/employee-access";

/** Fixed slug for the reserved individual pool (FR-079). */
const INDIVIDUAL_SLUG = "individual";

const ERROR_MESSAGES: Record<string, string> = {
  NOT_REGISTERED:
    "This account has not been registered yet. Please sign up first.",
  INVALID_PASSWORD: "Invalid email or password. Please try again.",
  EMPLOYEE_LOCKED: "Too many attempts. Please try again later.",
  EMPLOYEE_SUSPENDED:
    "This account has been suspended. Please contact support.",
  EMPLOYEE_ARCHIVED:
    "This account has been archived. Please contact support.",
  EMPLOYEE_INACTIVE: "This account is no longer active.",
};

export default function IndividualLoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errorCode, setErrorCode] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
      setErrorCode(null);

      if (!email.trim() || !email.includes("@")) {
        setError("Please enter a valid email address.");
        setErrorCode("INVALID_CREDENTIALS");
        return;
      }

      if (!password) {
        setError("Password is required.");
        setErrorCode("INVALID_PASSWORD");
        return;
      }

      setLoading(true);

      try {
        const res = await fetch("/api/employee-access/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tenantSlug: INDIVIDUAL_SLUG,
            email: email.trim(),
            password,
          }),
        });

        const data: LoginResponse = await res.json();

        if (!data.success) {
          setErrorCode(data.errorCode ?? null);
          setError(
            data.error
              ? ERROR_MESSAGES[data.errorCode ?? ""] ?? data.error
              : "Login failed. Please try again.",
          );
          setLoading(false);
          return;
        }

        if (data.mustChangePassword) {
          router.push("/reimbursement/employee/change-password?mustChange=true");
          return;
        }

        router.push("/reimbursement/portal");
      } catch {
        setError("An error occurred. Please try again.");
        setErrorCode(null);
        setLoading(false);
      }
    },
    [email, password, router],
  );

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-primary/5 to-white pt-28 pb-10">
      <div className="w-full max-w-md mx-auto px-4">
        {/* Back link */}
        <Link
          href="/reimbursement"
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
          Back to access options
        </Link>

        {/* Login Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <UserRound className="w-7 h-7 text-primary" />
            </div>
            <h1 className="font-roca-one text-2xl text-primary mb-1">
              Individual Sign In
            </h1>
            <p className="text-gray-500 font-satoshi text-sm">
              Sign in to submit and track your claims
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-satoshi text-sm text-red-700">{error}</p>
                {errorCode === "NOT_REGISTERED" && (
                  <Link
                    href="/reimbursement/individual/register"
                    className="font-satoshi text-xs text-red-600 underline mt-1 inline-block hover:no-underline"
                  >
                    Sign up here
                  </Link>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="ind-email"
                className="block font-satoshi font-bold text-sm text-primary mb-1.5"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="ind-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  disabled={loading}
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg font-satoshi text-sm text-primary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="ind-password"
                  className="block font-satoshi font-bold text-sm text-primary"
                >
                  Password
                </label>
                <Link
                  href="/reimbursement/employee/forgot-password?tenant=individual"
                  className="font-satoshi text-xs text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="ind-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  disabled={loading}
                  autoComplete="current-password"
                  className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-lg font-satoshi text-sm text-primary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
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
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Sign Up link */}
          <div className="mt-6 text-center">
            <p className="font-satoshi text-sm text-gray-500">
              Don&apos;t have an account?{" "}
              <Link
                href="/reimbursement/individual/register"
                className="text-primary font-bold hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>

        {/* Cross-link to organisation access */}
        <p className="text-center text-xs text-gray-400 font-satoshi mt-6">
          Part of a partner organisation?{" "}
          <Link href="/reimbursement" className="text-primary hover:underline">
            Access your organisation portal
          </Link>
        </p>
      </div>
    </div>
  );
}
