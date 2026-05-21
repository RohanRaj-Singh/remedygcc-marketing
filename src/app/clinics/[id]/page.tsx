import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Globe, Mail, MapPin, Phone, type LucideIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { getClinicById, type ClinicMedia } from "@/data/clinics";

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

export const metadata: Metadata = {
  title: "Clinic Details | Remedy GCC",
  description: "View clinic details, working hours, and contact information.",
};

const getMediaFrameClassName = (media: ClinicMedia) => {
  if (media.background === "white") {
    return "bg-white";
  }

  if (media.background === "soft") {
    return "bg-slate-50";
  }

  return "bg-slate-100";
};

const getMediaImageClassName = (media: ClinicMedia) =>
  media.fit === "contain" ? "object-contain p-6 md:p-8" : "object-cover";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ClinicPage({ params }: PageProps) {
  const { id } = await params;
  const clinic = getClinicById(Number.parseInt(id, 10));
  const [heroImage, ...secondaryImages] = clinic.gallery;
  const contactItems = [
    clinic.contact.phone
      ? { icon: Phone, label: clinic.contact.phone }
      : null,
    clinic.contact.email
      ? { icon: Mail, label: clinic.contact.email, href: `mailto:${clinic.contact.email}` }
      : null,
    clinic.contact.website
      ? {
          icon: Globe,
          label: clinic.contact.website.replace(/^https?:\/\//, "").replace(/\/$/, ""),
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
          Back to Clinics
        </Link>

        {/* Enclosed in rounded border */}
        <div className="border border-gray-200 rounded-2xl p-6 bg-white">
          <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-roca-one text-primary mb-4">
                {clinic.name}
              </h1>

              <div className="flex items-start gap-2 text-gray-600">
                <MapPin className="mt-1 h-5 w-5 shrink-0" />
                <span className="font-satoshi">{clinic.address}</span>
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

          {heroImage ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-12">
              <div className={secondaryImages.length > 0 ? "md:col-span-2" : undefined}>
                <div
                  className={`relative overflow-hidden rounded-xl border border-gray-100 ${
                    secondaryImages.length > 0 ? "h-[500px]" : "h-[360px] md:h-[420px]"
                  } ${getMediaFrameClassName(heroImage)}`}
                >
                  <Image
                    src={heroImage.src}
                    alt={heroImage.alt}
                    fill
                    unoptimized
                    sizes="(min-width: 768px) 66vw, 100vw"
                    className={getMediaImageClassName(heroImage)}
                    style={
                      heroImage.objectPosition
                        ? { objectPosition: heroImage.objectPosition }
                        : undefined
                    }
                  />
                </div>
              </div>

              {secondaryImages.length > 0 ? (
                <div className={`flex gap-4 ${secondaryImages.length > 1 ? "flex-col" : ""}`}>
                  {secondaryImages.map((image) => (
                    <div
                      key={image.src}
                      className={`relative overflow-hidden rounded-xl border border-gray-100 ${
                        secondaryImages.length > 1 ? "h-[243px]" : "h-[500px]"
                      } ${getMediaFrameClassName(image)}`}
                    >
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        unoptimized
                        sizes="(min-width: 768px) 33vw, 100vw"
                        className={getMediaImageClassName(image)}
                        style={
                          image.objectPosition
                            ? { objectPosition: image.objectPosition }
                            : undefined
                        }
                      />
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}

          {/* About Clinic, Working Hours and Map */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* About Clinic and Working Hours on Left */}
            <div className="lg:col-span-2">
              {/* About Clinic */}
              <div className="mb-8">
                <h2 className="text-2xl font-roca-one text-primary mb-4">
                  About Clinic
                </h2>
                <p className="text-gray-600 font-satoshi leading-relaxed">
                  {clinic.description}
                </p>
              </div>

              {/* Working Hours Table */}
              <div>
                <h2 className="text-2xl font-roca-one text-primary mb-4">
                  Working Hours
                </h2>
                <div className="bg-gray-50 rounded-xl">
                  <table className="w-full">
                    <tbody>
                      {clinic.workingHours.map((item, index) => (
                        <tr key={item.day} className={index !== clinic.workingHours.length - 1 ? "border-b border-gray-200" : ""}>
                          <td className="py-3 px-4 font-satoshi text-gray-800">{item.day}</td>
                          <td className="py-3 px-4 font-satoshi text-gray-600 text-end">{item.hours}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Map on Right */}
            <div>
              <h2 className="text-2xl font-roca-one text-primary mb-4">
                Address
              </h2>
              <div className="mb-6">
                <ClinicMap 
                  address={clinic.address || "Muscat, Oman"} 
                  clinicName={clinic.name}
                  coordinates={clinic.coordinates}
                />
              </div>

              {/* Contact Information Below Map */}
              <div>
                <h2 className="text-2xl font-roca-one text-primary mb-4">
                  Contact Information
                </h2>
                <div className="space-y-4">
                  {contactItems.map((item) => (
                    <div key={`${clinic.id}-${item.label}`} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                      <item.icon className="h-5 w-5 text-primary shrink-0" />
                      {item.href ? (
                        <a
                          href={item.href}
                          className="font-satoshi text-gray-600 hover:text-primary transition-colors break-all"
                          target={item.href.startsWith("http") ? "_blank" : undefined}
                          rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        >
                          {item.label}
                        </a>
                      ) : (
                        <span className="font-satoshi text-gray-600">{item.label}</span>
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
