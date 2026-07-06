const en = {
  common: {
    siteName: "Remedy",
    tagline: "Professional Therapy",
  },
  header: {
    howItWorks: "How it works",
    ourTherapists: "Our Therapists",
    clinics: "Clinics",
    about: "About Remedy",
  },
  hero: {
    title1: "Your Path to",
    title2: "Natural Healing",
    cta: "Get Started",
  },
  product: {
    label: "Our Product",
    title1: "Modern Healthcare,",
    title2: "Traditional Values",
    description:
      "Experience healthcare reimagined. We combine cutting-edge technology with holistic approaches to help you achieve optimal wellness. Our platform makes it easy to connect with the best therapists in your area.",
    features: {
      quickAppointments: {
        title: "Quick Appointments",
        description: "Book your visit in seconds, not hours. Same-day availability.",
      },
      verifiedTherapists: {
        title: "Verified Therapists",
        description: "Every therapist is licensed, vetted, and highly qualified.",
      },
      personalizedCare: {
        title: "Personalized Care",
        description: "Treatment plans tailored to your unique health needs.",
      },
    },
  },
  therapists: {
    label: "Our Therapists",
    title: "Meet Our Expert Team",
    description:
      "Our team of certified therapists is dedicated to providing you with the highest quality care. Each member brings unique expertise and a compassionate approach to your healing journey.",
    comingSoon: "Certified professionals coming soon",
    specialties: {
      physicalTherapy: "Physical Therapy",
      chiropracticCare: "Chiropractic Care",
      massageTherapy: "Massage Therapy",
      acupuncture: "Acupuncture",
    },
    therapistNames: {
      sarahJohnson: "Dr. Sarah Johnson",
      michaelChen: "Dr. Michael Chen",
      emilyWilliams: "Dr. Emily Williams",
      jamesRodriguez: "Dr. James Rodriguez",
      lisaThompson: "Dr. Lisa Thompson",
      davidKim: "Dr. David Kim",
    },
  },
  clinics: {
    label: "Our Clinics",
    title: "Find Your Clinic",
    description:
      "Discover our network of partner clinics providing professional services in convenient locations.",
    loading: "Loading clinics...",
    empty: "No clinics available at the moment.",
    details: {
      backToClinics: "Back to Clinics",
      aboutClinic: "About Clinic",
      workingHours: "Working Hours",
      address: "Address",
      contactInformation: "Contact Information",
      closed: "Closed",
      notSpecified: "Not specified",
      inPerson: "In-person",
      video: "Video",
    },
  },
  howItWorks: {
    label: "Coming Soon",
    title: "How It Works",
    description:
      "Our platform connects you with licensed psychologists through a secure, private portal designed to provide professional mental health support at no out-of-pocket cost to you. By utilizing our integrated reimbursement plan, you can access personalized therapy sessions and expert guidance without the burden of upfront fees or complex paperwork. This seamless, 100% confidential service ensures your well-being is fully supported by your company while your privacy remains strictly protected.",
    backToHome: "Back to Home",
    steps: {
      browse: {
        title: "Browse clinics",
        description: "Explore our network of certified professionals.",
      },
      book: {
        title: "Book Appointment",
        description: "Contact the clinic to schedule a session that fits your needs.",
      },
      free: {
        title: "Free Therapy Sessions",
        description:
          "Zero cost. Our seamless program ensures your mental health support is fully covered.",
      },
      heal: {
        title: "Start Healing",
        description: "Begin your journey to wellness.",
      },
    },
  },
  about: {
    label: "Coming Soon",
    title: "About Remedy GCC",
    description:
      "We're on a mission to revolutionize healthcare by connecting people with certified therapists for natural healing and professional therapy services.",
    backToHome: "Back to Home",
    cards: {
      naturalHealing: {
        title: "Natural Healing",
        description: "Embracing traditional and modern holistic approaches to wellness",
      },
      expertCare: {
        title: "Expert Care",
        description: "Network of certified and experienced healthcare professionals",
      },
      community: {
        title: "Community",
        description: "Building a healthier community through accessible care",
      },
    },
  },
  footer: {
    copyright: "All rights reserved.",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    columns: {
      company: {
        title: "Company",
        links: {
          aboutUs: "About Us",
          careers: "Careers",
          press: "Press",
          blog: "Blog",
        },
      },
      services: {
        title: "Services",
        links: {
          physicalTherapy: "Physical Therapy",
          chiropracticCare: "Chiropractic Care",
          massageTherapy: "Massage Therapy",
          acupuncture: "Acupuncture",
        },
      },
      support: {
        title: "Support",
        links: {
          contactUs: "Contact Us",
          faqs: "FAQs",
          insurance: "Insurance",
          patientPortal: "Patient Portal",
        },
      },
      legal: {
        title: "Legal",
        links: {
          privacyPolicy: "Privacy Policy",
          termsOfService: "Terms of Service",
          hipaaCompliance: "HIPAA Compliance",
          accessibility: "Accessibility",
        },
      },
    },
  },
} as const;

export default en;
export type EnLocale = typeof en;
