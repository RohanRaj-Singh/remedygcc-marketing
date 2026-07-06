import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import type { EmployeeSession } from "@/types/employee-access";

/** Cookie name for the employee session. */
const SESSION_COOKIE = "employee_session";

/**
 * Derive the signing key.
 * In production, EMPLOYEE_SESSION_SECRET must be set to a long random value.
 * The app will refuse to start if it's missing or still the dev default.
 */
function signingKey(): string {
  const secret = process.env.EMPLOYEE_SESSION_SECRET;
  const DEV_DEFAULT = "dev-employee-session-secret-do-not-use-in-prod";

  if (process.env.NODE_ENV === "production") {
    if (!secret || secret === DEV_DEFAULT) {
      throw new Error(
        "EMPLOYEE_SESSION_SECRET is not configured for production. " +
        "Set a long random value in your environment variables."
      );
    }
  }

  return secret ?? DEV_DEFAULT;
}

/**
 * Build a signed session cookie value.
 *
 * Format: base64(json) . hex(hmac)
 */
export function buildSessionCookieValue(session: EmployeeSession): string {
  const payload = Buffer.from(JSON.stringify(session)).toString("base64");
  const sig = createHmac("sha256", signingKey()).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

/**
 * Verify and decode a signed session cookie value.
 * Returns null if the cookie is invalid, expired, or tampered with.
 */
export function parseSessionCookieValue(raw: string): EmployeeSession | null {
  const dot = raw.indexOf(".");
  if (dot === -1) return null;

  const payload = raw.slice(0, dot);
  const sig = raw.slice(dot + 1);

  // Verify signature (constant-time comparison)
  const expectedSig = createHmac("sha256", signingKey()).update(payload).digest("hex");
  const sigBuf = Buffer.from(sig, "hex");
  const expectedBuf = Buffer.from(expectedSig, "hex");

  if (sigBuf.length !== expectedBuf.length) return null;

  try {
    timingSafeEqual(sigBuf, expectedBuf);
  } catch {
    return null;
  }

  try {
    const session: EmployeeSession & { expiresAt: string } = JSON.parse(
      Buffer.from(payload, "base64").toString("utf-8"),
    );

    // Check expiry
    if (new Date(session.expiresAt) < new Date()) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

/**
 * Create a new session for an employee and return the signed cookie value.
 * Session expires in 24 hours.
 */
export function createSession(params: {
  employeeCode: string;
  employeeName: string;
  tenantId: string;
  tenantName: string;
}): string {
  const session: EmployeeSession = {
    employeeCode: params.employeeCode,
    employeeName: params.employeeName,
    tenantId: params.tenantId,
    tenantName: params.tenantName,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  };

  return buildSessionCookieValue(session);
}

/**
 * Check whether a Tenant App error response indicates the employee account
 * has been deactivated. If so, the marketing site should clear the session
 * cookie so the employee is logged out immediately.
 */
export function isInactiveEmployeeError(status: number, errorBody: Record<string, unknown> | null): boolean {
  if (status !== 403) return false;
  if (!errorBody || typeof errorBody.error !== "string") return false;
  const msg = errorBody.error.toLowerCase();
  return msg.includes("not active") || msg.includes("inactive") || msg.includes("disabled");
}

/**
 * Get the current employee session from the request cookies.
 * Returns null if not authenticated or session expired/invalid.
 */
export function getSession(): EmployeeSession | null {
  const cookieStore = cookies();
  const raw = cookieStore.get(SESSION_COOKIE)?.value;
  if (!raw) return null;

  return parseSessionCookieValue(raw);
}

/**
 * Cookie options used when setting the session cookie.
 */
export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24, // 24 hours
};
