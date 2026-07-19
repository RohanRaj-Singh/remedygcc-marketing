import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getSession } from "@/lib/employee-access/session";
import ChangePasswordForm from "./ChangePasswordForm";

export default async function ChangePasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ mustChange?: string }>;
}) {
  const session = getSession();

  // Must be logged in to change password
  if (!session) {
    redirect("/reimbursement/employee");
  }

  const params = await searchParams;
  const mustChange = params.mustChange === "true";

  return (
    <div className="min-h-[60vh] bg-gradient-to-br from-primary/5 to-white pt-28 pb-10">
      <div className="w-full max-w-md mx-auto px-4">
        <Suspense
          fallback={
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
              <div className="animate-pulse font-satoshi text-gray-400">
                Loading...
              </div>
            </div>
          }
        >
          <ChangePasswordForm mustChange={mustChange} />
        </Suspense>
      </div>
    </div>
  );
}
