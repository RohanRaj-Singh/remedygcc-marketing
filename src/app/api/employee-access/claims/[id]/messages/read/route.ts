import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/employee-access/session";

export const dynamic = "force-dynamic";

const TENANT_APP_URL =
  process.env.TENANT_APP_URL ?? "http://localhost:3100";

const ADMIN_API_KEY = process.env.ADMIN_API_KEY ?? "";

interface MarkReadProxyResponse {
  success: boolean;
  count?: number;
  error?: string;
}

export async function POST(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const session = getSession();
  if (!session) {
    return NextResponse.json<MarkReadProxyResponse>(
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
      `${TENANT_APP_URL}/api/reimbursements/${id}/messages/read?${params.toString()}`,
      {
        method: "POST",
        headers: { "x-admin-api-key": ADMIN_API_KEY },
        signal: AbortSignal.timeout(10_000),
      },
    );
  } catch {
    return NextResponse.json<MarkReadProxyResponse>(
      { success: false, error: "Unable to connect. Please try again." },
      { status: 503 },
    );
  }

  const data = await tenantRes.json().catch(() => null);

  if (!tenantRes.ok) {
    return NextResponse.json<MarkReadProxyResponse>(
      { success: false, error: data?.error ?? "Failed to update messages." },
      { status: tenantRes.status },
    );
  }

  return NextResponse.json<MarkReadProxyResponse>(
    { success: true, count: data?.count ?? 0 },
    { status: 200 },
  );
}
