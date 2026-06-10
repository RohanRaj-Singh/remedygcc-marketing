'use client';

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useI18n } from "@/i18n/I18nContext";

export default function AboutPage() {
  const { t } = useI18n();

  const cards = [
    {
      icon: "🌿",
      titleKey: "about.cards.naturalHealing.title",
      descKey: "about.cards.naturalHealing.description",
    },
    {
      icon: "👨‍⚕️",
      titleKey: "about.cards.expertCare.title",
      descKey: "about.cards.expertCare.description",
    },
    {
      icon: "🤝",
      titleKey: "about.cards.community.title",
      descKey: "about.cards.community.description",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-white">
      <div className="text-center px-4">
        <div className="mb-8">
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary font-satoshi font-bold rounded-full text-sm mb-4">
            {t("about.label")}
          </span>
          <h1 className="text-5xl md:text-7xl font-roca-one text-primary mb-4">
            {t("about.title")}
          </h1>
          <p className="text-xl text-gray-600 font-satoshi max-w-2xl mx-auto">
            {t("about.description")}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-satoshi font-bold rounded-lg hover:bg-primary/90 transition-colors"
          >
            <ArrowLeft size={20} />
            {t("about.backToHome")}
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {cards.map((card) => (
            <div
              key={card.titleKey}
              className="p-6 bg-white rounded-xl shadow-sm border border-gray-100"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">{card.icon}</span>
              </div>
              <h3 className="font-roca-one text-lg text-primary mb-2">
                {t(card.titleKey)}
              </h3>
              <p className="text-gray-600 font-satoshi text-sm">
                {t(card.descKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
