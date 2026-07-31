import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/employee-access/session";

export const dynamic = "force-dynamic";

/** URL of the Tenant App API (set via environment variable). */
const TENANT_APP_URL =
  process.env.TENANT_APP_URL ?? "http://localhost:3100";

/** Shared secret for server-to-server calls to the Tenant App. */
const ADMIN_API_KEY = process.env.ADMIN_API_KEY ?? "";

interface NotificationsResponse {
  success: boolean;
  notifications?: unknown[];
  unreadCount?: number;
  error?: string;
}

export async function GET(request: NextRequest) {
  const session = getSession();
  if (!session) {
    return NextResponse.json<NotificationsResponse>(
      { success: false, error: "Authentication required." },
      { status: 401 },
    );
  }

  const { searchParams } = new URL(request.url);
  const params = new URLSearchParams({
    tenantId: session.tenantId,
    employeeCode: session.employeeCode,
  });
  const limit = searchParams.get("limit");
  const unreadOnly = searchParams.get("unreadOnly");
  if (limit) params.set("limit", limit);
  if (unreadOnly) params.set("unreadOnly", unreadOnly);

  let tenantRes: Response;
  try {
    tenantRes = await fetch(
      `${TENANT_APP_URL}/api/notifications?${params.toString()}`,
      {
        method: "GET",
        headers: { "x-admin-api-key": ADMIN_API_KEY },
        cache: "no-store",
        signal: AbortSignal.timeout(10_000),
      },
    );
  } catch {
    return NextResponse.json<NotificationsResponse>(
      { success: false, error: "Unable to connect. Please try again." },
      { status: 503 },
    );
  }

  const data = await tenantRes.json().catch(() => null);

  if (!tenantRes.ok) {
    return NextResponse.json<NotificationsResponse>(
      { success: false, error: data?.error ?? "Failed to load notifications." },
      { status: tenantRes.status },
    );
  }

  return NextResponse.json<NotificationsResponse>(
    {
      success: true,
      notifications: data?.notifications ?? [],
      unreadCount: data?.unreadCount ?? 0,
    },
    { status: 200 },
  );
}
