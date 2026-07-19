import { Suspense } from "react";
import EmployeeLoginForm from "./EmployeeLoginForm";
import { getTenants } from "@/data/tenants";

export default async function EmployeeLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ tenant?: string }>;
}) {
  const params = await searchParams;
  const preselectedSlug = params.tenant ?? "";
  const tenants = await getTenants();

  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-primary/5 to-white pt-28 pb-10">
          <div className="w-full max-w-md mx-auto px-4 text-center">
            <div className="animate-pulse font-satoshi text-gray-400">
              Loading...
            </div>
          </div>
        </div>
      }
    >
      <EmployeeLoginForm tenants={tenants} preselectedSlug={preselectedSlug} />
    </Suspense>
  );
}
