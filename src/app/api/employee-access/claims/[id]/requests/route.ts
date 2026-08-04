import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/employee-access/session";

export const dynamic = "force-dynamic";

const TENANT_APP_URL =
  process.env.TENANT_APP_URL ?? "http://localhost:3100";

const ADMIN_API_KEY = process.env.ADMIN_API_KEY ?? "";

interface RequestProxyResponse {
  success: boolean;
  requests?: unknown[];
  request?: unknown;
  error?: string;
}

/**
 * The tenantapp can return errors in two shapes:
 *  - `{ error: "plain message" }` from route-level validation
 *  - `{ error: { code, message, details } }` from apiErrorResponse
 * Normalize both to a plain string so the UI never renders "[object Object]".
 */
function extractErrorMessage(data: Record<string, unknown> | null, fallback: string): string {
  if (!data) return fallback;
  const err = data.error;
  if (typeof err === "string" && err.trim()) return err;
  if (err && typeof err === "object") {
    const msg = (err as { message?: unknown }).message;
    if (typeof msg === "string" && msg.trim()) return msg;
  }
  return fallback;
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
    return NextResponse.json<RequestProxyResponse>(
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
    return NextResponse.json<RequestProxyResponse>(
      { success: false, error: "Unable to connect. Please try again." },
      { status: 503 },
    );
  }

  const data = await tenantRes.json().catch(() => null);

  if (!tenantRes.ok) {
    return NextResponse.json<RequestProxyResponse>(
      { success: false, error: extractErrorMessage(data, "Failed to load requests.") },
      { status: tenantRes.status },
    );
  }

  return NextResponse.json<RequestProxyResponse>(
    {
      success: true,
      requests: data?.requests ?? [],
    },
    { status: 200 },
  );
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const session = getSession();
  if (!session) {
    return NextResponse.json<RequestProxyResponse>(
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
        body: JSON.stringify({
          subject: body.subject,
          body: body.body,
        }),
        signal: AbortSignal.timeout(10_000),
      },
    );
  } catch {
    return NextResponse.json<RequestProxyResponse>(
      { success: false, error: "Unable to connect. Please try again." },
      { status: 503 },
    );
  }

  const data = await tenantRes.json().catch(() => null);

  if (!tenantRes.ok) {
    return NextResponse.json<RequestProxyResponse>(
      { success: false, error: extractErrorMessage(data, "Failed to send request.") },
      { status: tenantRes.status },
    );
  }

  return NextResponse.json<RequestProxyResponse>(
    { success: true, request: data?.request },
    { status: 201 },
  );
}