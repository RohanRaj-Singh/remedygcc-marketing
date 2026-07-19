"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  User,
  Phone,
  Building2,
  CreditCard,
  Lock,
} from "lucide-react";

interface SessionData {
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  tenantId: string;
  tenantName: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [session, setSession] = useState<SessionData | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);

  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch("/api/employee-access/session");
        const data = await res.json();
        if (data.authenticated && data.session) {
          setSession(data.session);
          setName(data.session.employeeName ?? "");
        } else {
          router.push("/reimbursement/employee");
        }
      } catch {
        router.push("/reimbursement/employee");
      }
      setSessionLoading(false);
    }
    checkSession();
  }, [router]);

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/employee-access/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phoneNumber: phoneNumber.trim() || undefined,
          bankAccountNumber: bankAccountNumber.trim() || undefined,
          bankName: bankName.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update profile.");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setSaving(false);
    }
  }

  if (sessionLoading) {
    return (
      <div className="min-h-[60vh] bg-gradient-to-br from-primary/5 to-white flex items-center justify-center">
        <RefreshCw className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-[60vh] bg-gradient-to-br from-primary/5 to-white pt-28 pb-10">
      <div className="w-full max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/reimbursement/portal"
            className="inline-flex items-center gap-1.5 text-sm font-satoshi font-medium text-gray-500 hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to portal
          </Link>
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary font-satoshi font-bold rounded-full text-sm mb-4">
            My Profile
          </span>
          <h1 className="text-4xl md:text-5xl font-roca-one text-primary mb-2">
            Account Settings
          </h1>
          <p className="text-gray-500 font-satoshi text-lg">
            Update your personal information, bank details, and security settings.
          </p>
        </div>

        {/* Success Banner */}
        {success && (
          <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600" />
              <p className="text-sm font-satoshi font-medium text-emerald-800">
                Profile updated successfully.
              </p>
            </div>
          </div>
        )}

        {/* Error Banner */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
              <p className="text-sm font-satoshi text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-satoshi font-bold text-primary text-lg mb-1">
              Personal Information
            </h2>
            <p className="font-satoshi text-sm text-gray-400 mb-6">
              Update your name and contact details.
            </p>

            <div className="space-y-5">
              <div>
                <label className="flex items-center gap-2 font-satoshi text-sm font-medium text-gray-700 mb-1.5">
                  <User className="h-4 w-4 text-gray-400" />
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-satoshi text-gray-900 placeholder:text-gray-400 focus:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/10 transition"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 font-satoshi text-sm font-medium text-gray-700 mb-1.5">
                  <Phone className="h-4 w-4 text-gray-400" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-satoshi text-gray-900 placeholder:text-gray-400 focus:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/10 transition"
                  placeholder="+968 XXXX XXXX"
                />
              </div>
            </div>
          </div>

          {/* Bank Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-satoshi font-bold text-primary text-lg mb-1">
              Bank Details
            </h2>
            <p className="font-satoshi text-sm text-gray-400 mb-6">
              Your bank information is used for claim payouts. This information is only visible to you and Remedy.
            </p>

            <div className="space-y-5">
              <div>
                <label className="flex items-center gap-2 font-satoshi text-sm font-medium text-gray-700 mb-1.5">
                  <Building2 className="h-4 w-4 text-gray-400" />
                  Bank Name
                </label>
                <select
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-satoshi text-gray-900 focus:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/10 transition"
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

              <div>
                <label className="flex items-center gap-2 font-satoshi text-sm font-medium text-gray-700 mb-1.5">
                  <CreditCard className="h-4 w-4 text-gray-400" />
                  Bank Account Number
                </label>
                <input
                  type="text"
                  value={bankAccountNumber}
                  onChange={(e) => setBankAccountNumber(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-satoshi text-gray-900 placeholder:text-gray-400 focus:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/10 transition"
                  placeholder="Account number"
                />
              </div>
            </div>
          </div>

          {/* Password */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-satoshi font-bold text-primary text-lg mb-1">
              Security
            </h2>
            <p className="font-satoshi text-sm text-gray-400 mb-6">
              Manage your password.
            </p>

            <Link
              href="/reimbursement/employee/change-password"
              className="inline-flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-5 py-4 hover:border-primary/20 hover:shadow-sm transition-all w-full group"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Lock className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
              </div>
              <div className="flex-1">
                <p className="font-satoshi font-bold text-primary text-sm">
                  Change Password
                </p>
                <p className="font-satoshi text-xs text-gray-400">
                  Update your account password
                </p>
              </div>
              <span className="text-primary group-hover:translate-x-1 transition-transform" aria-hidden="true">&rarr;</span>
            </Link>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Link
              href="/reimbursement/portal"
              className="rounded-xl border border-gray-200 bg-white px-6 py-3 font-satoshi text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
            >
              Cancel
            </Link>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-satoshi text-sm font-bold text-white hover:opacity-90 transition disabled:opacity-50"
            >
              {saving ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
