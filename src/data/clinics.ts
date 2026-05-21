import type { LucideIcon } from "lucide-react";
import { Globe, Star, User } from "lucide-react";

export type ClinicMediaFit = "contain" | "cover";
export type ClinicMediaBackground = "soft" | "white";

export interface ClinicMedia {
  src: string;
  alt: string;
  fit: ClinicMediaFit;
  background?: ClinicMediaBackground;
  objectPosition?: string;
}

export interface ClinicIconInfo {
  icon: LucideIcon;
  label: string;
}

export interface ClinicWorkingHour {
  day: string;
  hours: string;
}

export interface ClinicContact {
  phone: string | null;
  email: string | null;
  website: string | null;
}

export interface ClinicData {
  id: number;
  slug: string;
  name: string;
  cardImage: ClinicMedia;
  logo: ClinicMedia;
  gallery: ClinicMedia[];
  address: string;
  coordinates: { lat: number; lng: number };
  description: string;
  workingHours: ClinicWorkingHour[];
  contact: ClinicContact;
  acceptsInPerson: boolean;
  iconInfo: ClinicIconInfo[];
  redirect: boolean;
  redirectUrl?: string;
}

const logo = (src: string, clinicName: string): ClinicMedia => ({
  src,
  alt: `${clinicName} logo`,
  fit: "contain",
  background: "white",
});

const banner = (
  src: string,
  alt: string,
  fit: ClinicMediaFit = "cover",
  background?: ClinicMediaBackground,
): ClinicMedia => ({
  src,
  alt,
  fit,
  background,
});

export const clinicsData: ClinicData[] = [
  {
    id: 1,
    slug: "eunoia-clinic",
    name: "Eunoia Clinic",
    cardImage: logo("/images/clinics/eunoia-clinic/logo.png", "Eunoia Clinic"),
    logo: logo("/images/clinics/eunoia-clinic/logo.png", "Eunoia Clinic"),
    gallery: [
      banner(
        "/images/clinics/eunoia-clinic/banner-all-pages-new-scaled.jpg",
        "Eunoia Clinic front desk banner",
      ),
      banner(
        "/images/clinics/eunoia-clinic/Clinical-Traning.jpg",
        "Eunoia Clinic training session",
      ),
    ],
    address: "First Tower - 2nd Floor, Way 6829 - Al Athiba, Azaiba, Muscat, Oman",
    coordinates: { lat: 23.5945, lng: 58.4237 },
    description:
      "Eunoia Clinic focuses on improving the quality of life for individuals and families by providing compassionate mental health care. The clinic offers culturally sensitive, evidence-based services including psychotherapy for adults, play therapy, trauma-focused care, and ADHD and cognitive assessments for children and adolescents.",
    workingHours: [
      { day: "Sunday", hours: "9:30 AM - 6:00 PM" },
      { day: "Monday", hours: "9:30 AM - 6:00 PM" },
      { day: "Tuesday", hours: "9:30 AM - 6:00 PM" },
      { day: "Wednesday", hours: "9:30 AM - 6:00 PM" },
      { day: "Thursday", hours: "9:30 AM - 6:00 PM" },
      { day: "Friday", hours: "Closed" },
      { day: "Saturday", hours: "Closed" },
    ],
    contact: {
      phone: "+968 24121188, +968 71580235",
      email: null,
      website: null,
    },
    acceptsInPerson: true,
    iconInfo: [
      { icon: User, label: "Multidisciplinary Therapy Team" },
      { icon: Star, label: "Specialities: Psychotherapy, ADHD Assessments, Play Therapy, Trauma Care" },
      { icon: Globe, label: "Languages not specified" },
    ],
    redirect: false,
  },
  {
    id: 2,
    slug: "hayat-counseling-center",
    name: "Hayat Counseling Center",
    cardImage: logo("/images/clinics/hayat-counseling-center/logo.jpg", "Hayat Counseling Center"),
    logo: logo("/images/clinics/hayat-counseling-center/logo.jpg", "Hayat Counseling Center"),
    gallery: [],
    address: "Al Khould, Oman",
    coordinates: { lat: 23.67, lng: 58.53 },
    description:
      "Hayat Counseling Center provides professional mental health services backed by over 13 years of experience. The center offers consultations for psychological, marital, family, professional, and developmental issues, as well as support for abuse-related concerns in a supportive and confidential environment.",
    workingHours: [
      { day: "Sunday", hours: "10:00 AM - 8:30 PM" },
      { day: "Monday", hours: "10:00 AM - 8:30 PM" },
      { day: "Tuesday", hours: "10:00 AM - 8:30 PM" },
      { day: "Wednesday", hours: "10:00 AM - 8:30 PM" },
      { day: "Thursday", hours: "10:00 AM - 8:30 PM" },
      { day: "Friday", hours: "Closed" },
      { day: "Saturday", hours: "Closed" },
    ],
    contact: {
      phone: "+968 96335662",
      email: null,
      website: null,
    },
    acceptsInPerson: true,
    iconInfo: [
      { icon: User, label: "Mental Health Specialists" },
      { icon: Star, label: "13+ Years Experience" },
      { icon: Globe, label: "Psychological, Marital, Family Counseling" },
    ],
    redirect: false,
  },
  {
    id: 3,
    slug: "al-harub-medical-center",
    name: "Al Harub Medical Center",
    cardImage: logo("/images/clinics/al-harub-medical-center/logo.png", "Al Harub Medical Center"),
    logo: logo("/images/clinics/al-harub-medical-center/logo.png", "Al Harub Medical Center"),
    gallery: [],
    address: "See website for address",
    coordinates: { lat: 23.61, lng: 58.45 },
    description:
      "Al Harub Medical Center provides medical services and healthcare solutions. Further clinic details and services can be found on their official website.",
    workingHours: [
      { day: "Monday", hours: "Not specified" },
      { day: "Tuesday", hours: "Not specified" },
      { day: "Wednesday", hours: "Not specified" },
      { day: "Thursday", hours: "Not specified" },
      { day: "Friday", hours: "Not specified" },
      { day: "Saturday", hours: "Not specified" },
      { day: "Sunday", hours: "Not specified" },
    ],
    contact: {
      phone: null,
      email: null,
      website: "https://alharubmedical.com/",
    },
    acceptsInPerson: true,
    iconInfo: [
      { icon: User, label: "Medical Specialists" },
      { icon: Star, label: "General Medical Services" },
      { icon: Globe, label: "More info: alharubmedical.com" },
    ],
    redirect: true,
    redirectUrl: "https://alharubmedical.com",
  },
  {
    id: 4,
    slug: "whispers-of-serenity-clinic",
    name: "Whispers of Serenity Clinic",
    cardImage: logo(
      "/images/clinics/whispers-of-serenity-clinic/logo.jpg",
      "Whispers of Serenity Clinic",
    ),
    logo: logo(
      "/images/clinics/whispers-of-serenity-clinic/logo.jpg",
      "Whispers of Serenity Clinic",
    ),
    gallery: [
      banner(
        "/images/clinics/whispers-of-serenity-clinic/img2.jpg",
        "Whispers of Serenity Clinic reception area",
      ),
      banner(
        "/images/clinics/whispers-of-serenity-clinic/img1.jpg",
        "Whispers of Serenity Clinic portrait poster",
        "contain",
        "soft",
      ),
    ],
    address:
      "North Athaiba, 18th Nov. St., Way #6848, Villa #3086 A, Muscat, Oman",
    coordinates: { lat: 23.588, lng: 58.3829 },
    description:
      "Whispers of Serenity Clinic is one of the pioneering private mental health clinics in Oman. Established in 2011, it provides holistic psychological support through counseling, hypnotherapy, marriage counseling, and child and teen therapy. The clinic promotes emotional resilience and balanced mental well-being.",
    workingHours: [
      { day: "Sunday", hours: "9:30 AM - 2:00 PM | 3:00 PM - 8:00 PM" },
      { day: "Monday", hours: "9:30 AM - 2:00 PM | 3:00 PM - 8:00 PM" },
      { day: "Tuesday", hours: "9:30 AM - 2:00 PM | 3:00 PM - 8:00 PM" },
      { day: "Wednesday", hours: "9:30 AM - 2:00 PM | 3:00 PM - 8:00 PM" },
      { day: "Thursday", hours: "9:30 AM - 2:00 PM | 3:00 PM - 8:00 PM" },
      { day: "Friday", hours: "Closed" },
      { day: "Saturday", hours: "Closed" },
    ],
    contact: {
      phone: "+968 99359779, +968 95717168",
      email: "info@whispers-of-serenity.com",
      website: "https://www.whispers-of-serenity.com",
    },
    acceptsInPerson: true,
    iconInfo: [
      { icon: User, label: "Counselors, Psychologists & Therapists" },
      { icon: Star, label: "Specialities: Hypnotherapy, Marriage Counseling, Child & Teen Therapy" },
      { icon: Globe, label: "Languages not specified" },
    ],
    redirect: false,
  },
  {
    id: 5,
    slug: "ehtewa-mental-health-clinic",
    name: "Ehtewa Mental Health Clinic",
    cardImage: logo("/images/clinics/ehtewa-mental-health-clinic/logo.jpg", "Ehtewa Mental Health Clinic"),
    logo: logo("/images/clinics/ehtewa-mental-health-clinic/logo.jpg", "Ehtewa Mental Health Clinic"),
    gallery: [
      banner(
        "/images/clinics/ehtewa-mental-health-clinic/img1.jpg",
        "Ehtewa Mental Health Clinic poster",
        "contain",
        "soft",
      ),
      banner(
        "/images/clinics/ehtewa-mental-health-clinic/img2.jpg",
        "Ehtewa Mental Health Clinic poster",
        "contain",
        "soft",
      ),
    ],
    address:
      "Al Mawaleh Al Janubiyya, Al-Izdihar Street, Seeb, Muscat, Oman",
    coordinates: { lat: 23.65, lng: 58.4 },
    description:
      "Ehtewa Mental Health Clinic is a specialized psychological care facility offering psychiatry and family therapy services. The clinic focuses on evidence-based practices to help individuals and families achieve emotional balance and long-term mental well-being.",
    workingHours: [
      { day: "Sunday", hours: "10:00 AM - 9:00 PM" },
      { day: "Monday", hours: "10:00 AM - 9:00 PM" },
      { day: "Tuesday", hours: "10:00 AM - 9:00 PM" },
      { day: "Wednesday", hours: "10:00 AM - 9:00 PM" },
      { day: "Thursday", hours: "10:00 AM - 9:00 PM" },
      { day: "Friday", hours: "Closed" },
      { day: "Saturday", hours: "10:00 AM - 4:00 PM" },
    ],
    contact: {
      phone: "+968 72201479, +968 94440989",
      email: null,
      website: null,
    },
    acceptsInPerson: true,
    iconInfo: [
      { icon: User, label: "Psychiatry & Family Therapy Specialists" },
      { icon: Star, label: "Evidence-Based Psychological Care" },
      { icon: Globe, label: "Languages not specified" },
    ],
    redirect: false,
  },
];

export const getClinicById = (id: number) =>
  clinicsData.find((clinic) => clinic.id === id) ?? clinicsData[0];
