import { NextResponse } from "next/server";
import { getSession, SESSION_COOKIE_OPTIONS } from "@/lib/employee-access/session";
import type { SessionResponse } from "@/types/employee-access";

const TENANT_APP_URL = process.env.TENANT_APP_URL ?? "http://localhost:3100";
const ADMIN_API_KEY = process.env.ADMIN_API_KEY ?? "";

export async function GET() {
  const session = getSession();

  if (!session) {
    return NextResponse.json<SessionResponse>({ authenticated: false });
  }

  // Verify employee is still active with the tenant app
  try {
    const res = await fetch(
      `${TENANT_APP_URL}/api/employee/me?tenantSlug=${session.tenantId}&employeeCode=${session.employeeCode}`,
      {
        headers: { "x-admin-api-key": ADMIN_API_KEY },
        signal: AbortSignal.timeout(5000),
      },
    );

    if (res.status === 403) {
      // Employee is suspended or inactive — clear session
      const response = NextResponse.json<SessionResponse>({
        authenticated: false,
      });
      response.cookies.set("employee_session", "", {
        ...SESSION_COOKIE_OPTIONS,
        maxAge: 0,
      });
      return response;
    }

    if (!res.ok) {
      // Other error — still allow session but log
      console.warn("[session] Tenant app check failed:", res.status);
    }
  } catch {
    // Tenant app unreachable — allow session to continue
    console.warn("[session] Tenant app unreachable, allowing cached session.");
  }

  return NextResponse.json<SessionResponse>({
    authenticated: true,
    session,
  });
}
