"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Lock,
  AlertCircle,
  CheckCircle,
  ShieldAlert,
} from "lucide-react";
import type { ChangePasswordResponse } from "@/types/employee-access";

interface ChangePasswordFormProps {
  mustChange: boolean;
}

const ERROR_MESSAGES: Record<string, string> = {
  INVALID_PASSWORD: "Current password is incorrect.",
  WEAK_PASSWORD:
    "Password must be at least 8 characters with uppercase, lowercase, and a digit.",
};

export default function ChangePasswordForm({
  mustChange,
}: ChangePasswordFormProps) {
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
      setErrorCode(null);

      // Client-side validation
      if (!currentPassword) {
        setError("Current password is required.");
        setErrorCode("INVALID_PASSWORD");
        return;
      }

      if (!newPassword) {
        setError("New password is required.");
        setErrorCode("WEAK_PASSWORD");
        return;
      }

      if (
        newPassword.length < 8 ||
        !/[A-Z]/.test(newPassword) ||
        !/[a-z]/.test(newPassword) ||
        !/[0-9]/.test(newPassword)
      ) {
        setError(
          "Password must be at least 8 characters with uppercase, lowercase, and a digit.",
        );
        setErrorCode("WEAK_PASSWORD");
        return;
      }

      if (newPassword !== confirmPassword) {
        setError("Passwords do not match.");
        setErrorCode("WEAK_PASSWORD");
        return;
      }

      if (newPassword === currentPassword) {
        setError("New password must be different from your current password.");
        setErrorCode("INVALID_PASSWORD");
        return;
      }

      setLoading(true);

      try {
        const res = await fetch("/api/employee-access/change-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        });

        const data: ChangePasswordResponse = await res.json();

        if (!data.success) {
          setErrorCode(data.errorCode ?? null);
          setError(
            data.error
              ? ERROR_MESSAGES[data.errorCode ?? ""] ?? data.error
              : "Failed to update password.",
          );
          setLoading(false);
          return;
        }

        // Success
        setSuccess(true);
        setLoading(false);

        // Redirect to portal after a brief delay
        setTimeout(() => {
          router.push("/reimbursement/portal");
        }, 2000);
      } catch {
        setError("An error occurred. Please try again.");
        setErrorCode(null);
        setLoading(false);
      }
    },
    [currentPassword, newPassword, confirmPassword, router],
  );

  // ── Success state ─────────────────────────────────────────────────────────

  if (success) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
        <h2 className="font-roca-one text-2xl text-primary mb-2">
          Password Updated
        </h2>
        <p className="font-satoshi text-gray-500 text-sm mb-8">
          Password updated successfully.
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-400 font-satoshi">
          <svg
            className="animate-spin w-4 h-4"
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
          Redirecting to portal...
        </div>
      </div>
    );
  }

  // ── Form ──────────────────────────────────────────────────────────────────

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Lock className="w-7 h-7 text-primary" />
        </div>
        <h1 className="font-roca-one text-2xl text-primary mb-1">
          Change Password
        </h1>
        <p className="text-gray-500 font-satoshi text-sm">
          Update your account password
        </p>
      </div>

      {/* mustChangePassword banner */}
      {mustChange && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="font-satoshi text-sm text-amber-800">
            Your password has been reset by an administrator. Please choose a new
            password to continue.
          </p>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <p className="font-satoshi text-sm text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Current Password */}
        <div>
          <label
            htmlFor="cp-current"
            className="block font-satoshi font-bold text-sm text-primary mb-1.5"
          >
            Current Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="cp-current"
              type={showCurrent ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter your current password"
              disabled={loading}
              autoComplete="current-password"
              className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-lg font-satoshi text-sm text-primary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              tabIndex={-1}
              aria-label={showCurrent ? "Hide password" : "Show password"}
            >
              {showCurrent ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label
            htmlFor="cp-new"
            className="block font-satoshi font-bold text-sm text-primary mb-1.5"
          >
            New Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="cp-new"
              type={showNew ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min. 8 characters with uppercase, lowercase & digit"
              disabled={loading}
              autoComplete="new-password"
              className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-lg font-satoshi text-sm text-primary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              tabIndex={-1}
              aria-label={showNew ? "Hide password" : "Show password"}
            >
              {showNew ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {newPassword && (
            <div className="mt-1.5 space-y-1">
              <PasswordRequirement
                label="At least 8 characters"
                met={newPassword.length >= 8}
              />
              <PasswordRequirement
                label="Uppercase letter"
                met={/[A-Z]/.test(newPassword)}
              />
              <PasswordRequirement
                label="Lowercase letter"
                met={/[a-z]/.test(newPassword)}
              />
              <PasswordRequirement
                label="Digit"
                met={/[0-9]/.test(newPassword)}
              />
            </div>
          )}
        </div>

        {/* Confirm New Password */}
        <div>
          <label
            htmlFor="cp-confirm"
            className="block font-satoshi font-bold text-sm text-primary mb-1.5"
          >
            Confirm New Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="cp-confirm"
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
          {confirmPassword && newPassword !== confirmPassword && (
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
            "Update Password"
          )}
        </button>
      </form>
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
