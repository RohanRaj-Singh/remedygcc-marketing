"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  UserRound,
  Phone,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import type { IndividualRegisterResponse } from "@/types/employee-access";

const ERROR_MESSAGES: Record<string, string> = {
  ALREADY_REGISTERED:
    "This account is already registered. Please sign in instead.",
  WEAK_PASSWORD:
    "Password must be at least 8 characters with uppercase, lowercase, and a digit.",
  VALIDATION_ERROR: "Please check your details and try again.",
  NAME_REQUIRED: "Full name is required.",
};

export default function IndividualRegisterForm() {
  const router = useRouter();

  // Form fields
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const validateForm = useCallback((): string | null => {
    if (!email.trim() || !email.includes("@"))
      return "Please enter a valid email address.";
    if (!name.trim()) return "Full name is required.";
    if (name.trim().length > 100) return "Name must be 100 characters or fewer.";
    if (!password) return "Password is required.";
    if (
      password.length < 8 ||
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password) ||
      !/[0-9]/.test(password)
    )
      return "Password must be at least 8 characters with uppercase, lowercase, and a digit.";
    if (password !== confirmPassword) return "Passwords do not match.";
    return null;
  }, [email, name, password, confirmPassword]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
      setErrorCode(null);

      const validationError = validateForm();
      if (validationError) {
        setError(validationError);
        return;
      }

      setLoading(true);

      try {
        const res = await fetch("/api/employee-access/individual-register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email.trim(),
            password,
            name: name.trim(),
            ...(phoneNumber.trim() ? { phoneNumber: phoneNumber.trim() } : {}),
            ...(bankName.trim() ? { bankName: bankName.trim() } : {}),
            ...(bankAccountNumber.trim() ? { bankAccountNumber: bankAccountNumber.trim() } : {}),
          }),
        });

        const data: IndividualRegisterResponse = await res.json();

        if (!data.success) {
          setErrorCode(data.errorCode ?? null);
          setError(
            data.error
              ? ERROR_MESSAGES[data.errorCode ?? ""] ?? data.error
              : "Registration failed. Please try again.",
          );
          setLoading(false);
          return;
        }

        // Success
        setSuccess(true);
        setLoading(false);

        setTimeout(() => {
          router.push("/reimbursement/portal");
        }, 2000);
      } catch {
        setError("An error occurred. Please try again.");
        setErrorCode(null);
        setLoading(false);
      }
    },
    [email, password, name, phoneNumber, bankName, bankAccountNumber, validateForm, router],
  );

  const isAlreadyRegistered = errorCode === "ALREADY_REGISTERED";

  // ── Success state ─────────────────────────────────────────────────────────

  if (success) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
        <h2 className="font-roca-one text-2xl text-primary mb-2">
          Welcome to Remedy!
        </h2>
        <p className="font-satoshi text-gray-500 text-sm mb-8">
          Your account has been created. You can now submit and track your
          claims.
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

  // ── Form state ────────────────────────────────────────────────────────────

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <UserRound className="w-7 h-7 text-primary" />
        </div>
        <h1 className="font-roca-one text-2xl text-primary mb-1">
          Create Individual Account
        </h1>
        <p className="text-gray-500 font-satoshi text-sm">
          Sign up to submit and track your own claims
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-satoshi text-sm text-red-700">{error}</p>
            {isAlreadyRegistered && (
              <Link
                href="/reimbursement/individual"
                className="font-satoshi text-xs text-red-600 underline mt-1 inline-block hover:no-underline"
              >
                Sign in here
              </Link>
            )}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div>
          <label
            htmlFor="ind-reg-email"
            className="block font-satoshi font-bold text-sm text-primary mb-1.5"
          >
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="ind-reg-email"
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

        {/* Full Name */}
        <div>
          <label
            htmlFor="ind-reg-name"
            className="block font-satoshi font-bold text-sm text-primary mb-1.5"
          >
            Full Name
          </label>
          <input
            id="ind-reg-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            disabled={loading}
            maxLength={100}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg font-satoshi text-sm text-primary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          />
        </div>

        {/* Contact Number */}
        <div>
          <label
            htmlFor="ind-reg-phoneNumber"
            className="block font-satoshi font-bold text-sm text-primary mb-1.5"
          >
            Contact Number <span className="font-normal text-gray-400">(optional)</span>
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="ind-reg-phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+968 XXXX XXXX"
              disabled={loading}
              autoComplete="tel"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg font-satoshi text-sm text-primary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            />
          </div>
        </div>

        {/* Bank Name */}
        <div>
          <label
            htmlFor="ind-reg-bankName"
            className="block font-satoshi font-bold text-sm text-primary mb-1.5"
          >
            Bank Name <span className="font-normal text-gray-400">(optional)</span>
          </label>
          <select
            id="ind-reg-bankName"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg font-satoshi text-sm text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors appearance-none"
          >
            <option value="">Select a bank...</option>
            <option value="Bank Dhofar">Bank Dhofar</option>
            <option value="Bank Muscat">Bank Muscat</option>
            <option value="National Bank of Oman">National Bank of Oman</option>
            <option value="Oman Arab Bank">Oman Arab Bank</option>
            <option value="Ahli Bank">Ahli Bank</option>
            <option value="HSBC Oman">HSBC Oman</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Bank Account Number */}
        <div>
          <label
            htmlFor="ind-reg-bankAccountNumber"
            className="block font-satoshi font-bold text-sm text-primary mb-1.5"
          >
            Bank Account Number <span className="font-normal text-gray-400">(optional)</span>
          </label>
          <input
            id="ind-reg-bankAccountNumber"
            type="text"
            value={bankAccountNumber}
            onChange={(e) => setBankAccountNumber(e.target.value)}
            placeholder="Account number"
            disabled={loading}
            autoComplete="off"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg font-satoshi text-sm text-primary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          />
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="ind-reg-password"
            className="block font-satoshi font-bold text-sm text-primary mb-1.5"
          >
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="ind-reg-password"
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

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="ind-reg-confirm"
            className="block font-satoshi font-bold text-sm text-primary mb-1.5"
          >
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="ind-reg-confirm"
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
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
              Creating account...
            </>
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      {/* Sign In link */}
      <div className="mt-6 text-center">
        <p className="font-satoshi text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            href="/reimbursement/individual"
            className="text-primary font-bold hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>

      {/* Cross-link to organisation access */}
      <p className="text-center text-xs text-gray-400 font-satoshi mt-4">
        Part of a partner organisation?{" "}
        <Link href="/reimbursement" className="text-primary hover:underline">
          Use your organisation portal
        </Link>
      </p>
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
