import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/employee-access/session";
import { User, Clock, FileText } from "lucide-react";
import PortalLogoutButton from "./PortalLogoutButton";

export default function PortalPage() {
  const session = getSession();

  if (!session) {
    redirect("/reimbursement/employee");
  }

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-[60vh] bg-gradient-to-br from-primary/5 to-white pt-28 pb-10">
      <div className="w-full max-w-4xl mx-auto px-4">
        {/* Welcome header */}
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              <span className="inline-block px-4 py-2 bg-primary/10 text-primary font-satoshi font-bold rounded-full text-sm mb-4">
                Employee Portal
              </span>
              <h1 className="text-4xl md:text-5xl font-roca-one text-primary mb-2">
                Welcome, {session.employeeName}
              </h1>
              <p className="text-gray-500 font-satoshi text-lg">
                {session.tenantName} — Employee Access Portal
              </p>
            </div>
            <PortalLogoutButton />
          </div>
        </div>

        {/* Action cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* New Claim */}
          <Link
            href="/reimbursement/employee/new"
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-primary/20 transition-all duration-200 group row-span-2 flex flex-col justify-center"
          >
            <div>
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform origin-left">
                <FileText className="w-7 h-7 text-primary" />
              </div>
              <h2 className="font-satoshi font-bold text-primary text-xl mb-2">
                New Claim
              </h2>
              <p className="font-satoshi text-sm text-gray-500 mb-6">
                Submit a reimbursement claim for therapy or counselling sessions.
              </p>
              <span className="inline-flex items-center gap-2 text-sm font-satoshi font-bold text-primary group-hover:gap-3 transition-all">
                Create Claim
                <span aria-hidden="true" className="text-lg">&rarr;</span>
              </span>
            </div>
          </Link>

          {/* My Claims */}
          <Link
            href="/reimbursement/employee/claims"
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-primary/20 transition-all duration-200 group"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <h2 className="font-satoshi font-bold text-primary text-lg">
                  My Claims
                </h2>
                <p className="font-satoshi text-xs text-gray-400">
                  Track your submitted claims
                </p>
              </div>
            </div>
            <p className="font-satoshi text-sm text-gray-500">
              View the status of your reimbursement claims.
            </p>
          </Link>

          {/* Quick info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-satoshi font-bold text-primary text-lg">
                  {session.employeeName}
                </h2>
                <p className="font-satoshi text-xs text-gray-400">
                  {session.employeeCode} &middot; {session.tenantName}
                </p>
              </div>
            </div>
            <p className="font-satoshi text-xs text-gray-400 leading-relaxed">
              Session expires on {formatDate(session.expiresAt)}.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <Link
            href="/"
            className="text-sm text-gray-400 font-satoshi hover:text-primary transition-colors"
          >
            Back to Remedy GCC
          </Link>
        </div>
      </div>
    </div>
  );
}
