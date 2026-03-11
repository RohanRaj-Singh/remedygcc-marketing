import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Our Therapists | Remedy GCC",
  description: "Meet our team of certified therapists specializing in physical therapy, chiropractic care, massage therapy, and acupuncture.",
};

export default function TherapistsPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-white">
      <div className="text-center px-4">
        <div className="mb-8">
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary font-satoshi font-bold rounded-full text-sm mb-4">
            Coming Soon
          </span>
          <h1 className="text-5xl md:text-7xl font-roca-one text-primary mb-4">
            Our Therapists
          </h1>
          <p className="text-xl text-gray-600 font-satoshi max-w-2xl mx-auto">
            Meet our network of certified and experienced therapists dedicated to providing 
            you with the highest quality natural healthcare.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-satoshi font-bold rounded-lg hover:bg-primary/90 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Home
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {[
            { title: "Physical Therapy", icon: "🏋️" },
            { title: "Chiropractic Care", icon: "🦴" },
            { title: "Massage Therapy", icon: "💆" },
            { title: "Acupuncture", icon: "📍" },
          ].map((specialty) => (
            <div key={specialty.title} className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="text-4xl mb-4">{specialty.icon}</div>
              <h3 className="font-roca-one text-lg text-primary mb-2">{specialty.title}</h3>
              <p className="text-gray-600 font-satoshi text-sm">
                Certified professionals coming soon
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
