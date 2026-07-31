import { NextResponse } from "next/server";
import { getSession } from "@/lib/employee-access/session";

export const dynamic = "force-dynamic";

const TENANT_APP_URL =
  process.env.TENANT_APP_URL ?? "http://localhost:3100";

const ADMIN_API_KEY = process.env.ADMIN_API_KEY ?? "";

interface ReadAllResponse {
  success: boolean;
  count?: number;
  error?: string;
}

export async function POST() {
  const session = getSession();
  if (!session) {
    return NextResponse.json<ReadAllResponse>(
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
      `${TENANT_APP_URL}/api/notifications/read-all?${params.toString()}`,
      {
        method: "POST",
        headers: { "x-admin-api-key": ADMIN_API_KEY },
        signal: AbortSignal.timeout(10_000),
      },
    );
  } catch {
    return NextResponse.json<ReadAllResponse>(
      { success: false, error: "Unable to connect. Please try again." },
      { status: 503 },
    );
  }

  const data = await tenantRes.json().catch(() => null);

  if (!tenantRes.ok) {
    return NextResponse.json<ReadAllResponse>(
      { success: false, error: data?.error ?? "Failed to update notifications." },
      { status: tenantRes.status },
    );
  }

  return NextResponse.json<ReadAllResponse>(
    { success: true, count: data?.count ?? 0 },
    { status: 200 },
  );
}
