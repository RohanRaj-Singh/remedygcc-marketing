import { NextResponse } from "next/server";
import { getSession } from "@/lib/employee-access/session";
import type { SessionResponse } from "@/types/employee-access";

export async function GET() {
  const session = getSession();

  if (!session) {
    return NextResponse.json<SessionResponse>({
      authenticated: false,
    });
  }

  return NextResponse.json<SessionResponse>({
    authenticated: true,
    session,
  });
}
