import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/employee-access/session";

const TENANT_APP_URL = process.env.TENANT_APP_URL ?? "http://localhost:3100";
const ADMIN_API_KEY = process.env.ADMIN_API_KEY ?? "";

export async function GET(request: NextRequest) {
  const session = getSession();
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Authentication required." },
      { status: 401 },
    );
  }

  try {
    const res = await fetch(
      `${TENANT_APP_URL}/api/employee/profile?employeeId=${encodeURIComponent(session.employeeId)}&tenantId=${encodeURIComponent(session.tenantId)}`,
      {
        method: "GET",
        headers: { "x-admin-api-key": ADMIN_API_KEY },
        signal: AbortSignal.timeout(10_000),
      },
    );
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { success: false, error: "Unable to connect." },
      { status: 503 },
    );
  }
}

export async function PUT(request: NextRequest) {
  const session = getSession();
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Authentication required." },
      { status: 401 },
    );
  }

  try {
    const body = await request.json();
    const payload = { employeeId: session.employeeId, ...body };

    const res = await fetch(`${TENANT_APP_URL}/api/employee/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-admin-api-key": ADMIN_API_KEY,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { success: false, error: "Unable to connect." },
      { status: 503 },
    );
  }
}
