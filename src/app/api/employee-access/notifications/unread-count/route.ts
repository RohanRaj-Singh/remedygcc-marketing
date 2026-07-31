import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/employee-access/session";

export const dynamic = "force-dynamic";

const TENANT_APP_URL =
  process.env.TENANT_APP_URL ?? "http://localhost:3100";

const ADMIN_API_KEY = process.env.ADMIN_API_KEY ?? "";

interface UnreadCountResponse {
  success: boolean;
  count?: number;
  error?: string;
}

export async function GET() {
  const session = getSession();
  if (!session) {
    return NextResponse.json<UnreadCountResponse>(
      { success: false, error: "Authentication required." },
      { status: 401 },
    );
  }

  const params = new URLSearchParams({
    tenantId: session.tenantId,
    employeeCode: session.employeeCode,
  });

  let tenantRes: Response;
  try {
    tenantRes = await fetch(
      `${TENANT_APP_URL}/api/notifications/unread-count?${params.toString()}`,
      {
        method: "GET",
        headers: { "x-admin-api-key": ADMIN_API_KEY },
        cache: "no-store",
        signal: AbortSignal.timeout(10_000),
      },
    );
  } catch {
    return NextResponse.json<UnreadCountResponse>(
      { success: false, error: "Unable to connect. Please try again." },
      { status: 503 },
    );
  }

  const data = await tenantRes.json().catch(() => null);

  if (!tenantRes.ok) {
    return NextResponse.json<UnreadCountResponse>(
      { success: false, error: data?.error ?? "Failed to load notifications." },
      { status: tenantRes.status },
    );
  }

  return NextResponse.json<UnreadCountResponse>(
    { success: true, count: data?.count ?? 0 },
    { status: 200 },
  );
}
