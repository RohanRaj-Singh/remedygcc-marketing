"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Lock,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import type { ResetPasswordResponse } from "@/types/employee-access";

interface ResetPasswordFormProps {
  token: string;
}

const ERROR_MESSAGES: Record<string, string> = {
  INVALID_TOKEN: "This reset link is invalid or has expired.",
  WEAK_PASSWORD:
    "Password must be at least 8 characters with uppercase, lowercase, and a digit.",
};

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");

      if (!password) {
        setError("New password is required.");
        return;
      }

      if (
        password.length < 8 ||
        !/[A-Z]/.test(password) ||
        !/[a-z]/.test(password) ||
        !/[0-9]/.test(password)
      ) {
        setError(
          "Password must be at least 8 characters with uppercase, lowercase, and a digit.",
        );
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      setLoading(true);

      try {
        const res = await fetch("/api/employee-access/reset-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, password }),
        });

        const data: ResetPasswordResponse = await res.json();

        if (!data.success) {
          setError(
            data.error
              ? ERROR_MESSAGES[data.errorCode ?? ""] ?? data.error
              : "Unable to reset your password.",
          );
          setLoading(false);
          return;
        }

        // Success
        setSuccess(true);
        setLoading(false);
      } catch {
        setError("An error occurred. Please try again.");
        setLoading(false);
      }
    },
    [token, password, confirmPassword],
  );

  // ── Missing token guard ─────────────────────────────────────────────────────

  if (!token) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-primary/5 to-white pt-28 pb-10">
        <div className="w-full max-w-md mx-auto px-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="font-roca-one text-2xl text-primary mb-2">
              Invalid Link
            </h1>
            <p className="font-satoshi text-gray-500 text-sm mb-8">
              This reset link is invalid or has expired. Please request a new
              one.
            </p>
            <Link
              href="/reimbursement/employee/forgot-password"
              className="inline-block w-full bg-primary text-white font-satoshi font-bold py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Request New Link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Success state ─────────────────────────────────────────────────────────

  if (success) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-primary/5 to-white pt-28 pb-10">
        <div className="w-full max-w-md mx-auto px-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h1 className="font-roca-one text-2xl text-primary mb-2">
              Password Reset
            </h1>
            <p className="font-satoshi text-gray-500 text-sm mb-8">
              Your password has been updated. You can now sign in with your new
              password.
            </p>
            <button
              onClick={() => router.push("/reimbursement/employee")}
              className="inline-block w-full bg-primary text-white font-satoshi font-bold py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Go to Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Form ──────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-primary/5 to-white pt-28 pb-10">
      <div className="w-full max-w-md mx-auto px-4">
        {/* Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-7 h-7 text-primary" />
            </div>
            <h1 className="font-roca-one text-2xl text-primary mb-1">
              Reset Password
            </h1>
            <p className="text-gray-500 font-satoshi text-sm">
              Choose a new password for your account
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
            {/* New Password */}
            <div>
              <label
                htmlFor="rp-new"
                className="block font-satoshi font-bold text-sm text-primary mb-1.5"
              >
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="rp-new"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters with uppercase, lowercase & digit"
                  disabled={loading}
                  autoComplete="new-password"
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
              {password && (
                <div className="mt-1.5 space-y-1">
                  <PasswordRequirement
                    label="At least 8 characters"
                    met={password.length >= 8}
                  />
                  <PasswordRequirement
                    label="Uppercase letter"
                    met={/[A-Z]/.test(password)}
                  />
                  <PasswordRequirement
                    label="Lowercase letter"
                    met={/[a-z]/.test(password)}
                  />
                  <PasswordRequirement label="Digit" met={/[0-9]/.test(password)} />
                </div>
              )}
            </div>

            {/* Confirm New Password */}
            <div>
              <label
                htmlFor="rp-confirm"
                className="block font-satoshi font-bold text-sm text-primary mb-1.5"
              >
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="rp-confirm"
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your new password"
                  disabled={loading}
                  autoComplete="new-password"
                  className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-lg font-satoshi text-sm text-primary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                >
                  {showConfirm ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="mt-1 text-xs text-red-500 font-satoshi">
                  Passwords do not match.
                </p>
              )}
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
                  Updating password...
                </>
              ) : (
                "Reset Password"
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

/** Small helper component for password strength indicators. */
function PasswordRequirement({
  label,
  met,
}: {
  label: string;
  met: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      {met ? (
        <CheckCircle className="w-3.5 h-3.5 text-green-500" />
      ) : (
        <div className="w-3.5 h-3.5 rounded-full border-2 border-gray-300" />
      )}
      <span
        className={`font-satoshi text-xs ${met ? "text-green-600" : "text-gray-400"}`}
      >
        {label}
      </span>
    </div>
  );
}
