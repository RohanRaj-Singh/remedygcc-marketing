import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/employee-access/session";

/** URL of the Tenant App API (set via environment variable). */
const TENANT_APP_URL =
  process.env.TENANT_APP_URL ?? "http://localhost:3100";

/** Shared secret for server-to-server calls to the Tenant App. */
const ADMIN_API_KEY = process.env.ADMIN_API_KEY ?? "";

interface ClaimListItem {
  reimbursementId: string;
  claimNumber?: string;
  tenantId: string;
  employeeId: string;
  employeeName: string;
  amount: number;
  description: string;
  clinicId?: string;
  clinicName?: string;
  receiptUrl?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface ClaimsResponse {
  success: boolean;
  claims?: ClaimListItem[];
  total?: number;
  error?: string;
}

export async function GET(request: NextRequest) {
  try {
    // ── Validate employee session ───────────────────────────────────────────
    const session = getSession();
    if (!session) {
      return NextResponse.json<ClaimsResponse>(
        { success: false, error: "Authentication required." },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") ?? "all";

    // ── Fetch claims from Tenant App ────────────────────────────────────────
    const params = new URLSearchParams({
      tenantId: session.tenantId,
      employeeCode: session.employeeCode,
    });
    if (status && status !== "all") {
      params.set("status", status);
    }

    let tenantRes: Response;
    try {
      tenantRes = await fetch(
        `${TENANT_APP_URL}/api/employee/reimbursements?${params.toString()}`,
        {
          method: "GET",
          headers: { "x-admin-api-key": ADMIN_API_KEY },
          signal: AbortSignal.timeout(10_000),
        },
      );
    } catch {
      return NextResponse.json<ClaimsResponse>(
        { success: false, error: "Unable to connect. Please try again." },
        { status: 503 },
      );
    }

    if (!tenantRes.ok) {
      let errorMsg = "Failed to fetch claims.";
      try {
        const body = await tenantRes.text();
        const parsed = JSON.parse(body);
        if (typeof parsed?.error === "string") {
          errorMsg = parsed.error;
        } else if (typeof parsed?.error?.message === "string") {
          errorMsg = parsed.error.message;
        }
      } catch {
        // keep default
      }
      return NextResponse.json<ClaimsResponse>(
        { success: false, error: errorMsg },
        { status: tenantRes.status },
      );
    }

    const data = await tenantRes.json();

    return NextResponse.json<ClaimsResponse>(
      {
        success: true,
        claims: data.reimbursements ?? [],
        total: data.total ?? 0,
      },
      { status: 200 },
    );
  } catch {
    return NextResponse.json<ClaimsResponse>(
      { success: false, error: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}
