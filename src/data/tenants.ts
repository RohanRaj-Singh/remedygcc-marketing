export interface Tenant {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

/** URL of the Tenant App API (set via environment variable). */
const TENANT_APP_URL =
  process.env.TENANT_APP_URL ?? "http://localhost:3100";

/**
 * Fetch active employee-facing tenants from the Tenant App.
 * Returns an empty array if the API is unreachable — no stale fallback.
 */
export async function getTenants(): Promise<Tenant[]> {
  try {
    const res = await fetch(`${TENANT_APP_URL}/api/employee/tenants`, {
      next: { revalidate: 300 },
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        return data;
      }
    }
  } catch {
    // Tenant App unavailable
  }
  return [];
}

/**
 * Fetch a single tenant by slug from the Tenant App.
 */
export async function getTenantBySlug(slug: string): Promise<Tenant | undefined> {
  const tenants = await getTenants();
  return tenants.find((t) => t.slug === slug);
}
