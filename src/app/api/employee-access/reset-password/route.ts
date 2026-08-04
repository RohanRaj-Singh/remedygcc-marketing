import { NextRequest, NextResponse } from "next/server";
import type { ResetPasswordResponse } from "@/types/employee-access";

/** URL of the Tenant App API (set via environment variable). */
const TENANT_APP_URL =
  process.env.TENANT_APP_URL ?? "http://localhost:3100";

/** Admin API key for server-to-server auth. */
const ADMIN_API_KEY = process.env.ADMIN_API_KEY ?? "";

export async function POST(request: NextRequest) {
  // Session-less: the reset token is the credential.

  // ── Validate input ────────────────────────────────────────────────────────

  const body = await request.json();
  const { token, password } = body;

  if (!token || typeof token !== "string") {
    return NextResponse.json<ResetPasswordResponse>(
      { success: false, error: "This reset link is invalid or has expired.", errorCode: "INVALID_TOKEN" },
      { status: 400 },
    );
  }

  if (!password || typeof password !== "string") {
    return NextResponse.json<ResetPasswordResponse>(
      { success: false, error: "Password is required.", errorCode: "INVALID_INPUT" },
      { status: 400 },
    );
  }

  // Client-side password strength validation
  if (
    password.length < 8 ||
    !/[A-Z]/.test(password) ||
    !/[a-z]/.test(password) ||
    !/[0-9]/.test(password)
  ) {
    return NextResponse.json<ResetPasswordResponse>(
      {
        success: false,
        error: "Password must be at least 8 characters with uppercase, lowercase, and a digit.",
        errorCode: "WEAK_PASSWORD",
      },
      { status: 400 },
    );
  }

  // ── Call Tenant App to reset password (authenticated with admin API key) ──

  let tenantAppResponse: Response;
  try {
    tenantAppResponse = await fetch(
      `${TENANT_APP_URL}/api/employee/reset-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-api-key": ADMIN_API_KEY,
        },
        body: JSON.stringify({ token, password }),
        signal: AbortSignal.timeout(10_000),
      },
    );
  } catch {
    return NextResponse.json<ResetPasswordResponse>(
      { success: false, error: "Unable to connect. Please try again.", errorCode: "SERVICE_UNAVAILABLE" },
      { status: 503 },
    );
  }

  const tenantData = await tenantAppResponse.json();

  if (!tenantData.success) {
    const errorCode: string = tenantData.errorCode ?? "INVALID_TOKEN";
    let status = tenantAppResponse.status;

    if (errorCode === "INVALID_TOKEN") status = 400;
    else if (errorCode === "WEAK_PASSWORD") status = 400;

    return NextResponse.json<ResetPasswordResponse>(
      {
        success: false,
        error: tenantData.error ?? "Unable to reset your password.",
        errorCode,
      },
      { status },
    );
  }

  // ── Success ───────────────────────────────────────────────────────────────

  return NextResponse.json<ResetPasswordResponse>({
    success: true,
  });
}
