import { NextRequest, NextResponse } from "next/server";
import { getTenantBySlug } from "@/data/tenants";
import {
  createSession,
  SESSION_COOKIE_OPTIONS,
} from "@/lib/employee-access/session";
import type { LoginResponse } from "@/types/employee-access";

/** URL of the Tenant App API (set via environment variable). */
const TENANT_APP_URL =
  process.env.TENANT_APP_URL ?? "http://localhost:3100";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { tenantSlug, email, password } = body;

  // ── Validate input ────────────────────────────────────────────────────────

  if (!tenantSlug || typeof tenantSlug !== "string") {
    return NextResponse.json<LoginResponse>(
      { success: false, error: "Please select your organization.", errorCode: "TENANT_NOT_FOUND" },
      { status: 400 },
    );
  }

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json<LoginResponse>(
      { success: false, error: "Email is required.", errorCode: "INVALID_CREDENTIALS" },
      { status: 400 },
    );
  }

  if (!password || typeof password !== "string") {
    return NextResponse.json<LoginResponse>(
      { success: false, error: "Password is required.", errorCode: "INVALID_PASSWORD" },
      { status: 400 },
    );
  }

  // ── Call Tenant App to authenticate ───────────────────────────────────────

  let tenantAppResponse: Response;
  try {
    tenantAppResponse = await fetch(
      `${TENANT_APP_URL}/api/employee/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenantSlug, email, password }),
        // Short timeout so the UI doesn't hang
        signal: AbortSignal.timeout(10_000),
      },
    );
  } catch {
    return NextResponse.json<LoginResponse>(
      { success: false, error: "Unable to connect. Please try again.", errorCode: "INVALID_CREDENTIALS" },
      { status: 503 },
    );
  }

  const tenantData = await tenantAppResponse.json();

  if (!tenantData.success || !tenantData.employee) {
    const errorCode: string = tenantData.errorCode ?? "INVALID_CREDENTIALS";
    let status = tenantAppResponse.status;

    // Map error codes to proper HTTP statuses for the UI
    if (errorCode === "NOT_REGISTERED") status = 403;
    else if (errorCode === "INVALID_PASSWORD") status = 401;
    else if (errorCode === "EMPLOYEE_LOCKED") status = 429;
    else if (errorCode === "EMPLOYEE_INACTIVE") status = 403;
    else if (errorCode === "EMPLOYEE_SUSPENDED") status = 403;
    else if (errorCode === "TENANT_NOT_FOUND") status = 401;

    return NextResponse.json<LoginResponse>(
      {
        success: false,
        error: tenantData.error ?? "Invalid email or password.",
        errorCode,
      },
      { status },
    );
  }

  // ── Success — create session ─────────────────────────────────────────────

  // Resolve tenant name for session display
  const tenant = await getTenantBySlug(tenantSlug);
  const tenantName = tenant?.name ?? tenantSlug;

  const sessionCookie = createSession({
    employeeId: tenantData.employee.employeeId,
    employeeCode: tenantData.employee.employeeCode,
    employeeName: tenantData.employee.name,
    tenantId: tenantData.employee.tenantId,
    tenantName,
  });

  const response = NextResponse.json<LoginResponse>({
    success: true,
    employee: tenantData.employee,
    mustChangePassword: tenantData.mustChangePassword ?? false,
  });

  response.cookies.set("employee_session", sessionCookie, SESSION_COOKIE_OPTIONS);

  return response;
}
