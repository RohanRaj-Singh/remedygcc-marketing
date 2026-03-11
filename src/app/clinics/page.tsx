import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Clinics | Remedy GCC",
  description: "Find our partner clinics offering physical therapy, chiropractic care, massage therapy, and acupuncture services near you.",
};

export default function ClinicsPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-white">
      <div className="text-center px-4">
        <div className="mb-8">
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary font-satoshi font-bold rounded-full text-sm mb-4">
            Coming Soon
          </span>
          <h1 className="text-5xl md:text-7xl font-roca-one text-primary mb-4">
            Our Clinics
          </h1>
          <p className="text-xl text-gray-600 font-satoshi max-w-2xl mx-auto">
            Discover our network of partner clinics providing professional natural healing 
            services in convenient locations.
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
              <span className="text-2xl">📍</span>
            </div>
            <h3 className="font-roca-one text-lg text-primary mb-2">Multiple Locations</h3>
            <p className="text-gray-600 font-satoshi text-sm">
              Clinics conveniently located across the Gulf region
            </p>
          </div>
          
          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🏥</span>
            </div>
            <h3 className="font-roca-one text-lg text-primary mb-2">Modern Facilities</h3>
            <p className="text-gray-600 font-satoshi text-sm">
              State-of-the-art equipment and comfortable environments
            </p>
          </div>
          
          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⭐</span>
            </div>
            <h3 className="font-roca-one text-lg text-primary mb-2">Quality Care</h3>
            <p className="text-gray-600 font-satoshi text-sm">
              Highest standards of professional healthcare
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
