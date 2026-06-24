import { redirect } from "next/navigation";
import { getSession } from "@/lib/employee-access/session";
import ClaimDetail from "./ClaimDetail";

export default function ClaimDetailPage() {
  const session = getSession();

  if (!session) {
    redirect("/reimbursement/employee");
  }

  return (
    <ClaimDetail
      employeeCode={session.employeeCode}
      employeeName={session.employeeName}
      tenantName={session.tenantName}
    />
  );
}
