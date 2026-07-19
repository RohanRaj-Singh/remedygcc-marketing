import { getTenants } from "@/data/tenants";
import RegisterForm from "./RegisterForm";

export default async function RegisterPage() {
  const tenants = await getTenants();

  return (
    <div className="min-h-[60vh] bg-gradient-to-br from-primary/5 to-white pt-28 pb-10">
      <div className="w-full max-w-lg mx-auto px-4">
        <RegisterForm tenants={tenants} />
      </div>
    </div>
  );
}
