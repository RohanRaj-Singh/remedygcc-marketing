import { redirect } from "next/navigation";
import { getSession } from "@/lib/employee-access/session";
import ClaimForm from "./ClaimForm";

/** URL of the Tenant App API (set via environment variable). */
const TENANT_APP_URL =
  process.env.TENANT_APP_URL ?? "http://localhost:3100";

interface Clinic {
  id: string | number;
  slug: string;
  name: string;
  nameAr: string;
}

/** Fetch clinics from the Tenant App (single source of truth). */
async function getClinics(): Promise<Clinic[]> {
  try {
    const res = await fetch(`${TENANT_APP_URL}/api/clinics`, {
      next: { revalidate: 300 }, // cache for 5 minutes
    });
    if (res.ok) return res.json();
  } catch {
    // fall through to empty list
  }
  return [];
}

export default async function NewClaimPage() {
  const session = getSession();

  if (!session) {
    redirect("/reimbursement/employee");
  }

  const clinics = await getClinics();

  return (
    <ClaimForm
      clinics={clinics}
      employeeName={session.employeeName}
      employeeCode={session.employeeCode}
      tenantName={session.tenantName}
    />
  );
}
