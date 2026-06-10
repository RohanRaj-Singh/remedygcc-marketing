'use client';

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useI18n } from "@/i18n/I18nContext";

export default function TherapistsPage() {
  const { t } = useI18n();

  const specialties = [
    { titleKey: "therapists.specialties.physicalTherapy", icon: "🏋️" },
    { titleKey: "therapists.specialties.chiropracticCare", icon: "🦴" },
    { titleKey: "therapists.specialties.massageTherapy", icon: "💆" },
    { titleKey: "therapists.specialties.acupuncture", icon: "📍" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-white">
      <div className="text-center px-4">
        <div className="mb-8">
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary font-satoshi font-bold rounded-full text-sm mb-4">
            {t("therapists.label")}
          </span>
          <h1 className="text-5xl md:text-7xl font-roca-one text-primary mb-4">
            {t("therapists.title")}
          </h1>
          <p className="text-xl text-gray-600 font-satoshi max-w-2xl mx-auto">
            {t("therapists.description")}
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

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {specialties.map((specialty) => (
            <div
              key={specialty.titleKey}
              className="p-6 bg-white rounded-xl shadow-sm border border-gray-100"
            >
              <div className="text-4xl mb-4">{specialty.icon}</div>
              <h3 className="font-roca-one text-lg text-primary mb-2">
                {t(specialty.titleKey)}
              </h3>
              <p className="text-gray-600 font-satoshi text-sm">
                {t("therapists.comingSoon")}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
