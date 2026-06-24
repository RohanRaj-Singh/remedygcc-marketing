import { redirect } from "next/navigation";
import { getSession } from "@/lib/employee-access/session";
import ClaimsList from "./ClaimsList";

export default function ClaimsPage() {
  const session = getSession();

  if (!session) {
    redirect("/reimbursement/employee");
  }

  return (
    <ClaimsList
      employeeName={session.employeeName}
      employeeCode={session.employeeCode}
      tenantName={session.tenantName}
    />
  );
}
