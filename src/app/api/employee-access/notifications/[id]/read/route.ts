import { NextResponse } from "next/server";
import { getSession } from "@/lib/employee-access/session";

export const dynamic = "force-dynamic";

const TENANT_APP_URL =
  process.env.TENANT_APP_URL ?? "http://localhost:3100";

const ADMIN_API_KEY = process.env.ADMIN_API_KEY ?? "";

interface MarkReadResponse {
  success: boolean;
  notification?: unknown;
  error?: string;
}

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = getSession();
  if (!session) {
    return NextResponse.json<MarkReadResponse>(
      { success: false, error: "Authentication required." },
      { status: 401 },
    );
  }

  const { id } = await context.params;
  const params = new URLSearchParams({
    tenantId: session.tenantId,
    employeeCode: session.employeeCode,
  });

  let tenantRes: Response;
  try {
    tenantRes = await fetch(
      `${TENANT_APP_URL}/api/notifications/${id}/read?${params.toString()}`,
      {
        method: "POST",
        headers: { "x-admin-api-key": ADMIN_API_KEY },
        signal: AbortSignal.timeout(10_000),
      },
    );
  } catch {
    return NextResponse.json<MarkReadResponse>(
      { success: false, error: "Unable to connect. Please try again." },
      { status: 503 },
    );
  }

  const data = await tenantRes.json().catch(() => null);

  if (!tenantRes.ok) {
    return NextResponse.json<MarkReadResponse>(
      { success: false, error: data?.error ?? "Notification not found." },
      { status: tenantRes.status },
    );
  }

  return NextResponse.json<MarkReadResponse>(
    { success: true, notification: data },
    { status: 200 },
  );
}
