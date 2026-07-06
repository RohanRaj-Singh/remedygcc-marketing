import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const TENANT_APP_URL =
  process.env.TENANT_APP_URL ?? "http://localhost:3100";

export async function GET() {
  try {
    const res = await fetch(`${TENANT_APP_URL}/api/employee/tenants`, {
      cache: "no-store",
      signal: AbortSignal.timeout(5_000),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to load organisations." },
        { status: 502 },
      );
    }

    const data = await res.json();

    if (!Array.isArray(data)) {
      return NextResponse.json(
        { error: "Invalid response from server." },
        { status: 502 },
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Unable to connect. Please try again." },
      { status: 503 },
    );
  }
}
