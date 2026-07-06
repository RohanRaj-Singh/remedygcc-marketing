/**
 * API-driven clinic data source.
 *
 * Fetches clinics from the tenant app (which proxies the admin-managed MongoDB).
 * Maps the response to the shape expected by the UI (cardImage, logo, iconInfo, etc.)
 * with sensible defaults for fields the API doesn't provide.
 *
 * The iconInfo (LucideIcon references) and image metadata (alt text, fit, background)
 * are design-layer data that does not belong in the database — they are mapped here
 * per clinic slug.
 */

import type { LucideIcon } from "lucide-react";
import { Globe, Star, User } from "lucide-react";

/** URL of the Tenant App API (set via environment variable). */
const TENANT_APP_URL = process.env.TENANT_APP_URL ?? "http://localhost:3100";

// ── API Response Types ───────────────────────────────────────────────────────

interface ApiClinic {
  id: string;
  slug: string;
  name: string;
  nameAr: string | null;
  logo: string | null;
  cardImage: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  address: string | null;
  addressAr: string | null;
  coordinates: { lat: number | null; lng: number | null } | null;
  googleMapsUrl: string | null;
  description: string | null;
  descriptionAr: string | null;
  workingHours: { day: string; hours: string }[] | null;
  workingHoursAr: { day: string; hours: string }[] | null;
  acceptsInPerson: boolean;
  redirectUrl: string | null;
  status: string;
}

// ── UI-Expected Types ────────────────────────────────────────────────────────

export interface ClinicMedia {
  src: string;
  alt: string;
  fit: "contain" | "cover";
  background: "soft" | "white";
}

export interface ClinicIconInfo {
  icon: LucideIcon;
  label: string;
}

export interface ClinicContact {
  phone: string | null;
  email: string | null;
  website: string | null;
}

export interface ClinicWorkingHour {
  day: string;
  hours: string;
}

export interface ClinicCard {
  id: string;
  slug: string;
  name: string;
  nameAr: string;
  cardImage: ClinicMedia;
  logo: ClinicMedia;
  address: string;
  addressAr: string;
  coordinates: { lat: number; lng: number };
  googleMapsUrl: string;
  description: string;
  descriptionAr: string;
  workingHours: ClinicWorkingHour[];
  workingHoursAr: ClinicWorkingHour[];
  contact: ClinicContact;
  acceptsInPerson: boolean;
  iconInfo: ClinicIconInfo[];
  iconInfoAr: ClinicIconInfo[];
  redirect: boolean;
  redirectUrl?: string;
}

// ── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULT_CLINIC_IMAGE = "/images/default/logo.png";

const ICON_INFO_MAP: Record<string, { en: ClinicIconInfo[]; ar: ClinicIconInfo[] }> = {
  "eunoia-clinic": {
    en: [
      { icon: User, label: "Multidisciplinary Therapy Team" },
      { icon: Star, label: "Specialities: Psychotherapy, ADHD Assessments, Play Therapy, Trauma Care" },
      { icon: Globe, label: "Languages not specified" },
    ],
    ar: [
      { icon: User, label: "فريق علاجي متعدد التخصصات" },
      { icon: Star, label: "التخصصات: العلاج النفسي، تقييمات فرط الحركة، العلاج باللعب، رعاية الصدمات" },
      { icon: Globe, label: "اللغات غير محددة" },
    ],
  },
  "hayat-counseling-center": {
    en: [
      { icon: User, label: "Mental Health Specialists" },
      { icon: Star, label: "13+ Years Experience" },
      { icon: Globe, label: "Psychological, Marital, Family Counseling" },
    ],
    ar: [
      { icon: User, label: "أخصائيو الصحة النفسية" },
      { icon: Star, label: "أكثر من ١٣ عاماً من الخبرة" },
      { icon: Globe, label: "استشارات نفسية، زوجية، أسرية" },
    ],
  },
};

function getIconInfo(slug: string): { en: ClinicIconInfo[]; ar: ClinicIconInfo[] } {
  return ICON_INFO_MAP[slug] ?? {
    en: [{ icon: Star, label: "Mental Health Services" }],
    ar: [{ icon: Star, label: "خدمات الصحة النفسية" }],
  };
}

function getImageMeta(clinic: ApiClinic, type: "logo" | "card"): ClinicMedia {
  const src = type === "logo" ? (clinic.logo || clinic.cardImage || DEFAULT_CLINIC_IMAGE)
    : (clinic.cardImage || clinic.logo || DEFAULT_CLINIC_IMAGE);

  return {
    src,
    alt: `${clinic.name} ${type}`,
    fit: "contain",
    background: "white",
  };
}

function toClinicCard(api: ApiClinic): ClinicCard {
  const icons = getIconInfo(api.slug);

  return {
    id: api.id,
    slug: api.slug,
    name: api.name,
    nameAr: api.nameAr || api.name,
    cardImage: getImageMeta(api, "card"),
    logo: getImageMeta(api, "logo"),
    address: api.address || "",
    addressAr: api.addressAr || api.address || "",
    coordinates: (api.coordinates?.lat != null && api.coordinates?.lng != null)
      ? { lat: api.coordinates.lat, lng: api.coordinates.lng }
      : { lat: 23.6, lng: 58.35 }, // Default to Muscat, Oman
    googleMapsUrl: api.googleMapsUrl || "",
    description: api.description || "",
    descriptionAr: api.descriptionAr || api.description || "",
    workingHours: api.workingHours || [],
    workingHoursAr: api.workingHoursAr || [],
    contact: {
      phone: api.phone,
      email: api.email,
      website: api.website,
    },
    acceptsInPerson: api.acceptsInPerson ?? true,
    iconInfo: icons.en,
    iconInfoAr: icons.ar,
    redirect: Boolean(api.redirectUrl),
    redirectUrl: api.redirectUrl || undefined,
  };
}

// ── Public API ───────────────────────────────────────────────────────────────

/**
 * Fetch all active clinics from the tenant app API.
 * Returns an empty array if the API is unreachable.
 */
export async function getClinics(): Promise<ClinicCard[]> {
  try {
    const res = await fetch(`${TENANT_APP_URL}/api/clinics`, {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(10_000),
    });

    if (!res.ok) return [];

    const data: ApiClinic[] = await res.json();

    if (!Array.isArray(data)) return [];

    // Only show active clinics
    return data
      .filter((c) => c.status === "active")
      .map(toClinicCard);
  } catch {
    return [];
  }
}

/**
 * Fetch a single active clinic by slug.
 */
export async function getClinicBySlug(slug: string): Promise<ClinicCard | undefined> {
  const clinics = await getClinics();
  return clinics.find((c) => c.slug === slug);
}

/**
 * Fetch a single active clinic by ID.
 */
export async function getClinicById(id: string): Promise<ClinicCard | undefined> {
  const clinics = await getClinics();
  return clinics.find((c) => c.id === id);
}
