"use client";

import { useState, useCallback, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  DollarSign,
  Building2,
  Calendar,
  Loader2,
  X,
} from "lucide-react";

/** Serializable clinic fields — no LucideIcon refs that break server→client serialization. */
export interface SerializableClinic {
  id: string | number;
  slug: string;
  name: string;
  nameAr: string;
}

interface ClaimFormProps {
  clinics: SerializableClinic[];
  employeeName: string;
  employeeCode: string;
  tenantName: string;
}

interface ClaimSuccess {
  reimbursementId: string;
  claimNumber?: string;
  status: string;
  createdAt: string;
  amount: number;
  description: string;
  clinicName: string;
}

type FormErrors = Partial<Record<"clinicId" | "serviceDate" | "amount" | "description" | "receipt", string>>;

const ACCEPTED_FILE_TYPES = ".pdf,.jpg,.jpeg,.png";
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_DESC_LENGTH = 2000;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ClaimForm({
  clinics,
  employeeName,
  employeeCode,
  tenantName,
}: ClaimFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [clinicId, setClinicId] = useState("");
  const [serviceDate, setServiceDate] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [sessionCount, setSessionCount] = useState(1);
  const [sessionTypes, setSessionTypes] = useState<string[]>([]);
  const [sessionFor, setSessionFor] = useState("");
  const [sessionForOther, setSessionForOther] = useState("");
  const [contactCountryCode, setContactCountryCode] = useState("+968");
  const [contactNumber, setContactNumber] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  // UI state
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState<ClaimSuccess | null>(null);
  const [submitError, setSubmitError] = useState("");

  // ── File handling ──────────────────────────────────────────────────────────

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) {
      setFile(null);
      setFilePreview(null);
      return;
    }

    // Validate file type
    const ext = "." + selected.name.split(".").pop()?.toLowerCase();
    const allowed = [".pdf", ".jpg", ".jpeg", ".png"];
    if (!allowed.includes(ext)) {
      setErrors((prev) => ({ ...prev, receipt: "Receipt must be a PDF, JPG, or PNG file." }));
      setFile(null);
      setFilePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // Validate file size
    if (selected.size > MAX_FILE_SIZE) {
      setErrors((prev) => ({ ...prev, receipt: "Receipt file must be 10 MB or smaller." }));
      setFile(null);
      setFilePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setErrors((prev) => {
      const next = { ...prev };
      delete next.receipt;
      return next;
    });
    setFile(selected);

    // Preview for images
    if (ext === ".jpg" || ext === ".jpeg" || ext === ".png") {
      setFilePreview(URL.createObjectURL(selected));
    } else {
      setFilePreview(null);
    }
  }, []);

  // ── Client-side validation ─────────────────────────────────────────────────

  const validate = useCallback((): FormErrors => {
    const errs: FormErrors = {};

    if (!clinicId) {
      errs.clinicId = "Please select a clinic.";
    }

    if (!serviceDate) {
      errs.serviceDate = "Service date is required.";
    } else {
      const today = new Date();
      const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
      if (serviceDate > todayStr) {
        errs.serviceDate = "Service date cannot be in the future.";
      }
    }

    const amountNum = parseFloat(amount);
    if (!amount || isNaN(amountNum) || amountNum <= 0) {
      errs.amount = "Amount must be greater than 0.";
    }

    if (!description.trim()) {
      errs.description = "Description is required.";
    } else if (description.trim().length > MAX_DESC_LENGTH) {
      errs.description = `Description must be ${MAX_DESC_LENGTH} characters or less.`;
    }

    if (!file) {
      errs.receipt = "Please upload a receipt.";
    }

    return errs;
  }, [clinicId, serviceDate, amount, description, file]);

  // ── Form submission ────────────────────────────────────────────────────────

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitError("");

      const validationErrors = validate();
      setErrors(validationErrors);

      if (Object.keys(validationErrors).length > 0) {
        return;
      }

      setLoading(true);

      try {
        // Read file as base64 using FileReader (supports all binary types correctly)
        let fileData = "";
        let fileName = "";
        let mimeType = "";

        if (file) {
          fileName = file.name;
          mimeType = file.type;
          fileData = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              const result = reader.result as string;
              // result is "data:...;base64,<base64>"
              const base64 = result.includes(",") ? result.split(",")[1] : result;
              resolve(base64);
            };
            reader.onerror = () => reject(new Error("Failed to read file."));
            reader.readAsDataURL(file);
          });
        }

        const res = await fetch("/api/employee-access/reimbursements", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clinicId,
            clinicName: clinics.find((c) => c.slug === clinicId)?.name ?? "",
            amount: parseFloat(amount),
            description: description.trim(),
            serviceDate,
            sessionCount,
            sessionTypes: sessionTypes.length > 0 ? sessionTypes : undefined,
            sessionFor: sessionFor || undefined,
            sessionForOther: sessionForOther || undefined,
            contactCountryCode: contactCountryCode || undefined,
            contactNumber: contactNumber || undefined,
            bankAccountNumber: bankAccountNumber || undefined,
            bankName: bankName || undefined,
            fileData,
            fileName,
            mimeType,
          }),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          setSubmitError(data.error || "Failed to submit claim. Please try again.");
          setLoading(false);
          return;
        }

        // Success
        setSuccess({
          reimbursementId: data.claim.reimbursementId,
          claimNumber: data.claim.claimNumber,
          status: data.claim.status,
          createdAt: data.claim.createdAt,
          amount: data.claim.amount,
          description: data.claim.description,
          clinicName: data.claim.clinicName,
        });
      } catch {
        setSubmitError("An error occurred. Please try again.");
      }

      setLoading(false);
    },
    [clinicId, clinics, serviceDate, amount, description, file, validate],
  );

  // ── Reset form ─────────────────────────────────────────────────────────────

  const handleNewClaim = useCallback(() => {
    setSuccess(null);
    setClinicId("");
    setServiceDate("");
    setAmount("");
    setDescription("");
    setSessionCount(1);
    setSessionTypes([]);
    setSessionFor("");
    setSessionForOther("");
    setContactCountryCode("+968");
    setContactNumber("");
    setBankAccountNumber("");
    setBankName("");
    setFile(null);
    setFilePreview(null);
    setErrors({});
    setSubmitError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  // ── Success screen ─────────────────────────────────────────────────────────

  if (success) {
    return (
      <div className="min-h-[60vh] flex items-start justify-center bg-gradient-to-br from-primary/5 to-white pt-28 pb-10">
        <div className="w-full max-w-lg mx-auto px-4">
          {/* Back link */}
          <button
            type="button"
            onClick={() => router.push("/reimbursement/portal")}
            className="inline-flex items-center gap-2 text-sm text-primary font-satoshi hover:underline mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Portal
          </button>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>

            <h1 className="font-roca-one text-2xl text-primary mb-2">
              Claim Submitted Successfully
            </h1>
            <p className="text-gray-500 font-satoshi text-sm mb-6">
              Your reimbursement claim has been submitted for review.
            </p>

            {/* Reference number — prominently displayed for the user to note */}
            <div className="bg-primary/5 border border-primary/10 rounded-xl p-5 mb-6">
              <p className="font-satoshi text-xs text-gray-500 uppercase tracking-wider mb-2">
                Your Reference Number
              </p>
              <p className="font-satoshi font-bold text-2xl text-primary tracking-wider select-all">
                {success.claimNumber ?? success.reimbursementId}
              </p>
              <p className="font-satoshi text-xs text-gray-400 mt-2">
                Save this number to track your claim status.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 text-left space-y-3 mb-8">
              <div className="flex justify-between">
                <span className="font-satoshi text-xs text-gray-400 uppercase tracking-wider">
                  Clinic
                </span>
                <span className="font-satoshi font-medium text-primary text-sm">
                  {success.clinicName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-satoshi text-xs text-gray-400 uppercase tracking-wider">
                  Amount
                </span>
                <span className="font-satoshi font-bold text-primary text-sm">
                  OMR {success.amount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-satoshi text-xs text-gray-400 uppercase tracking-wider">
                  Submission Date
                </span>
                <span className="font-satoshi font-medium text-primary text-sm">
                  {formatDate(success.createdAt)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-satoshi text-xs text-gray-400 uppercase tracking-wider">
                  Status
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-700 font-satoshi font-bold text-xs rounded-full">
                  Pending
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleNewClaim}
                className="flex-1 bg-primary text-white font-satoshi font-bold py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Submit Another Claim
              </button>
              <button
                type="button"
                onClick={() => router.push("/reimbursement/portal")}
                className="flex-1 bg-white text-primary font-satoshi font-bold py-3 px-6 rounded-lg border border-primary/30 hover:bg-primary/5 transition-colors"
              >
                Back to Portal
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Claim form ─────────────────────────────────────────────────────────────

  return (
    <div className="min-h-[60vh] bg-gradient-to-br from-primary/5 to-white pt-28 pb-10">
      <div className="w-full max-w-2xl mx-auto px-4">
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

          <span className="inline-block px-4 py-2 bg-primary/10 text-primary font-satoshi font-bold rounded-full text-sm mb-4">
            New Claim
          </span>
          <h1 className="text-4xl md:text-5xl font-roca-one text-primary mb-2">
            Submit a Reimbursement Claim
          </h1>
          <p className="text-gray-500 font-satoshi">
            {employeeName} — {employeeCode} &middot; {tenantName}
          </p>
        </div>

        {/* Error banner */}
        {submitError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="font-satoshi text-sm text-red-700">{submitError}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Clinic Selection */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-satoshi font-bold text-primary text-lg mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Clinic
            </h2>
            <div>
              <select
                value={clinicId}
                onChange={(e) => {
                  setClinicId(e.target.value);
                  if (e.target.value) {
                    setErrors((prev) => {
                      const next = { ...prev };
                      delete next.clinicId;
                      return next;
                    });
                  }
                }}
                disabled={loading}
                className={`w-full px-4 py-3 bg-gray-50 border rounded-lg font-satoshi text-sm text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors appearance-none ${
                  errors.clinicId ? "border-red-300 bg-red-50" : "border-gray-200"
                }`}
              >
                <option value="">Select a clinic</option>
                {clinics.map((clinic) => (
                  <option key={clinic.id} value={clinic.slug}>
                    {clinic.name}
                  </option>
                ))}
              </select>
              {errors.clinicId && (
                <p className="mt-1 font-satoshi text-xs text-red-500">{errors.clinicId}</p>
              )}
            </div>
          </div>

          {/* Service Date */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-satoshi font-bold text-primary text-lg mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Service Date
            </h2>
            <div>
              <input
                type="date"
                value={serviceDate}
                max={new Date().toISOString().slice(0, 10)}
                onChange={(e) => {
                  setServiceDate(e.target.value);
                  setErrors((prev) => {
                    const next = { ...prev };
                    delete next.serviceDate;
                    return next;
                  });
                }}
                disabled={loading}
                className={`w-full px-4 py-3 bg-gray-50 border rounded-lg font-satoshi text-sm text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
                  errors.serviceDate ? "border-red-300 bg-red-50" : "border-gray-200"
                }`}
              />
              {errors.serviceDate && (
                <p className="mt-1 font-satoshi text-xs text-red-500">{errors.serviceDate}</p>
              )}
              <p className="mt-1 font-satoshi text-xs text-gray-400">
                The date the service took place (cannot be in the future).
              </p>
            </div>
          </div>

          {/* Amount */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-satoshi font-bold text-primary text-lg mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Amount
            </h2>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-satoshi text-sm text-gray-400">
                OMR
              </span>
              <input
                type="number"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  if (parseFloat(e.target.value) > 0) {
                    setErrors((prev) => {
                      const next = { ...prev };
                      delete next.amount;
                      return next;
                    });
                  }
                }}
                placeholder="0.000"
                min="0"
                step="0.001"
                disabled={loading}
                className={`w-full pl-16 pr-4 py-3 bg-gray-50 border rounded-lg font-satoshi text-sm text-primary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
                  errors.amount ? "border-red-300 bg-red-50" : "border-gray-200"
                }`}
              />
            </div>
            {errors.amount && (
              <p className="mt-1 font-satoshi text-xs text-red-500">{errors.amount}</p>
            )}
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-satoshi font-bold text-primary text-lg mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Description
            </h2>
            <div>
              <textarea
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (e.target.value.trim()) {
                    setErrors((prev) => {
                      const next = { ...prev };
                      delete next.description;
                      return next;
                    });
                  }
                }}
                placeholder="e.g. Counselling Session, Therapy Session Reimbursement, Mental Health Consultation"
                rows={4}
                maxLength={MAX_DESC_LENGTH}
                disabled={loading}
                className={`w-full px-4 py-3 bg-gray-50 border rounded-lg font-satoshi text-sm text-primary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors resize-none ${
                  errors.description ? "border-red-300 bg-red-50" : "border-gray-200"
                }`}
              />
              <div className="flex justify-between mt-1">
                {errors.description ? (
                  <p className="font-satoshi text-xs text-red-500">{errors.description}</p>
                ) : (
                  <span />
                )}
                <span className={`font-satoshi text-xs ${description.length > MAX_DESC_LENGTH ? "text-red-500" : "text-gray-400"}`}>
                  {description.length}/{MAX_DESC_LENGTH}
                </span>
              </div>
            </div>
          </div>

          {/* Session Count — Slider */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-satoshi font-bold text-primary text-lg mb-4">
              How many sessions?
            </h2>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={1}
                max={20}
                value={sessionCount}
                onChange={(e) => setSessionCount(Number(e.target.value))}
                disabled={loading}
                className="flex-1 h-2 rounded-full appearance-none cursor-pointer bg-gray-200 accent-primary"
              />
              <span className="font-satoshi text-sm font-medium text-primary w-20 text-right">
                {sessionCount} session{sessionCount !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {/* Session Type — Tags */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-satoshi font-bold text-primary text-lg mb-1">
              Type of session?
            </h2>
            <p className="font-satoshi text-xs text-gray-400 mb-4">Select all that apply</p>
            <div className="flex flex-wrap gap-2">
              {["Intake Session", "Assessment", "Individual", "Follow-up"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() =>
                    setSessionTypes((prev) =>
                      prev.includes(type)
                        ? prev.filter((t) => t !== type)
                        : [...prev, type],
                    )
                  }
                  disabled={loading}
                  className={`rounded-full px-4 py-2 font-satoshi text-sm font-medium transition-colors ${
                    sessionTypes.includes(type)
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Session For — Radio */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-satoshi font-bold text-primary text-lg mb-4">
              Who was this session for?
            </h2>
            <div className="space-y-3">
              {[
                { value: "myself", label: "Myself" },
                { value: "family_member", label: "Family member" },
                { value: "other", label: "Other" },
              ].map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="claimSessionFor"
                    value={option.value}
                    checked={sessionFor === option.value}
                    onChange={(e) => setSessionFor(e.target.value)}
                    disabled={loading}
                    className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                  />
                  <span className="font-satoshi text-sm text-primary">{option.label}</span>
                </label>
              ))}
            </div>
            {sessionFor === "other" && (
              <input
                type="text"
                value={sessionForOther}
                onChange={(e) => setSessionForOther(e.target.value)}
                placeholder="Please specify..."
                disabled={loading}
                className="mt-3 w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg font-satoshi text-sm text-primary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              />
            )}
          </div>

          {/* Contact Number */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-satoshi font-bold text-primary text-lg mb-4">
              Contact number
            </h2>
            <div className="flex gap-2">
              <select
                value={contactCountryCode}
                onChange={(e) => setContactCountryCode(e.target.value)}
                disabled={loading}
                className="w-28 px-3 py-3 bg-gray-50 border border-gray-200 rounded-lg font-satoshi text-sm text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors appearance-none"
              >
                {["+968", "+971", "+966", "+973", "+974", "+965", "+44", "+1", "+other"].map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
              <input
                type="tel"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="Phone number"
                disabled={loading}
                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg font-satoshi text-sm text-primary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              />
            </div>
          </div>

          {/* Bank Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-satoshi font-bold text-primary text-lg mb-4">
              Bank details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block font-satoshi text-sm font-medium text-primary mb-1.5">
                  Bank account number
                </label>
                <input
                  type="text"
                  value={bankAccountNumber}
                  onChange={(e) => setBankAccountNumber(e.target.value)}
                  placeholder="Enter account number"
                  disabled={loading}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg font-satoshi text-sm text-primary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                />
              </div>
              <div>
                <label className="block font-satoshi text-sm font-medium text-primary mb-1.5">
                  Which bank?
                </label>
                <select
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  disabled={loading}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg font-satoshi text-sm text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors appearance-none"
                >
                  <option value="">Select a bank...</option>
                  {["Bank Dhofar", "Bank Muscat", "National Bank of Oman", "Oman Arab Bank", "Ahli Bank", "HSBC Oman", "Other"].map((bank) => (
                    <option key={bank} value={bank}>
                      {bank}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Receipt Upload */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-satoshi font-bold text-primary text-lg mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Receipt
            </h2>
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                errors.receipt
                  ? "border-red-300 bg-red-50"
                  : file
                    ? "border-green-300 bg-green-50"
                    : "border-gray-200 hover:border-primary/30 hover:bg-gray-50"
              }`}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  fileInputRef.current?.click();
                }
              }}
              role="button"
              tabIndex={0}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED_FILE_TYPES}
                onChange={handleFileChange}
                disabled={loading}
                className="hidden"
              />

              {file && filePreview ? (
                <div className="space-y-2 relative">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                      setFilePreview(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-100 hover:bg-red-200 text-red-600 rounded-full flex items-center justify-center transition-colors"
                    aria-label="Remove receipt"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <img
                    src={filePreview}
                    alt="Receipt preview"
                    className="max-h-40 mx-auto rounded"
                  />
                  <p className="font-satoshi text-sm text-primary font-medium">{file.name}</p>
                </div>
              ) : file ? (
                <div className="space-y-2 relative">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                      setFilePreview(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-100 hover:bg-red-200 text-red-600 rounded-full flex items-center justify-center transition-colors"
                    aria-label="Remove receipt"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <FileText className="w-10 h-10 text-primary mx-auto" />
                  <p className="font-satoshi text-sm text-primary font-medium">{file.name}</p>
                  <p className="font-satoshi text-xs text-gray-400">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="w-10 h-10 text-gray-300 mx-auto" />
                  <p className="font-satoshi text-sm text-gray-500">
                    <span className="font-bold text-primary">Click to upload</span> or drag and drop
                  </p>
                  <p className="font-satoshi text-xs text-gray-400">
                    PDF, JPG, or PNG (max 10 MB)
                  </p>
                </div>
              )}
            </div>
            {file && (
              <div className="mt-3 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                <p className="font-satoshi text-xs text-amber-700">
                  Please make sure everything is visible, and that your name does not show.
                </p>
              </div>
            )}
            {errors.receipt && (
              <p className="mt-1 font-satoshi text-xs text-red-500">{errors.receipt}</p>
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
                <Loader2 className="w-5 h-5 animate-spin" />
                Submitting Claim...
              </>
            ) : (
              <>Submit Claim</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
