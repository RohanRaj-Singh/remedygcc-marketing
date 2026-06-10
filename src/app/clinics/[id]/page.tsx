'use client';

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ExternalLink,
  Globe,
  Mail,
  MapPin,
  Phone,
  type LucideIcon,
} from "lucide-react";
import dynamic from "next/dynamic";
import { getClinicById } from "@/data/clinics";
import { useI18n } from "@/i18n/I18nContext";

// Dynamically import the map component with SSR disabled to avoid Leaflet window errors
const ClinicMap = dynamic(() => import("@/components/clinic-map/ClinicMap"), {
  ssr: false,
  loading: () => (
    <div className="bg-gray-100 rounded-xl h-[400px] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-3"></div>
        <p className="text-gray-600 font-satoshi">Loading map...</p>
      </div>
    </div>
  ),
});

// Utility functions for gallery images (temporarily unused)
// const getMediaFrameClassName = (media: ClinicMedia) => {
//   if (media.background === "white") {
//     return "bg-white";
//   }
//   if (media.background === "soft") {
//     return "bg-slate-50";
//   }
//   return "bg-slate-100";
// };
//
// const getMediaImageClassName = (media: ClinicMedia) =>
//   media.fit === "contain" ? "object-contain p-6 md:p-8" : "object-cover";

export default function ClinicPage() {
  const { id } = useParams<{ id: string }>();
  const { t, locale } = useI18n();

  const clinic = getClinicById(Number.parseInt(id ?? "1", 10));

  // Locale-aware fields
  const displayName = locale === "ar" ? clinic.nameAr : clinic.name;
  const displayAddress = locale === "ar" ? clinic.addressAr : clinic.address;
  const displayDescription =
    locale === "ar" ? clinic.descriptionAr : clinic.description;
  const displayWorkingHours =
    locale === "ar" ? clinic.workingHoursAr : clinic.workingHours;
  const displayIconInfo =
    locale === "ar" ? clinic.iconInfoAr : clinic.iconInfo;

  // Gallery images temporarily hidden
  // const [heroImage, ...secondaryImages] = clinic.gallery;

  const contactItems = [
    clinic.contact.phone
      ? { icon: Phone, label: clinic.contact.phone }
      : null,
    clinic.contact.email
      ? {
          icon: Mail,
          label: clinic.contact.email,
          href: `mailto:${clinic.contact.email}`,
        }
      : null,
    clinic.contact.website
      ? {
          icon: Globe,
          label: clinic.contact.website
            .replace(/^https?:\/\//, "")
            .replace(/\/$/, ""),
          href: clinic.contact.website,
        }
      : null,
  ].filter(
    (item): item is { icon: LucideIcon; label: string; href?: string } =>
      item !== null,
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-white pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Back Button */}
        <Link
          href="/clinics"
          className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          {t("clinics.details.backToClinics")}
        </Link>

        {/* Enclosed in rounded border */}
        <div className="border border-gray-200 rounded-2xl p-6 bg-white">
          <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-roca-one text-primary mb-4">
                {displayName}
              </h1>

              <div className="flex items-start gap-2 text-gray-600">
                <MapPin className="mt-1 h-5 w-5 shrink-0" />
                <span className="font-satoshi">{displayAddress}</span>
              </div>
            </div>

            <div className="relative h-28 w-full max-w-[260px] shrink-0 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              <Image
                src={clinic.logo.src}
                alt={clinic.logo.alt}
                fill
                priority
                unoptimized
                sizes="260px"
                className="object-contain p-5"
              />
            </div>
          </div>

          {/* Gallery images temporarily hidden
          {heroImage ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-12">
              ...
            </div>
          ) : null}
          */}

          {/* About Clinic, Working Hours and Map */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* About Clinic and Working Hours on Left */}
            <div className="lg:col-span-2">
              {/* About Clinic */}
              <div className="mb-8">
                <h2 className="text-2xl font-roca-one text-primary mb-4">
                  {t("clinics.details.aboutClinic")}
                </h2>
                <p className="text-gray-600 font-satoshi leading-relaxed">
                  {displayDescription}
                </p>
              </div>

              {/* Working Hours Table */}
              <div>
                <h2 className="text-2xl font-roca-one text-primary mb-4">
                  {t("clinics.details.workingHours")}
                </h2>
                <div className="bg-gray-50 rounded-xl">
                  <table className="w-full">
                    <tbody>
                      {displayWorkingHours.map(
                        (
                          item: { day: string; hours: string },
                          index: number,
                        ) => (
                          <tr
                            key={item.day}
                            className={
                              index !== displayWorkingHours.length - 1
                                ? "border-b border-gray-200"
                                : ""
                            }
                          >
                            <td className="py-3 px-4 font-satoshi text-gray-800">
                              {item.day}
                            </td>
                            <td className="py-3 px-4 font-satoshi text-gray-600 text-end">
                              {item.hours}
                            </td>
                          </tr>
                        ),
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Map on Right */}
            <div>
              <h2 className="text-2xl font-roca-one text-primary mb-4">
                {t("clinics.details.address")}
              </h2>
              <div className="mb-6">
                <ClinicMap
                  address={displayAddress || "Muscat, Oman"}
                  clinicName={displayName}
                  coordinates={clinic.coordinates}
                />
              </div>

              {/* Open in Google Maps */}
              <a
                href={clinic.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 w-full justify-center px-4 py-3 mb-6 bg-primary text-white font-satoshi font-bold rounded-xl hover:bg-primary/90 transition-colors"
              >
                <MapPin size={18} />
                {locale === "ar" ? "فتح في خرائط Google" : "Open in Google Maps"}
                <ExternalLink size={16} />
              </a>

              {/* Contact Information Below Map */}
              <div>
                <h2 className="text-2xl font-roca-one text-primary mb-4">
                  {t("clinics.details.contactInformation")}
                </h2>
                <div className="space-y-4">
                  {contactItems.map((item) => (
                    <div
                      key={`${clinic.id}-${item.label}`}
                      className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl"
                    >
                      <item.icon className="h-5 w-5 text-primary shrink-0" />
                      {item.href ? (
                        <a
                          href={item.href}
                          className="font-satoshi text-gray-600 hover:text-primary transition-colors break-all"
                          target={
                            item.href.startsWith("http") ? "_blank" : undefined
                          }
                          rel={
                            item.href.startsWith("http")
                              ? "noopener noreferrer"
                              : undefined
                          }
                        >
                          {item.label}
                        </a>
                      ) : (
                        <span className="font-satoshi text-gray-600">
                          {item.label}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
