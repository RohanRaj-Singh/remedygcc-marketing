import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "About Remedy GCC",
  description: "Learn about Remedy GCC's mission to connect people with certified therapists for natural healing and professional therapy services.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-white">
      <div className="text-center px-4">
        <div className="mb-8">
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary font-satoshi font-bold rounded-full text-sm mb-4">
            Coming Soon
          </span>
          <h1 className="text-5xl md:text-7xl font-roca-one text-primary mb-4">
            About Remedy GCC
          </h1>
          <p className="text-xl text-gray-600 font-satoshi max-w-2xl mx-auto">
            We're on a mission to revolutionize healthcare by connecting people with 
            certified therapists for natural healing and professional therapy services.
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
              <span className="text-2xl">🌿</span>
            </div>
            <h3 className="font-roca-one text-lg text-primary mb-2">Natural Healing</h3>
            <p className="text-gray-600 font-satoshi text-sm">
              Embracing traditional and modern holistic approaches to wellness
            </p>
          </div>
          
          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">👨‍⚕️</span>
            </div>
            <h3 className="font-roca-one text-lg text-primary mb-2">Expert Care</h3>
            <p className="text-gray-600 font-satoshi text-sm">
              Network of certified and experienced healthcare professionals
            </p>
          </div>
          
          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🤝</span>
            </div>
            <h3 className="font-roca-one text-lg text-primary mb-2">Community</h3>
            <p className="text-gray-600 font-satoshi text-sm">
              Building a healthier community through accessible care
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
