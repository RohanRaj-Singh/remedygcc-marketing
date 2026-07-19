import { NextRequest, NextResponse } from "next/server";
import { getTenantBySlug } from "@/data/tenants";
import {
  createSession,
  SESSION_COOKIE_OPTIONS,
} from "@/lib/employee-access/session";
import type { RegisterRequest, RegisterResponse } from "@/types/employee-access";

/** URL of the Tenant App API (set via environment variable). */
const TENANT_APP_URL =
  process.env.TENANT_APP_URL ?? "http://localhost:3100";

export async function POST(request: NextRequest) {
  const body: RegisterRequest = await request.json();
  const { tenantSlug, employeeCode, email, password, name, phone } = body;

  // ── Validate input ────────────────────────────────────────────────────────

  if (!tenantSlug || typeof tenantSlug !== "string") {
    return NextResponse.json<RegisterResponse>(
      { success: false, error: "Please select your organization.", errorCode: "TENANT_NOT_FOUND" },
      { status: 400 },
    );
  }

  if (!employeeCode || typeof employeeCode !== "string" || !employeeCode.trim()) {
    return NextResponse.json<RegisterResponse>(
      { success: false, error: "Employee code is required.", errorCode: "EMPLOYEE_NOT_FOUND" },
      { status: 400 },
    );
  }

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json<RegisterResponse>(
      { success: false, error: "Please enter a valid email address.", errorCode: "EMAIL_MISMATCH" },
      { status: 400 },
    );
  }

  if (!name || typeof name !== "string" || !name.trim()) {
    return NextResponse.json<RegisterResponse>(
      { success: false, error: "Full name is required.", errorCode: "NAME_REQUIRED" },
      { status: 400 },
    );
  }

  if (name.length > 100) {
    return NextResponse.json<RegisterResponse>(
      { success: false, error: "Name must be 100 characters or fewer.", errorCode: "NAME_REQUIRED" },
      { status: 400 },
    );
  }

  if (!password || typeof password !== "string") {
    return NextResponse.json<RegisterResponse>(
      { success: false, error: "Password is required.", errorCode: "WEAK_PASSWORD" },
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
    return NextResponse.json<RegisterResponse>(
      {
        success: false,
        error: "Password must be at least 8 characters with uppercase, lowercase, and a digit.",
        errorCode: "WEAK_PASSWORD",
      },
      { status: 400 },
    );
  }

  // ── Call Tenant App to register ──────────────────────────────────────────

  let tenantAppResponse: Response;
  try {
    tenantAppResponse = await fetch(
      `${TENANT_APP_URL}/api/employee/register`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenantSlug,
          employeeCode: employeeCode.trim(),
          email: email.trim(),
          password,
          name: name.trim(),
          ...(phone ? { phone: phone.trim() } : {}),
        }),
        signal: AbortSignal.timeout(10_000),
      },
    );
  } catch {
    return NextResponse.json<RegisterResponse>(
      { success: false, error: "Unable to connect. Please try again.", errorCode: "INVALID_CREDENTIALS" },
      { status: 503 },
    );
  }

  const tenantData = await tenantAppResponse.json();

  if (!tenantData.success || !tenantData.employee) {
    const errorCode: string = tenantData.errorCode ?? "INVALID_CREDENTIALS";
    let status = tenantAppResponse.status;

    // Map error codes
    if (errorCode === "ALREADY_REGISTERED") status = 409;
    else if (errorCode === "EMAIL_MISMATCH") status = 400;
    else if (errorCode === "EMPLOYEE_NOT_FOUND") status = 404;
    else if (errorCode === "WEAK_PASSWORD") status = 400;
    else if (errorCode === "ACCOUNT_NOT_AVAILABLE") status = 403;

    return NextResponse.json<RegisterResponse>(
      {
        success: false,
        error: tenantData.error ?? "Registration failed. Please try again.",
        errorCode,
      },
      { status },
    );
  }

  // ── Success — create session and return ──────────────────────────────────

  const tenant = await getTenantBySlug(tenantSlug);
  const tenantName = tenant?.name ?? tenantSlug;

  const sessionCookie = createSession({
    employeeId: tenantData.employee.employeeId,
    employeeCode: tenantData.employee.employeeCode,
    employeeName: tenantData.employee.name,
    tenantId: tenantData.employee.tenantId,
    tenantName,
  });

  const response = NextResponse.json<RegisterResponse>({
    success: true,
    employee: tenantData.employee,
  });

  response.cookies.set("employee_session", sessionCookie, SESSION_COOKIE_OPTIONS);

  return response;
}
