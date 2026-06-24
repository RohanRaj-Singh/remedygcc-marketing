import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/employee-access/session";
import { getTenantBySlug } from "@/data/tenants";
import type { EmployeeSession } from "@/types/employee-access";

/** URL of the Tenant App API (set via environment variable). */
const TENANT_APP_URL =
  process.env.TENANT_APP_URL ?? "http://localhost:3100";

/** Shared API key for server-to-server calls to the Tenant App. */
const ADMIN_API_KEY = process.env.ADMIN_API_KEY ?? "";

interface CreateClaimRequest {
  clinicId: string;
  clinicName: string;
  amount: number;
  description: string;
  serviceDate?: string;
  /** Base64-encoded file data (data URI or raw base64). */
  fileData?: string;
  /** Original filename, used to detect extension. */
  fileName?: string;
  /** MIME type of the file. */
  mimeType?: string;
}

interface CreateClaimResponse {
  success: boolean;
  claimId?: string;
  claim?: {
    reimbursementId: string;
    claimNumber?: string;
    status: string;
    createdAt: string;
    amount: number;
    description: string;
    clinicName: string;
  };
  error?: string;
  errorCode?: string;
}

export async function POST(request: NextRequest) {
  try {
    // ── Validate employee session ───────────────────────────────────────────
    const session = getSession();
    if (!session) {
      return NextResponse.json<CreateClaimResponse>(
        { success: false, error: "Authentication required.", errorCode: "NOT_AUTHENTICATED" },
        { status: 401 },
      );
    }

    const body: CreateClaimRequest = await request.json();
    const { clinicId, clinicName, amount, description, serviceDate, fileData, fileName, mimeType } = body;

    // ── Validate required fields ───────────────────────────────────────────
    if (!clinicId) {
      return NextResponse.json<CreateClaimResponse>(
        { success: false, error: "Please select a clinic.", errorCode: "VALIDATION" },
        { status: 400 },
      );
    }

    if (!clinicName) {
      return NextResponse.json<CreateClaimResponse>(
        { success: false, error: "Clinic name is required.", errorCode: "VALIDATION" },
        { status: 400 },
      );
    }

    if (amount == null || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json<CreateClaimResponse>(
        { success: false, error: "Amount must be greater than 0.", errorCode: "VALIDATION" },
        { status: 400 },
      );
    }

    if (!description || typeof description !== "string") {
      return NextResponse.json<CreateClaimResponse>(
        { success: false, error: "Description is required.", errorCode: "VALIDATION" },
        { status: 400 },
      );
    }

    if (description.trim().length > 2000) {
      return NextResponse.json<CreateClaimResponse>(
        { success: false, error: "Description must be 2000 characters or less.", errorCode: "VALIDATION" },
        { status: 400 },
      );
    }

    if (!fileData || !fileName) {
      return NextResponse.json<CreateClaimResponse>(
        { success: false, error: "Please upload a receipt.", errorCode: "VALIDATION" },
        { status: 400 },
      );
    }

    // ── Upload receipt file to Tenant App ──────────────────────────────────
    let receiptUrl: string | undefined;
    let receiptHash: string | undefined;

    try {
      // Convert base64 data URI to raw base64 if needed
      let rawBase64 = fileData;
      if (fileData.startsWith("data:")) {
        rawBase64 = fileData.split(",")[1] ?? fileData;
      }

      const buffer = Buffer.from(rawBase64, "base64");
      const blob = new Blob([buffer], { type: mimeType ?? "application/octet-stream" });
      const uploadForm = new FormData();
      uploadForm.append("file", blob, fileName);

      const uploadRes = await fetch(
        `${TENANT_APP_URL}/api/employee/receipts`,
        {
          method: "POST",
          headers: { "x-admin-api-key": ADMIN_API_KEY },
          body: uploadForm,
          signal: AbortSignal.timeout(30_000),
        },
      );

      if (!uploadRes.ok) {
        const uploadErr = await uploadRes.json().catch(() => ({ error: "Upload failed." }));
        return NextResponse.json<CreateClaimResponse>(
          { success: false, error: uploadErr.error ?? "Failed to upload receipt.", errorCode: "UPLOAD_FAILED" },
          { status: 502 },
        );
      }

      const uploadData = await uploadRes.json();
      receiptUrl = uploadData.url;
      receiptHash = typeof uploadData.hash === "string" ? uploadData.hash : undefined;
    } catch {
      return NextResponse.json<CreateClaimResponse>(
        { success: false, error: "Failed to upload receipt. Please try again.", errorCode: "UPLOAD_FAILED" },
        { status: 502 },
      );
    }

    // ── Create claim via Tenant App ────────────────────────────────────────
    // Employee identity comes from the session, NOT from client form data
    const claimPayload = {
      tenantId: session.tenantId,
      employeeCode: session.employeeCode,
      clinicId,
      clinicName,
      amount,
      description: description.trim(),
      receiptUrl,
      receiptHash,
      serviceDate: typeof serviceDate === "string" ? serviceDate : undefined,
    };

    let claimRes: Response;
    try {
      claimRes = await fetch(
        `${TENANT_APP_URL}/api/employee/reimbursements`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-admin-api-key": ADMIN_API_KEY,
          },
          body: JSON.stringify(claimPayload),
          signal: AbortSignal.timeout(15_000),
        },
      );
    } catch {
      // Upload succeeded but claim creation request failed — clean up orphaned file
      if (receiptUrl) {
        try {
          await fetch(
            `${TENANT_APP_URL}/api/employee/receipts/cleanup`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                "x-admin-api-key": ADMIN_API_KEY,
              },
              body: JSON.stringify({ receiptUrl }),
              signal: AbortSignal.timeout(5_000),
            },
          );
        } catch {
          // Best-effort cleanup
        }
      }

      return NextResponse.json<CreateClaimResponse>(
        { success: false, error: "Unable to connect. Please try again.", errorCode: "CONNECTION_ERROR" },
        { status: 503 },
      );
    }

    const claimData = await claimRes.json();

    if (!claimRes.ok) {
      // Upload succeeded but claim creation failed — clean up orphaned file
      try {
        await fetch(
          `${TENANT_APP_URL}/api/employee/receipts/cleanup`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              "x-admin-api-key": ADMIN_API_KEY,
            },
            body: JSON.stringify({ receiptUrl }),
            signal: AbortSignal.timeout(5_000),
          },
        );
      } catch {
        // Best-effort cleanup — file will be collected later if this fails
      }

      return NextResponse.json<CreateClaimResponse>(
        {
          success: false,
          error: claimData.error ?? "Failed to create claim.",
          errorCode: "CLAIM_FAILED",
        },
        { status: claimRes.status },
      );
    }

    // ── Success ─────────────────────────────────────────────────────────────
    return NextResponse.json<CreateClaimResponse>(
      {
        success: true,
        claimId: claimData.reimbursementId,
        claim: {
          reimbursementId: claimData.reimbursementId,
          claimNumber: claimData.claimNumber,
          status: claimData.status,
          createdAt: claimData.createdAt,
          amount: claimData.amount,
          description: claimData.description,
          clinicName: claimData.clinicName,
        },
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json<CreateClaimResponse>(
      { success: false, error: "An unexpected error occurred.", errorCode: "INTERNAL_ERROR" },
      { status: 500 },
    );
  }
}
