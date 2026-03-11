import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "How It Works | Remedy GCC",
  description: "Learn how Remedy GCC connects you with certified therapists for natural healing and professional therapy services.",
};

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-white">
      <div className="text-center px-4">
        <div className="mb-8">
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary font-satoshi font-bold rounded-full text-sm mb-4">
            Coming Soon
          </span>
          <h1 className="text-5xl md:text-7xl font-roca-one text-primary mb-4">
            How It Works
          </h1>
          <p className="text-xl text-gray-600 font-satoshi max-w-2xl mx-auto">
            We're working on something amazing. Our platform will connect you with 
            certified therapists for physical therapy, chiropractic care, massage therapy, and acupuncture.
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

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">1</span>
            </div>
            <h3 className="font-roca-one text-lg text-primary mb-2">Browse Therapists</h3>
            <p className="text-gray-600 font-satoshi text-sm">
              Explore our network of certified professionals
            </p>
          </div>
          
          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">2</span>
            </div>
            <h3 className="font-roca-one text-lg text-primary mb-2">Book Appointment</h3>
            <p className="text-gray-600 font-satoshi text-sm">
              Schedule a session that fits your needs
            </p>
          </div>
          
          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">3</span>
            </div>
            <h3 className="font-roca-one text-lg text-primary mb-2">Start Healing</h3>
            <p className="text-gray-600 font-satoshi text-sm">
              Begin your journey to natural wellness
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
