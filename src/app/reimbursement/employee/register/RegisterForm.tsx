"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Building2,
  User,
  Phone,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import type { Tenant, RegisterResponse } from "@/types/employee-access";

interface RegisterFormProps {
  tenants: Tenant[];
}

const ERROR_MESSAGES: Record<string, string> = {
  EMPLOYEE_NOT_FOUND:
    "We couldn't find a matching invitation. Please check your details or contact your organization.",
  ALREADY_REGISTERED:
    "This account is already registered. Please sign in instead.",
  EMAIL_MISMATCH: "The email you entered doesn't match our records.",
  WEAK_PASSWORD:
    "Password must be at least 8 characters with uppercase, lowercase, and a digit.",
  ACCOUNT_NOT_AVAILABLE: "This account cannot be registered at this time.",
};

export default function RegisterForm({ tenants }: RegisterFormProps) {
  const router = useRouter();

  // Form fields
  const [selectedSlug, setSelectedSlug] = useState("");
  const [employeeCode, setEmployeeCode] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
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
    if (!selectedSlug) return "Please select your organization.";
    if (!employeeCode.trim()) return "Employee code is required.";
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
  }, [selectedSlug, employeeCode, email, name, password, confirmPassword]);

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
        const res = await fetch("/api/employee-access/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tenantSlug: selectedSlug,
            employeeCode: employeeCode.trim(),
            email: email.trim(),
            password,
            name: name.trim(),
            ...(phone.trim() ? { phone: phone.trim() } : {}),
          }),
        });

        const data: RegisterResponse = await res.json();

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
    [selectedSlug, employeeCode, email, password, name, phone, confirmPassword, validateForm, router],
  );

  // Error code to determine if we should show the "sign in instead" link
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
          <User className="w-7 h-7 text-primary" />
        </div>
        <h1 className="font-roca-one text-2xl text-primary mb-1">
          Create Account
        </h1>
        <p className="text-gray-500 font-satoshi text-sm">
          Set up your account to access the employee portal
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
                href={`/reimbursement/employee${selectedSlug ? `?tenant=${selectedSlug}` : ""}`}
                className="font-satoshi text-xs text-red-600 underline mt-1 inline-block hover:no-underline"
              >
                Sign in here
              </Link>
            )}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Organization */}
        <div>
          <label
            htmlFor="reg-organization"
            className="block font-satoshi font-bold text-sm text-primary mb-1.5"
          >
            Organization
          </label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <select
              id="reg-organization"
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

        {/* Employee Code */}
        <div>
          <label
            htmlFor="reg-employeeCode"
            className="block font-satoshi font-bold text-sm text-primary mb-1.5"
          >
            Employee Code
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="reg-employeeCode"
              type="text"
              value={employeeCode}
              onChange={(e) => setEmployeeCode(e.target.value)}
              placeholder="e.g. EMP-001"
              disabled={loading}
              autoComplete="off"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg font-satoshi text-sm text-primary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="reg-email"
            className="block font-satoshi font-bold text-sm text-primary mb-1.5"
          >
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="reg-email"
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

        {/* Full Name */}
        <div>
          <label
            htmlFor="reg-name"
            className="block font-satoshi font-bold text-sm text-primary mb-1.5"
          >
            Full Name
          </label>
          <input
            id="reg-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            disabled={loading}
            maxLength={100}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg font-satoshi text-sm text-primary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          />
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor="reg-phone"
            className="block font-satoshi font-bold text-sm text-primary mb-1.5"
          >
            Phone <span className="font-normal text-gray-400">(optional)</span>
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="reg-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+968 XXXX XXXX"
              disabled={loading}
              autoComplete="tel"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg font-satoshi text-sm text-primary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="reg-password"
            className="block font-satoshi font-bold text-sm text-primary mb-1.5"
          >
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="reg-password"
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
              <PasswordRequirement
                label="Digit"
                met={/[0-9]/.test(password)}
              />
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="reg-confirm"
            className="block font-satoshi font-bold text-sm text-primary mb-1.5"
          >
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="reg-confirm"
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
            href="/reimbursement/employee"
            className="text-primary font-bold hover:underline"
          >
            Sign In
          </Link>
        </p>
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
