import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/employee-access/session";
import type { ChangePasswordResponse } from "@/types/employee-access";

/** URL of the Tenant App API (set via environment variable). */
const TENANT_APP_URL =
  process.env.TENANT_APP_URL ?? "http://localhost:3100";

/** Admin API key for server-to-server auth. */
const ADMIN_API_KEY = process.env.ADMIN_API_KEY ?? "";

export async function POST(request: NextRequest) {
  // ── Validate session (employee must be logged in) ─────────────────────────

  const session = getSession();
  if (!session) {
    return NextResponse.json<ChangePasswordResponse>(
      { success: false, error: "Session expired. Please log in again.", errorCode: "NOT_AUTHENTICATED" },
      { status: 401 },
    );
  }

  // ── Validate input ────────────────────────────────────────────────────────

  const body = await request.json();
  const { currentPassword, newPassword } = body;

  if (!currentPassword || typeof currentPassword !== "string") {
    return NextResponse.json<ChangePasswordResponse>(
      { success: false, error: "Current password is required.", errorCode: "INVALID_PASSWORD" },
      { status: 400 },
    );
  }

  if (!newPassword || typeof newPassword !== "string") {
    return NextResponse.json<ChangePasswordResponse>(
      { success: false, error: "New password is required.", errorCode: "WEAK_PASSWORD" },
      { status: 400 },
    );
  }

  // Client-side password strength validation
  if (
    newPassword.length < 8 ||
    !/[A-Z]/.test(newPassword) ||
    !/[a-z]/.test(newPassword) ||
    !/[0-9]/.test(newPassword)
  ) {
    return NextResponse.json<ChangePasswordResponse>(
      {
        success: false,
        error: "Password must be at least 8 characters with uppercase, lowercase, and a digit.",
        errorCode: "WEAK_PASSWORD",
      },
      { status: 400 },
    );
  }

  // ── Call Tenant App to change password (authenticated with admin API key) ─

  let tenantAppResponse: Response;
  try {
    tenantAppResponse = await fetch(
      `${TENANT_APP_URL}/api/employee/change-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-api-key": ADMIN_API_KEY,
        },
        body: JSON.stringify({
          employeeId: session.employeeId,
          currentPassword,
          newPassword,
        }),
        signal: AbortSignal.timeout(10_000),
      },
    );
  } catch {
    return NextResponse.json<ChangePasswordResponse>(
      { success: false, error: "Unable to connect. Please try again.", errorCode: "INVALID_CREDENTIALS" },
      { status: 503 },
    );
  }

  const tenantData = await tenantAppResponse.json();

  if (!tenantData.success) {
    const errorCode: string = tenantData.errorCode ?? "INVALID_CREDENTIALS";
    let status = tenantAppResponse.status;

    if (errorCode === "INVALID_PASSWORD") status = 401;
    else if (errorCode === "WEAK_PASSWORD") status = 400;

    return NextResponse.json<ChangePasswordResponse>(
      {
        success: false,
        error: tenantData.error ?? "Failed to update password.",
        errorCode,
      },
      { status },
    );
  }

  // ── Success ───────────────────────────────────────────────────────────────

  return NextResponse.json<ChangePasswordResponse>({
    success: true,
  });
}
