import { Suspense } from "react";
import ResetPasswordForm from "./ResetPasswordForm";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const params = await searchParams;
  const token = params.token ?? "";

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
      <ResetPasswordForm token={token} />
    </Suspense>
  );
}
