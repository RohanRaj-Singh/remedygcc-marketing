import { NextResponse } from "next/server";

/**
 * Proxies clinic directory data from the Tenant App.
 * The marketing site browser cannot reach the tenant app directly,
 * so this route acts as the bridge.
 */
const TENANT_APP_URL = process.env.TENANT_APP_URL ?? "http://localhost:3100";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const res = await fetch(`${TENANT_APP_URL}/api/clinics`, {
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to load clinics." },
        { status: 502 },
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Unable to connect. Please try again." },
      { status: 503 },
    );
  }
}
