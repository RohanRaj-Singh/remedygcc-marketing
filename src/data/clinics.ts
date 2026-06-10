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
  /** Arabic clinic name */
  nameAr: string;
  cardImage: ClinicMedia;
  logo: ClinicMedia;
  gallery: ClinicMedia[];
  address: string;
  /** Arabic address */
  addressAr: string;
  coordinates: { lat: number; lng: number };
  /** Google Maps URL for directions */
  googleMapsUrl: string;
  description: string;
  /** Arabic description */
  descriptionAr: string;
  workingHours: ClinicWorkingHour[];
  /** Working hours with Arabic day names */
  workingHoursAr: ClinicWorkingHour[];
  contact: ClinicContact;
  acceptsInPerson: boolean;
  iconInfo: ClinicIconInfo[];
  /** Arabic labels for iconInfo */
  iconInfoAr: { icon: LucideIcon; label: string }[];
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
    nameAr: "عيادة يونويا",
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
    addressAr: "البرج الأول - الطابق الثاني، طريق 6829 - العذيبة، أزايبة، مسقط، عمان",
    coordinates: { lat: 23.5927, lng: 58.3741 },
    googleMapsUrl: "https://www.google.com/maps/dir/?api=1&destination=23.5927,58.3741",
    description:
      "Eunoia Clinic focuses on improving the quality of life for individuals and families by providing compassionate mental health care. The clinic offers culturally sensitive, evidence-based services including psychotherapy for adults, play therapy, trauma-focused care, and ADHD and cognitive assessments for children and adolescents.",
    descriptionAr:
      "تركز عيادة يونويا على تحسين جودة الحياة للأفراد والعائلات من خلال تقديم رعاية صحية نفسية متعاطفة. تقدم العيادة خدمات قائمة على الأدلة وحساسة ثقافياً تشمل العلاج النفسي للبالغين والعلاج باللعب والرعاية المركزة على الصدمات وتقييمات فرط الحركة وتشتت الانتباه والإدراك للأطفال والمراهقين.",
    workingHours: [
      { day: "Sunday", hours: "9:30 AM - 6:00 PM" },
      { day: "Monday", hours: "9:30 AM - 6:00 PM" },
      { day: "Tuesday", hours: "9:30 AM - 6:00 PM" },
      { day: "Wednesday", hours: "9:30 AM - 6:00 PM" },
      { day: "Thursday", hours: "9:30 AM - 6:00 PM" },
      { day: "Friday", hours: "Closed" },
      { day: "Saturday", hours: "Closed" },
    ],
    workingHoursAr: [
      { day: "الأحد", hours: "٩:٣٠ صباحاً - ٦:٠٠ مساءً" },
      { day: "الإثنين", hours: "٩:٣٠ صباحاً - ٦:٠٠ مساءً" },
      { day: "الثلاثاء", hours: "٩:٣٠ صباحاً - ٦:٠٠ مساءً" },
      { day: "الأربعاء", hours: "٩:٣٠ صباحاً - ٦:٠٠ مساءً" },
      { day: "الخميس", hours: "٩:٣٠ صباحاً - ٦:٠٠ مساءً" },
      { day: "الجمعة", hours: "مغلق" },
      { day: "السبت", hours: "مغلق" },
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
    iconInfoAr: [
      { icon: User, label: "فريق علاجي متعدد التخصصات" },
      { icon: Star, label: "التخصصات: العلاج النفسي، تقييمات فرط الحركة، العلاج باللعب، رعاية الصدمات" },
      { icon: Globe, label: "اللغات غير محددة" },
    ],
    redirect: false,
  },
  {
    id: 2,
    slug: "hayat-counseling-center",
    name: "Hayat Counseling Center",
    nameAr: "مركز حياة للاستشارات",
    cardImage: logo("/images/clinics/hayat-counseling-center/logo.jpg", "Hayat Counseling Center"),
    logo: logo("/images/clinics/hayat-counseling-center/logo.jpg", "Hayat Counseling Center"),
    gallery: [],
    address: "Al Khould, Oman",
    addressAr: "الخوض، عمان",
    coordinates: { lat: 23.6419, lng: 58.1845 },
    googleMapsUrl: "https://www.google.com/maps/dir/?api=1&destination=23.6419,58.1845",
    description:
      "Hayat Counseling Center provides professional mental health services backed by over 13 years of experience. The center offers consultations for psychological, marital, family, professional, and developmental issues, as well as support for abuse-related concerns in a supportive and confidential environment.",
    descriptionAr:
      "يقدم مركز حياة للاستشارات خدمات صحة نفسية مهنية مدعومة بأكثر من ١٣ عاماً من الخبرة. يقدم المركز استشارات نفسية وزوجية وأسرية ومهنية وتنموية بالإضافة إلى دعم القضايا المتعلقة بالإساءة في بيئة داعمة وسرية.",
    workingHours: [
      { day: "Sunday", hours: "10:00 AM - 8:30 PM" },
      { day: "Monday", hours: "10:00 AM - 8:30 PM" },
      { day: "Tuesday", hours: "10:00 AM - 8:30 PM" },
      { day: "Wednesday", hours: "10:00 AM - 8:30 PM" },
      { day: "Thursday", hours: "10:00 AM - 8:30 PM" },
      { day: "Friday", hours: "Closed" },
      { day: "Saturday", hours: "Closed" },
    ],
    workingHoursAr: [
      { day: "الأحد", hours: "١٠:٠٠ صباحاً - ٨:٣٠ مساءً" },
      { day: "الإثنين", hours: "١٠:٠٠ صباحاً - ٨:٣٠ مساءً" },
      { day: "الثلاثاء", hours: "١٠:٠٠ صباحاً - ٨:٣٠ مساءً" },
      { day: "الأربعاء", hours: "١٠:٠٠ صباحاً - ٨:٣٠ مساءً" },
      { day: "الخميس", hours: "١٠:٠٠ صباحاً - ٨:٣٠ مساءً" },
      { day: "الجمعة", hours: "مغلق" },
      { day: "السبت", hours: "مغلق" },
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
    iconInfoAr: [
      { icon: User, label: "أخصائيو الصحة النفسية" },
      { icon: Star, label: "أكثر من ١٣ عاماً من الخبرة" },
      { icon: Globe, label: "استشارات نفسية، زوجية، أسرية" },
    ],
    redirect: false,
  },
  {
    id: 3,
    slug: "al-harub-medical-center",
    name: "Al Harub Medical Center",
    nameAr: "مركز الحاروب الطبي",
    cardImage: logo("/images/clinics/al-harub-medical-center/logo.png", "Al Harub Medical Center"),
    logo: logo("/images/clinics/al-harub-medical-center/logo.png", "Al Harub Medical Center"),
    gallery: [],
    address: "Way 2830, House 2264, Al Kharijiyah Street, Al Shatti Al-Qurum, Muscat, Oman",
    addressAr: "طريق ٢٨٣٠، منزل ٢٢٦٤، شارع الخريجية، الشاطئ القرم، مسقط، عمان",
    coordinates: { lat: 23.617, lng: 58.4704 },
    googleMapsUrl: "https://www.google.com/maps/dir/?api=1&destination=23.617,58.4704",
    description:
      "Al Harub Medical Center provides medical services and healthcare solutions. Further clinic details and services can be found on their official website.",
    descriptionAr:
      "يقدم مركز الحاروب الطبي الخدمات الطبية وحلول الرعاية الصحية. يمكن العثور على تفاصيل العيادة والخدمات الإضافية على موقعهم الرسمي.",
    workingHours: [
      { day: "Monday", hours: "Not specified" },
      { day: "Tuesday", hours: "Not specified" },
      { day: "Wednesday", hours: "Not specified" },
      { day: "Thursday", hours: "Not specified" },
      { day: "Friday", hours: "Not specified" },
      { day: "Saturday", hours: "Not specified" },
      { day: "Sunday", hours: "Not specified" },
    ],
    workingHoursAr: [
      { day: "الإثنين", hours: "غير محدد" },
      { day: "الثلاثاء", hours: "غير محدد" },
      { day: "الأربعاء", hours: "غير محدد" },
      { day: "الخميس", hours: "غير محدد" },
      { day: "الجمعة", hours: "غير محدد" },
      { day: "السبت", hours: "غير محدد" },
      { day: "الأحد", hours: "غير محدد" },
    ],
    contact: {
      phone: "+968 2460 0750, +968 9170 5886",
      email: "info@alharubmedical.com",
      website: "https://alharubmedical.com/",
    },
    acceptsInPerson: true,
    iconInfo: [
      { icon: User, label: "Medical Specialists" },
      { icon: Star, label: "General Medical Services" },
      { icon: Globe, label: "More info: alharubmedical.com" },
    ],
    iconInfoAr: [
      { icon: User, label: "أخصائيون طبيون" },
      { icon: Star, label: "خدمات طبية عامة" },
      { icon: Globe, label: "مزيد من المعلومات: alharubmedical.com" },
    ],
    redirect: true,
    redirectUrl: "https://alharubmedical.com",
  },
  {
    id: 4,
    slug: "whispers-of-serenity-clinic",
    name: "Whispers of Serenity Clinic",
    nameAr: "عيادة همسات السكينة",
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
    addressAr: "شمال العذيبة، شارع ١٨ نوفمبر، طريق ٦٨٤٨، فيلا ٣٠٨٦ أ، مسقط، عمان",
    coordinates: { lat: 23.588, lng: 58.3829 },
    googleMapsUrl: "https://www.google.com/maps/dir/?api=1&destination=23.588,58.3829",
    description:
      "Whispers of Serenity Clinic is one of the pioneering private mental health clinics in Oman. Established in 2011, it provides holistic psychological support through counseling, hypnotherapy, marriage counseling, and child and teen therapy. The clinic promotes emotional resilience and balanced mental well-being.",
    descriptionAr:
      "تعد عيادة همسات السكينة واحدة من أوائل عيادات الصحة النفسية الخاصة الرائدة في عمان. تأسست في عام ٢٠١١، وتقدم دعماً نفسياً شاملاً من خلال الاستشارات والعلاج بالتنويم المغناطيسي والاستشارات الزوجية وعلاج الأطفال والمراهقين. تعزز العيادة المرونة العاطفية والتوازن النفسي.",
    workingHours: [
      { day: "Sunday", hours: "9:30 AM - 2:00 PM | 3:00 PM - 8:00 PM" },
      { day: "Monday", hours: "9:30 AM - 2:00 PM | 3:00 PM - 8:00 PM" },
      { day: "Tuesday", hours: "9:30 AM - 2:00 PM | 3:00 PM - 8:00 PM" },
      { day: "Wednesday", hours: "9:30 AM - 2:00 PM | 3:00 PM - 8:00 PM" },
      { day: "Thursday", hours: "9:30 AM - 2:00 PM | 3:00 PM - 8:00 PM" },
      { day: "Friday", hours: "Closed" },
      { day: "Saturday", hours: "Closed" },
    ],
    workingHoursAr: [
      { day: "الأحد", hours: "٩:٣٠ صباحاً - ٢:٠٠ مساءً | ٣:٠٠ مساءً - ٨:٠٠ مساءً" },
      { day: "الإثنين", hours: "٩:٣٠ صباحاً - ٢:٠٠ مساءً | ٣:٠٠ مساءً - ٨:٠٠ مساءً" },
      { day: "الثلاثاء", hours: "٩:٣٠ صباحاً - ٢:٠٠ مساءً | ٣:٠٠ مساءً - ٨:٠٠ مساءً" },
      { day: "الأربعاء", hours: "٩:٣٠ صباحاً - ٢:٠٠ مساءً | ٣:٠٠ مساءً - ٨:٠٠ مساءً" },
      { day: "الخميس", hours: "٩:٣٠ صباحاً - ٢:٠٠ مساءً | ٣:٠٠ مساءً - ٨:٠٠ مساءً" },
      { day: "الجمعة", hours: "مغلق" },
      { day: "السبت", hours: "مغلق" },
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
    iconInfoAr: [
      { icon: User, label: "استشاريون وأخصائيو نفس ومعالجون" },
      { icon: Star, label: "التخصصات: التنويم المغناطيسي، استشارات زوجية، علاج الأطفال والمراهقين" },
      { icon: Globe, label: "اللغات غير محددة" },
    ],
    redirect: false,
  },
  {
    id: 5,
    slug: "ehtewa-mental-health-clinic",
    name: "Ehtewa Mental Health Clinic",
    nameAr: "عيادة احتواء للصحة النفسية",
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
    addressAr: "الموالح الجنوبية، شارع الإزدهار، السيب، مسقط، عمان",
    coordinates: { lat: 23.5963, lng: 58.1964 },
    googleMapsUrl: "https://www.google.com/maps/dir/?api=1&destination=23.5963,58.1964",
    description:
      "Ehtewa Mental Health Clinic is a specialized psychological care facility offering psychiatry and family therapy services. The clinic focuses on evidence-based practices to help individuals and families achieve emotional balance and long-term mental well-being.",
    descriptionAr:
      "عيادة احتواء للصحة النفسية هي منشأة رعاية نفسية متخصصة تقدم خدمات الطب النفسي والعلاج الأسري. تركز العيادة على الممارسات القائمة على الأدلة لمساعدة الأفراد والعائلات على تحقيق التوازن العاطفي والرفاهية النفسية على المدى الطويل.",
    workingHours: [
      { day: "Sunday", hours: "10:00 AM - 9:00 PM" },
      { day: "Monday", hours: "10:00 AM - 9:00 PM" },
      { day: "Tuesday", hours: "10:00 AM - 9:00 PM" },
      { day: "Wednesday", hours: "10:00 AM - 9:00 PM" },
      { day: "Thursday", hours: "10:00 AM - 9:00 PM" },
      { day: "Friday", hours: "Closed" },
      { day: "Saturday", hours: "10:00 AM - 4:00 PM" },
    ],
    workingHoursAr: [
      { day: "الأحد", hours: "١٠:٠٠ صباحاً - ٩:٠٠ مساءً" },
      { day: "الإثنين", hours: "١٠:٠٠ صباحاً - ٩:٠٠ مساءً" },
      { day: "الثلاثاء", hours: "١٠:٠٠ صباحاً - ٩:٠٠ مساءً" },
      { day: "الأربعاء", hours: "١٠:٠٠ صباحاً - ٩:٠٠ مساءً" },
      { day: "الخميس", hours: "١٠:٠٠ صباحاً - ٩:٠٠ مساءً" },
      { day: "الجمعة", hours: "مغلق" },
      { day: "السبت", hours: "١٠:٠٠ صباحاً - ٤:٠٠ مساءً" },
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
    iconInfoAr: [
      { icon: User, label: "أخصائيو الطب النفسي والعلاج الأسري" },
      { icon: Star, label: "رعاية نفسية قائمة على الأدلة" },
      { icon: Globe, label: "اللغات غير محددة" },
    ],
    redirect: false,
  },
  {
    id: 6,
    slug: "nine-wellness-centre",
    name: "Nine – Pregnancy, Mother & Child Wellness Centre",
    nameAr: "ناين – مركز صحة الأم والطفل والعائلة",
    cardImage: {
      src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%230F412E' rx='30'/%3E%3Ctext x='200' y='220' text-anchor='middle' font-family='Georgia,serif' font-size='80' fill='white' font-weight='bold'%3ENine%3C/text%3E%3C/svg%3E",
      alt: "Nine Wellness Centre logo",
      fit: "contain",
      background: "white",
    },
    logo: {
      src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%230F412E' rx='30'/%3E%3Ctext x='200' y='220' text-anchor='middle' font-family='Georgia,serif' font-size='80' fill='white' font-weight='bold'%3ENine%3C/text%3E%3C/svg%3E",
      alt: "Nine Wellness Centre logo",
      fit: "contain",
      background: "white",
    },
    gallery: [],
    address: "Muscat, Oman",
    addressAr: "مسقط، عمان",
    coordinates: { lat: 23.5965, lng: 58.4409 },
    googleMapsUrl: "https://www.google.com/maps/dir/?api=1&destination=23.5965,58.4409",
    description:
      "Nine is a family-centred wellness and healthcare hub dedicated to supporting women, babies, and families through every stage of the parenting journey. From pregnancy and birth preparation to postpartum recovery and early childhood development, Nine provides expert care, education, and wellness services in a warm and nurturing environment. Our multidisciplinary team offers prenatal and postnatal care, midwife consultations, childbirth education, pregnancy and family wellness programs, baby development activities, breastfeeding support, and specialized services designed to empower parents with knowledge, confidence, and compassionate care. At Nine, we believe every family deserves personalized support, informed choices, and a positive experience from pregnancy throughout parenthood.",
    descriptionAr:
      "ناين هو مركز صحي وعائلي مخصص لدعم النساء والأطفال والعائلات في كل مرحلة من رحلة الأبوة. من التحضير للحمل والولادة إلى التعافي بعد الولادة ونمو الطفولة المبكرة، يقدم ناين رعاية خبراء وتعليماً وخدمات صحية في بيئة دافئة وراعية. يقدم فريقنا متعدد التخصصات رعاية ما قبل وبعد الولادة واستشارات القابلات والتثقيف حول الولادة وبرامج صحة الحمل والأسرة وأنشطة نمو الطفل ودعم الرضاعة الطبيعية وخدمات متخصصة مصممة لتمكين الوالدين بالمعرفة والثقة والرعاية المتعاطفة. في ناين، نؤمن بأن كل عائلة تستحق دعماً مخصصاً وخيارات مستنيرة وتجربة إيجابية من الحمل إلى الأبوة.",
    workingHours: [
      { day: "Sunday", hours: "5:00 PM, 6:00 PM, 7:00 PM (Physical Visit)" },
      { day: "Monday", hours: "Closed" },
      { day: "Tuesday", hours: "5:00 PM, 6:00 PM, 7:00 PM (Online Session)" },
      { day: "Wednesday", hours: "Closed" },
      { day: "Thursday", hours: "10:00 AM, 11:00 AM, 12:00 PM (Physical Visit)" },
      { day: "Friday", hours: "Closed" },
      { day: "Saturday", hours: "Closed" },
    ],
    workingHoursAr: [
      { day: "الأحد", hours: "٥:٠٠ مساءً، ٦:٠٠ مساءً، ٧:٠٠ مساءً (زيارة حضورية)" },
      { day: "الإثنين", hours: "مغلق" },
      { day: "الثلاثاء", hours: "٥:٠٠ مساءً، ٦:٠٠ مساءً، ٧:٠٠ مساءً (جلسة عبر الإنترنت)" },
      { day: "الأربعاء", hours: "مغلق" },
      { day: "الخميس", hours: "١٠:٠٠ صباحاً، ١١:٠٠ صباحاً، ١٢:٠٠ ظهراً (زيارة حضورية)" },
      { day: "الجمعة", hours: "مغلق" },
      { day: "السبت", hours: "مغلق" },
    ],
    contact: {
      phone: "+968 77103166, +968 24124877",
      email: "ninecenter.oman@gmail.com",
      website: null,
    },
    acceptsInPerson: true,
    iconInfo: [
      { icon: User, label: "Dr. Zakiya Al Busaidi & Multidisciplinary Team" },
      { icon: Star, label: "Specialities: Prenatal & Postnatal Care, Childbirth Education, Baby Development, Breastfeeding Support" },
      { icon: Globe, label: "Pregnancy, Mother & Child Wellness Centre" },
    ],
    iconInfoAr: [
      { icon: User, label: "د. زكية البوسعيدي وفريق متعدد التخصصات" },
      { icon: Star, label: "التخصصات: رعاية ما قبل وبعد الولادة، التثقيف حول الولادة، نمو الطفل، دعم الرضاعة" },
      { icon: Globe, label: "مركز صحة الأم والطفل والعائلة" },
    ],
    redirect: false,
  },
];

export const getClinicById = (id: number) =>
  clinicsData.find((clinic) => clinic.id === id) ?? clinicsData[0];
