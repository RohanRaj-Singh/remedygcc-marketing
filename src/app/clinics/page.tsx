'use client';

import { useState, useEffect } from "react";
import type { LucideIcon } from "lucide-react";
import { useI18n } from "@/i18n/I18nContext";
import { Sofa, Video, Loader2, AlertCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getClinics } from "@/data/api-clinics";
import type { ClinicCard } from "@/data/api-clinics";

export default function ClinicsPage() {
  const { t, locale } = useI18n();
  const [clinics, setClinics] = useState<ClinicCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    getClinics()
      .then((data) => {
        if (mounted) {
          setClinics(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) {
          setError("Failed to load clinics.");
          setLoading(false);
        }
      });

    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-white pt-28 pb-10">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-500 font-satoshi">{t('clinics.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-white pt-28 pb-10">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="mb-8">
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary font-satoshi font-bold rounded-full text-sm mb-4">
            {t('clinics.label')}
          </span>
          <h1 className="text-5xl md:text-7xl font-roca-one text-primary mb-4">
            {t('clinics.title')}
          </h1>
          <p className="text-xl text-gray-600 font-satoshi max-w-2xl mx-auto">
            {t('clinics.description')}
          </p>
        </div>

        {error && (
          <div className="flex items-center justify-center gap-2 text-red-600 mb-6">
            <AlertCircle className="h-5 w-5" />
            <p className="font-satoshi text-sm">{error}</p>
          </div>
        )}

        {!error && clinics.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 font-satoshi text-lg">
              {t('clinics.empty')}
            </p>
          </div>
        )}

        {clinics.length > 0 && (
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {clinics.map(clinic => {
              const displayName = locale === 'ar' ? clinic.nameAr : clinic.name;
              const displayAddress = locale === 'ar' ? clinic.addressAr : clinic.address;
              const displayIconInfo = locale === 'ar' ? clinic.iconInfoAr : clinic.iconInfo;
              const isExternalRedirect = Boolean(clinic.redirect && clinic.redirectUrl);
              const linkHref = isExternalRedirect ? clinic.redirectUrl! : `/clinics/${clinic.id}`;
              const imageWrapperClassName =
                clinic.cardImage.background === "white" ? "bg-white" : "bg-slate-50";
              const imageClassName =
                clinic.cardImage.fit === "contain" ? "object-contain p-8" : "object-cover";

              return (
                <Link
                  key={clinic.id}
                  href={linkHref}
                  target={isExternalRedirect ? "_blank" : undefined}
                  rel={isExternalRedirect ? "noopener noreferrer" : undefined}
                  className="group relative bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-[shadow,transform] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-105 block"
                  aria-label={`${displayName}${isExternalRedirect ? ' (opens in new tab)' : ''}`}
                >
                  <div className={`relative mb-6 aspect-square w-full overflow-hidden ${imageWrapperClassName}`}>
                    <Image
                      src={clinic.cardImage.src}
                      alt={clinic.cardImage.alt}
                      fill
                      unoptimized
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className={imageClassName}
                    />
                  </div>
                  <div className="p-6 pb-4">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-roca-one text-lg text-primary pe-4 text-start">{displayName}</h3>
                      <div className="flex items-center space-x-4 relative">
                        <div className="relative group/tooltip">
                          <Sofa className="h-5 w-5 text-primary cursor-pointer" />
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs font-satoshi rounded-md opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                            {t('clinics.details.inPerson')}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                        <div className="relative group/tooltip">
                          <Video className="h-5 w-5 text-primary cursor-pointer" />
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs font-satoshi rounded-md opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                            {t('clinics.details.video')}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 font-satoshi mb-4 text-start">{displayAddress}</p>
                    <div className="group-hover:opacity-100 group-hover:h-auto opacity-0 h-0 overflow-hidden transition-[opacity,height] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]">
                      <div className="flex flex-col items-start gap-2 mb-4">
                        {displayIconInfo.map((info, index) => (
                          <div key={index} className="flex flex-row items-center gap-2">
                            <info.icon className="h-5 w-5 text-primary" />
                            <span className="text-xs font-satoshi text-gray-600 text-start">{info.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
