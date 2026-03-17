import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// ============================================================================
// Types & Interfaces
// ============================================================================

interface Step {
  id: number;
  title: string;
  description: string;
}

// ============================================================================
// Data - Externalized for maintainability and easy localization
// ============================================================================

const STEPS: Step[] = [
  {
    id: 1,
    title: "Browse clinics",
    description: "Explore our network of certified professionals.",
  },
  {
    id: 2,
    title: "Book Appointment",
    description: "Contact the clinic to schedule a session that fits your needs.",
  },
  {
    id: 3,
    title: "Free Therapy Sessions",
    description:
      "Zero cost. Our seamless program ensures your mental health support is fully covered.",
  },
  {
    id: 4,
    title: "Start Healing",
    description: "Begin your journey to natural wellness.",
  },
];

// ============================================================================
// Reusable Component - StepCard
// Benefits:
// - Single responsibility principle
// - Easy to test in isolation
// - Reusable across other pages
// - Consistent styling in one place
// ============================================================================

interface StepCardProps {
  step: Step;
}

function StepCard({ step }: StepCardProps) {
  // Early return for invalid data
  if (!step || typeof step.id !== "number" || !step.title) {
    return null;
  }

  return (
    <article
      className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 transition-shadow duration-200 hover:shadow-md"
      aria-labelledby={`step-title-${step.id}`}
      role="listitem"
    >
      {/* Step Number Badge */}
      <div
        className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4"
        aria-hidden="true"
      >
        <span className="text-2xl font-semibold text-primary">{step.id}</span>
      </div>

      {/* Step Title */}
      <h3
        id={`step-title-${step.id}`}
        className="font-roca-one text-lg text-primary mb-2"
      >
        {step.title}
      </h3>

      {/* Step Description */}
      <p className="text-gray-600 font-satoshi text-sm">{step.description}</p>
    </article>
  );
}

export const metadata: Metadata = {
  title: "How It Works | Remedy GCC",
  description:
    "Learn how Remedy GCC connects you with certified therapists for natural healing and professional therapy services.",
};

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-white pt-24 pb-16">
      <div className="text-center px-4">
        <div className="mb-8">
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary font-satoshi font-bold rounded-full text-sm mb-4">
            Coming Soon
          </span>
          <h1 className="text-5xl md:text-7xl font-roca-one text-primary mb-4">
            How It Works
          </h1>
          <p className="text-xl text-gray-600 font-satoshi max-w-2xl mx-auto">
            Our platform connects you with licensed psychologists through a secure,
            private portal designed to provide professional mental health support at
            no out-of-pocket cost to you. By utilizing our integrated reimbursement
            plan, you can access personalized therapy sessions and expert guidance
            without the burden of upfront fees or complex paperwork. This seamless,
            100% confidential service ensures your well-being is fully supported by
            your company while your privacy remains strictly protected.
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

        {/* Steps Grid - Using semantic list for accessibility */}
        <nav
          aria-label="How it works steps"
          className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
        >
          <ul
            role="list"
            className="contents"
            aria-label="Four-step process"
          >
            {STEPS.map((step) => (
              <StepCard key={step.id} step={step} />
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
