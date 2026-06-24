import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/employee-access/session";

const TENANT_APP_URL =
  process.env.TENANT_APP_URL ?? "http://localhost:3100";
const ADMIN_API_KEY = process.env.ADMIN_API_KEY ?? "";

export const runtime = "nodejs";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ reimbursementId: string }> },
) {
  // ── Validate employee session ───────────────────────────────────────
  const session = getSession();
  if (!session) {
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401 },
    );
  }

  try {
    const { reimbursementId } = await context.params;

    // ── Proxy to tenantapp authenticated receipt endpoint ─────────────
    const params = new URLSearchParams({
      tenantId: session.tenantId,
      employeeCode: session.employeeCode,
    });

    const tenantRes = await fetch(
      `${TENANT_APP_URL}/api/employee/receipts/${reimbursementId}?${params.toString()}`,
      {
        method: "GET",
        headers: { "x-admin-api-key": ADMIN_API_KEY },
        signal: AbortSignal.timeout(30_000),
      },
    );

    if (!tenantRes.ok) {
      const errorBody = await tenantRes.json().catch(() => null);
      return NextResponse.json(
        { error: errorBody?.error ?? "Failed to retrieve receipt." },
        { status: tenantRes.status },
      );
    }

    // Stream the file response back
    const contentType = tenantRes.headers.get("content-type") ?? "application/octet-stream";
    const contentLength = tenantRes.headers.get("content-length");
    const contentDisposition = tenantRes.headers.get("content-disposition") ?? "inline";

    const headers: Record<string, string> = {
      "Content-Type": contentType,
      "Content-Disposition": contentDisposition,
    };
    if (contentLength) {
      headers["Content-Length"] = contentLength;
    }

    return new NextResponse(tenantRes.body, {
      status: 200,
      headers,
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to retrieve receipt. Please try again." },
      { status: 503 },
    );
  }
}
