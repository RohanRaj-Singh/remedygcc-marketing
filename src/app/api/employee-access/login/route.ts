import { NextRequest, NextResponse } from "next/server";
import { getTenantBySlug } from "@/data/tenants";
import {
  createSession,
  SESSION_COOKIE_OPTIONS,
} from "@/lib/employee-access/session";
import type { LoginRequest, LoginResponse } from "@/types/employee-access";

/** URL of the Tenant App API (set via environment variable). */
const TENANT_APP_URL =
  process.env.TENANT_APP_URL ?? "http://localhost:3100";

export async function POST(request: NextRequest) {
  const body: LoginRequest = await request.json();
  const { tenantSlug, employeeCode, pin } = body;

  // ── Validate input ────────────────────────────────────────────────────────

  if (!tenantSlug || typeof tenantSlug !== "string") {
    return NextResponse.json<LoginResponse>(
      { success: false, error: "Corporate selection is required.", errorCode: "TENANT_NOT_FOUND" },
      { status: 400 },
    );
  }

  if (!employeeCode || typeof employeeCode !== "string") {
    return NextResponse.json<LoginResponse>(
      { success: false, error: "Employee ID is required.", errorCode: "INVALID_CREDENTIALS" },
      { status: 400 },
    );
  }

  if (!pin || typeof pin !== "string") {
    return NextResponse.json<LoginResponse>(
      { success: false, error: "PIN is required.", errorCode: "INVALID_CREDENTIALS" },
      { status: 400 },
    );
  }

  // ── Resolve tenant (local list for name/display) ─────────────────────────

  const tenant = await getTenantBySlug(tenantSlug);
  if (!tenant) {
    return NextResponse.json<LoginResponse>(
      { success: false, error: "Invalid corporate selection.", errorCode: "TENANT_NOT_FOUND" },
      { status: 401 },
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
        body: JSON.stringify({ tenantSlug, employeeCode, pin }),
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
    // Map Tenant App error codes back to Marketing Site LoginResponse format
    const status = tenantAppResponse.status;

    return NextResponse.json<LoginResponse>(
      {
        success: false,
        error: tenantData.error ?? "Invalid employee ID or PIN.",
        errorCode: tenantData.errorCode === "EMPLOYEE_LOCKED"
          ? "EMPLOYEE_LOCKED"
          : tenantData.errorCode === "EMPLOYEE_INACTIVE"
            ? "EMPLOYEE_INACTIVE"
            : "INVALID_CREDENTIALS",
        lockedUntil: tenantData.lockedUntil ?? undefined,
      },
      { status },
    );
  }

  // ── Success — create session ─────────────────────────────────────────────

  const sessionCookie = createSession({
    employeeCode: tenantData.employee.employeeCode,
    employeeName: tenantData.employee.name,
    tenantId: tenantData.employee.tenantId,
    tenantName: tenant.name,
  });

  const response = NextResponse.json<LoginResponse>({
    success: true,
  });

  response.cookies.set("employee_session", sessionCookie, SESSION_COOKIE_OPTIONS);

  return response;
}
