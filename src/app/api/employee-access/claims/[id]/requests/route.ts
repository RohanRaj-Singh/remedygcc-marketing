import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/employee-access/session";

export const dynamic = "force-dynamic";

const TENANT_APP_URL =
  process.env.TENANT_APP_URL ?? "http://localhost:3100";

const ADMIN_API_KEY = process.env.ADMIN_API_KEY ?? "";

interface RequestsProxyResponse {
  success: boolean;
  requests?: unknown[];
  error?: string;
}

function sessionParams(session: { tenantId: string; employeeCode: string }) {
  return new URLSearchParams({
    tenantId: session.tenantId,
    employeeCode: session.employeeCode,
  });
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const session = getSession();
  if (!session) {
    return NextResponse.json<RequestsProxyResponse>(
      { success: false, error: "Authentication required." },
      { status: 401 },
    );
  }

  const { id } = await context.params;

  let tenantRes: Response;
  try {
    tenantRes = await fetch(
      `${TENANT_APP_URL}/api/reimbursements/${id}/requests?${sessionParams(session).toString()}`,
      {
        method: "GET",
        headers: { "x-admin-api-key": ADMIN_API_KEY },
        cache: "no-store",
        signal: AbortSignal.timeout(10_000),
      },
    );
  } catch {
    return NextResponse.json<RequestsProxyResponse>(
      { success: false, error: "Unable to connect. Please try again." },
      { status: 503 },
    );
  }

  const data = await tenantRes.json().catch(() => null);

  if (!tenantRes.ok) {
    return NextResponse.json<RequestsProxyResponse>(
      { success: false, error: data?.error ?? "Failed to load requests." },
      { status: tenantRes.status },
    );
  }

  return NextResponse.json<RequestsProxyResponse>(
    { success: true, requests: data?.requests ?? [] },
    { status: 200 },
  );
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const session = getSession();
  if (!session) {
    return NextResponse.json<RequestsProxyResponse>(
      { success: false, error: "Authentication required." },
      { status: 401 },
    );
  }

  const { id } = await context.params;
  const body = await request.json().catch(() => ({}));

  let tenantRes: Response;
  try {
    tenantRes = await fetch(
      `${TENANT_APP_URL}/api/reimbursements/${id}/requests?${sessionParams(session).toString()}`,
      {
        method: "POST",
        headers: { "x-admin-api-key": ADMIN_API_KEY, "Content-Type": "application/json" },
        body: JSON.stringify({ subject: body.subject, details: body.details }),
        signal: AbortSignal.timeout(10_000),
      },
    );
  } catch {
    return NextResponse.json<RequestsProxyResponse>(
      { success: false, error: "Unable to connect. Please try again." },
      { status: 503 },
    );
  }

  const data = await tenantRes.json().catch(() => null);

  if (!tenantRes.ok) {
    return NextResponse.json<RequestsProxyResponse>(
      { success: false, error: data?.error ?? "Failed to create request." },
      { status: tenantRes.status },
    );
  }

  return NextResponse.json<RequestsProxyResponse>({ success: true }, { status: 201 });
}
