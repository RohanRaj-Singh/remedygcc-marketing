"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useState } from "react";

export default function PortalLogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch("/api/employee-access/logout", { method: "POST" });
      router.push("/reimbursement");
    } catch {
      // Even if the request fails, redirect
      router.push("/reimbursement");
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg font-satoshi font-bold text-sm text-gray-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors disabled:opacity-50"
    >
      <LogOut className="w-4 h-4" />
      {loading ? "Signing out..." : "Sign Out"}
    </button>
  );
}
