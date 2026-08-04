import { NextRequest, NextResponse } from "next/server";
import type { ForgotPasswordResponse } from "@/types/employee-access";

/** URL of the Tenant App API (set via environment variable). */
const TENANT_APP_URL =
  process.env.TENANT_APP_URL ?? "http://localhost:3100";

/** Admin API key for server-to-server auth. */
const ADMIN_API_KEY = process.env.ADMIN_API_KEY ?? "";

/** Generic response returned regardless of outcome (enumeration-safe). */
const GENERIC_SUCCESS: ForgotPasswordResponse = {
  success: true,
  message: "If that email exists, a reset link has been sent.",
};

export async function POST(request: NextRequest) {
  // Session-less: anyone (logged out) can request a reset.

  // ── Validate input ────────────────────────────────────────────────────────

  const body = await request.json();
  const { tenantSlug, email } = body;

  if (!tenantSlug || typeof tenantSlug !== "string") {
    return NextResponse.json<ForgotPasswordResponse>(
      { success: false, error: "Organization is required.", errorCode: "INVALID_INPUT" },
      { status: 400 },
    );
  }

  if (!email || typeof email !== "string") {
    return NextResponse.json<ForgotPasswordResponse>(
      { success: false, error: "Email is required.", errorCode: "INVALID_INPUT" },
      { status: 400 },
    );
  }

  // ── Forward to Tenant App (authenticated with admin API key) ──────────────

  try {
    const tenantAppResponse = await fetch(
      `${TENANT_APP_URL}/api/employee/forgot-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-api-key": ADMIN_API_KEY,
        },
        body: JSON.stringify({ tenantSlug, email }),
        signal: AbortSignal.timeout(10_000),
      },
    );

    const tenantData = await tenantAppResponse.json();

    // Pass through the tenant app's generic response.
    return NextResponse.json<ForgotPasswordResponse>(
      {
        success: tenantData.success ?? true,
        message: tenantData.message ?? GENERIC_SUCCESS.message,
      },
      { status: tenantAppResponse.status },
    );
  } catch {
    // Even on connection failure, avoid leaking that the email exists.
    return NextResponse.json<ForgotPasswordResponse>(GENERIC_SUCCESS);
  }
}
