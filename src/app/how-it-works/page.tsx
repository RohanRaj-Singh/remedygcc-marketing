'use client';

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useI18n } from "@/i18n/I18nContext";

// ============================================================================
// Types & Interfaces
// ============================================================================

interface Step {
  id: number;
  titleKey: string;
  descriptionKey: string;
}

// ============================================================================
// Data - Externalized for maintainability and easy localization
// ============================================================================

const STEPS: Step[] = [
  {
    id: 1,
    titleKey: "howItWorks.steps.browse.title",
    descriptionKey: "howItWorks.steps.browse.description",
  },
  {
    id: 2,
    titleKey: "howItWorks.steps.book.title",
    descriptionKey: "howItWorks.steps.book.description",
  },
  {
    id: 3,
    titleKey: "howItWorks.steps.free.title",
    descriptionKey: "howItWorks.steps.free.description",
  },
  {
    id: 4,
    titleKey: "howItWorks.steps.heal.title",
    descriptionKey: "howItWorks.steps.heal.description",
  },
];

// ============================================================================
// Reusable Component - StepCard
// ============================================================================

interface StepCardProps {
  step: Step;
  t: (key: string) => string;
}

function StepCard({ step, t }: StepCardProps) {
  // Early return for invalid data
  if (!step || typeof step.id !== "number") {
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
        {t(step.titleKey)}
      </h3>

      {/* Step Description */}
      <p className="text-gray-600 font-satoshi text-sm">
        {t(step.descriptionKey)}
      </p>
    </article>
  );
}

export default function HowItWorksPage() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-white pt-24 pb-16">
      <div className="text-center px-4">
        <div className="mb-8">
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary font-satoshi font-bold rounded-full text-sm mb-4">
            {t("howItWorks.label")}
          </span>
          <h1 className="text-5xl md:text-7xl font-roca-one text-primary mb-4">
            {t("howItWorks.title")}
          </h1>
          <p className="text-xl text-gray-600 font-satoshi max-w-2xl mx-auto">
            {t("howItWorks.description")}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-satoshi font-bold rounded-lg hover:bg-primary/90 transition-colors"
          >
            <ArrowLeft size={20} />
            {t("howItWorks.backToHome")}
          </Link>
        </div>

        {/* Steps Grid - Using semantic list for accessibility */}
        <nav
          aria-label="How it works steps"
          className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
        >
          <ul role="list" className="contents" aria-label="Four-step process">
            {STEPS.map((step) => (
              <StepCard key={step.id} step={step} t={t} />
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
