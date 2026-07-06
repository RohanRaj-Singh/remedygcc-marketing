import { NextResponse } from "next/server";
import { getSession, isInactiveEmployeeError } from "@/lib/employee-access/session";

export const dynamic = "force-dynamic";

/** URL of the Tenant App API (set via environment variable). */
const TENANT_APP_URL =
  process.env.TENANT_APP_URL ?? "http://localhost:3100";

/** Shared secret for server-to-server calls to the Tenant App. */
const ADMIN_API_KEY = process.env.ADMIN_API_KEY ?? "";

interface ClaimHistoryEntry {
  status: string;
  actorRole: "employee" | "tenantAdmin";
  note?: string;
  timestamp: string;
}

interface ClaimResponse {
  success: boolean;
  claim?: {
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
    serviceDate?: string;
    status: string;
    history?: ClaimHistoryEntry[];
    createdAt: string;
    updatedAt: string;
  };
  error?: string;
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    // ── Validate employee session ───────────────────────────────────────────
    const session = getSession();
    if (!session) {
      return NextResponse.json<ClaimResponse>(
        { success: false, error: "Authentication required." },
        { status: 401 },
      );
    }

    const { id } = await context.params;

    // ── Fetch single claim from Tenant App with ownership verification ──────
    const params = new URLSearchParams({
      tenantId: session.tenantId,
      employeeCode: session.employeeCode,
    });

    let tenantRes: Response;
    try {
      tenantRes = await fetch(
        `${TENANT_APP_URL}/api/employee/reimbursements/${id}?${params.toString()}`,
        {
          method: "GET",
          headers: { "x-admin-api-key": ADMIN_API_KEY },
          cache: "no-store",
          signal: AbortSignal.timeout(10_000),
        },
      );
    } catch {
      return NextResponse.json<ClaimResponse>(
        { success: false, error: "Unable to connect. Please try again." },
        { status: 503 },
      );
    }

    if (!tenantRes.ok) {
      let errorBody: Record<string, unknown> | null = null;
      let errorMsg = "Failed to fetch claim.";
      try {
        const body = await tenantRes.text();
        const parsed = JSON.parse(body);
        errorBody = parsed;
        if (typeof parsed?.error === "string") {
          errorMsg = parsed.error;
        } else if (typeof parsed?.error?.message === "string") {
          errorMsg = parsed.error.message;
        }
      } catch {
        // Response body was not JSON (e.g. an HTML error page) — keep default
      }

      // If employee has been deactivated, clear the session immediately
      if (isInactiveEmployeeError(tenantRes.status, errorBody)) {
        const response = NextResponse.json<ClaimResponse>(
          { success: false, error: "Session expired. Please log in again." },
          { status: 401 },
        );
        response.cookies.set("employee_session", "", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 0,
        });
        return response;
      }

      return NextResponse.json<ClaimResponse>(
        { success: false, error: errorMsg },
        { status: tenantRes.status },
      );
    }

    const claim = await tenantRes.json();

    return NextResponse.json<ClaimResponse>(
      { success: true, claim },
      { status: 200 },
    );
  } catch {
    return NextResponse.json<ClaimResponse>(
      { success: false, error: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}
