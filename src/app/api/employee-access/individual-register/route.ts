import { NextRequest, NextResponse } from "next/server";
import {
  createSession,
  SESSION_COOKIE_OPTIONS,
} from "@/lib/employee-access/session";
import type {
  IndividualRegisterRequest,
  IndividualRegisterResponse,
} from "@/types/employee-access";

/** URL of the Tenant App API (set via environment variable). */
const TENANT_APP_URL =
  process.env.TENANT_APP_URL ?? "http://localhost:3100";

/**
 * Display name for the reserved individual pool. The sentinel tenant is hidden
 * from the org picker, so we cannot resolve its name via getTenantBySlug — it
 * is hardcoded here for the session payload.
 */
const INDIVIDUAL_TENANT_NAME = "Individual Members";

/**
 * Public self-service registration for an individual — no organisation, no
 * employee code (FR-079, FR-082). Mirrors the org `register` proxy but omits
 * tenantSlug/employeeCode and forwards to the individual register endpoint.
 */
export async function POST(request: NextRequest) {
  const body: IndividualRegisterRequest = await request.json();
  const { email, password, name, phoneNumber, bankAccountNumber, bankName } = body;

  // ── Validate input ────────────────────────────────────────────────────────

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json<IndividualRegisterResponse>(
      { success: false, error: "Please enter a valid email address.", errorCode: "VALIDATION_ERROR" },
      { status: 400 },
    );
  }

  if (!name || typeof name !== "string" || !name.trim()) {
    return NextResponse.json<IndividualRegisterResponse>(
      { success: false, error: "Full name is required.", errorCode: "NAME_REQUIRED" },
      { status: 400 },
    );
  }

  if (name.length > 100) {
    return NextResponse.json<IndividualRegisterResponse>(
      { success: false, error: "Name must be 100 characters or fewer.", errorCode: "VALIDATION_ERROR" },
      { status: 400 },
    );
  }

  if (!password || typeof password !== "string") {
    return NextResponse.json<IndividualRegisterResponse>(
      { success: false, error: "Password is required.", errorCode: "WEAK_PASSWORD" },
      { status: 400 },
    );
  }

  // Client-side password strength validation (mirrors the server rules).
  if (
    password.length < 8 ||
    !/[A-Z]/.test(password) ||
    !/[a-z]/.test(password) ||
    !/[0-9]/.test(password)
  ) {
    return NextResponse.json<IndividualRegisterResponse>(
      {
        success: false,
        error: "Password must be at least 8 characters with uppercase, lowercase, and a digit.",
        errorCode: "WEAK_PASSWORD",
      },
      { status: 400 },
    );
  }

  // ── Call Tenant App to register the individual ────────────────────────────

  let tenantAppResponse: Response;
  try {
    tenantAppResponse = await fetch(
      `${TENANT_APP_URL}/api/employee/individual/register`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
          name: name.trim(),
          ...(phoneNumber ? { phoneNumber: phoneNumber.trim() } : {}),
          ...(bankAccountNumber ? { bankAccountNumber: bankAccountNumber.trim() } : {}),
          ...(bankName ? { bankName: bankName.trim() } : {}),
        }),
        signal: AbortSignal.timeout(10_000),
      },
    );
  } catch {
    return NextResponse.json<IndividualRegisterResponse>(
      { success: false, error: "Unable to connect. Please try again.", errorCode: "CONNECTION_ERROR" },
      { status: 503 },
    );
  }

  const tenantData = await tenantAppResponse.json();

  if (!tenantData.success || !tenantData.employee) {
    const errorCode: string = tenantData.errorCode ?? "REGISTRATION_FAILED";
    let status = tenantAppResponse.status;

    // Map error codes
    if (errorCode === "ALREADY_REGISTERED") status = 409;
    else if (errorCode === "WEAK_PASSWORD") status = 400;
    else if (errorCode === "VALIDATION_ERROR" || errorCode === "NAME_REQUIRED") status = 400;

    return NextResponse.json<IndividualRegisterResponse>(
      {
        success: false,
        error: tenantData.error ?? "Registration failed. Please try again.",
        errorCode,
      },
      { status },
    );
  }

  // ── Success — create session and return ──────────────────────────────────

  const sessionCookie = createSession({
    employeeId: tenantData.employee.employeeId,
    employeeCode: tenantData.employee.employeeCode,
    employeeName: tenantData.employee.name,
    tenantId: tenantData.employee.tenantId,
    tenantName: INDIVIDUAL_TENANT_NAME,
  });

  const response = NextResponse.json<IndividualRegisterResponse>({
    success: true,
    employee: tenantData.employee,
  });

  response.cookies.set("employee_session", sessionCookie, SESSION_COOKIE_OPTIONS);

  return response;
}
