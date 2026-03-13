import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, MapPin, Phone, Mail, Globe } from "lucide-react";

export const metadata: Metadata = {
  title: "Clinic Details | Remedy GCC",
  description: "View clinic details, working hours, and contact information.",
};

const clinicsData = [
  {
    id: 1,
    name: "Eunoia Clinic",
    image: "https://placehold.co/800x800",
    gallery: [
      "https://placehold.co/800x800",
      "https://placehold.co/400x800",
      "https://placehold.co/400x800"
    ],
    address: "First Tower - 2nd Floor, Way 6829 - Al Athiba, Azaiba, Muscat, Oman",
    description:
      "Eunoia Clinic focuses on improving the quality of life for individuals and families by providing compassionate mental health care. The clinic offers culturally sensitive, evidence-based services including psychotherapy for adults, play therapy, trauma-focused care, and ADHD and cognitive assessments for children and adolescents.",
    workingHours: [
      { day: "Sunday", hours: "9:30 AM - 6:00 PM" },
      { day: "Monday", hours: "9:30 AM - 6:00 PM" },
      { day: "Tuesday", hours: "9:30 AM - 6:00 PM" },
      { day: "Wednesday", hours: "9:30 AM - 6:00 PM" },
      { day: "Thursday", hours: "9:30 AM - 6:00 PM" },
      { day: "Friday", hours: "Closed" },
      { day: "Saturday", hours: "Closed" }
    ],
    contact: {
      phone: "+968 24121188, +968 71580235",
      email: null,
      website: null
    }
  },

  {
    id: 2,
    name: "Hayat Counseling Center",
    image: "https://placehold.co/800x800",
    gallery: [
      "https://placehold.co/800x800",
      "https://placehold.co/400x800",
      "https://placehold.co/400x800"
    ],
    address: "Al Khould, Oman",
    description:
      "Hayat Counseling Center provides professional mental health services backed by over 13 years of experience. The center offers consultations for psychological, marital, family, professional, and developmental issues, as well as support for abuse-related concerns in a supportive and confidential environment.",
    workingHours: [
      { day: "Sunday", hours: "10:00 AM - 8:30 PM" },
      { day: "Monday", hours: "10:00 AM - 8:30 PM" },
      { day: "Tuesday", hours: "10:00 AM - 8:30 PM" },
      { day: "Wednesday", hours: "10:00 AM - 8:30 PM" },
      { day: "Thursday", hours: "10:00 AM - 8:30 PM" },
      { day: "Friday", hours: "Closed" },
      { day: "Saturday", hours: "Closed" }
    ],
    contact: {
      phone: "+968 96335662",
      email: null,
      website: null
    }
  },

  {
    id: 3,
    name: "Al Harub Medical Center",
    image: "https://placehold.co/800x800",
    gallery: [
      "https://placehold.co/800x800",
      "https://placehold.co/400x800",
      "https://placehold.co/400x800"
    ],
    address: null,
    description:
      "Al Harub Medical Center provides medical services and healthcare solutions. Further clinic details and services can be found on their official website.",
    workingHours: [
      { day: "Monday", hours: "Not specified" },
      { day: "Tuesday", hours: "Not specified" },
      { day: "Wednesday", hours: "Not specified" },
      { day: "Thursday", hours: "Not specified" },
      { day: "Friday", hours: "Not specified" },
      { day: "Saturday", hours: "Not specified" },
      { day: "Sunday", hours: "Not specified" }
    ],
    contact: {
      phone: null,
      email: null,
      website: "https://alharubmedical.com/"
    }
  },

  {
    id: 4,
    name: "Whispers of Serenity Clinic",
    image: "https://placehold.co/800x800",
    gallery: [
      "https://placehold.co/800x800",
      "https://placehold.co/400x800",
      "https://placehold.co/400x800"
    ],
    address:
      "North Athaiba, 18th Nov. St., Way #6848, Villa #3086 A, Muscat, Oman",
    description:
      "Whispers of Serenity Clinic is one of the pioneering private mental health clinics in Oman. Established in 2011, it provides holistic psychological support through counseling, hypnotherapy, marriage counseling, and child and teen therapy. The clinic promotes emotional resilience and balanced mental well-being.",
    workingHours: [
      { day: "Sunday", hours: "9:30 AM - 2:00 PM | 3:00 PM - 8:00 PM" },
      { day: "Monday", hours: "9:30 AM - 2:00 PM | 3:00 PM - 8:00 PM" },
      { day: "Tuesday", hours: "9:30 AM - 2:00 PM | 3:00 PM - 8:00 PM" },
      { day: "Wednesday", hours: "9:30 AM - 2:00 PM | 3:00 PM - 8:00 PM" },
      { day: "Thursday", hours: "9:30 AM - 2:00 PM | 3:00 PM - 8:00 PM" },
      { day: "Friday", hours: "Closed" },
      { day: "Saturday", hours: "Closed" }
    ],
    contact: {
      phone: "+968 99359779, +968 95717168",
      email: "info@whispers-of-serenity.com",
      website: "https://www.whispers-of-serenity.com"
    }
  },

  {
    id: 5,
    name: "Ehtewa Mental Health Clinic",
    image: "https://placehold.co/800x800",
    gallery: [
      "https://placehold.co/800x800",
      "https://placehold.co/400x800",
      "https://placehold.co/400x800"
    ],
    address:
      "Al Mawaleh Al Janubiyya, Al-Izdihar Street, Seeb, Muscat, Oman",
    description:
      "Ehtewa Mental Health Clinic is a specialized psychological care facility offering psychiatry and family therapy services. The clinic focuses on evidence-based practices to help individuals and families achieve emotional balance and long-term mental well-being.",
    workingHours: [
      { day: "Sunday", hours: "10:00 AM - 9:00 PM" },
      { day: "Monday", hours: "10:00 AM - 9:00 PM" },
      { day: "Tuesday", hours: "10:00 AM - 9:00 PM" },
      { day: "Wednesday", hours: "10:00 AM - 9:00 PM" },
      { day: "Thursday", hours: "10:00 AM - 9:00 PM" },
      { day: "Friday", hours: "Closed" },
      { day: "Saturday", hours: "10:00 AM - 4:00 PM" }
    ],
    contact: {
      phone: "+968 72201479, +968 94440989",
      email: null,
      website: null
    }
  }
];

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ClinicPage({ params }: PageProps) {
  const { id } = await params;
  const clinic = clinicsData.find(c => c.id === parseInt(id)) || clinicsData[0];

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
          {/* Clinic Title */}
          <h1 className="text-4xl md:text-5xl font-roca-one text-primary mb-4">
            {clinic.name}
          </h1>

          {/* Location */}
          <div className="flex items-center gap-2 text-gray-600 mb-8">
            <MapPin className="h-5 w-5" />
            <span className="font-satoshi">{clinic.address}</span>
          </div>

          {/* Image Gallery - Nearly Square Images */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            {/* Main Square Image */}
            <div className="md:col-span-2">
              <img 
                src={clinic.gallery[0]} 
                alt={clinic.name}
                className="w-full h-[500px] object-cover rounded-xl"
              />
            </div>
            {/* Two Vertical Square Images */}
            <div className="flex flex-col gap-4">
              <img 
                src={clinic.gallery[1]} 
                alt={`${clinic.name} - 2`}
                className="w-full h-[243px] object-cover rounded-xl"
              />
              <img 
                src={clinic.gallery[2]} 
                alt={`${clinic.name} - 3`}
                className="w-full h-[243px] object-cover rounded-xl"
              />
            </div>
          </div>

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
              <div className="bg-gray-100 rounded-xl h-[400px] flex items-center justify-center mb-6">
                <div className="text-center">
                  <MapPin className="h-16 w-16 text-primary mx-auto mb-3" />
                  <p className="text-gray-600 font-satoshi">{clinic.address}</p>
                </div>
              </div>

              {/* Contact Information Below Map */}
              <div>
                <h2 className="text-2xl font-roca-one text-primary mb-4">
                  Contact Information
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <Phone className="h-5 w-5 text-primary" />
                    <span className="font-satoshi text-gray-600">{clinic.contact.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <Mail className="h-5 w-5 text-primary" />
                    <span className="font-satoshi text-gray-600">{clinic.contact.email}</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <Globe className="h-5 w-5 text-primary" />
                    <span className="font-satoshi text-gray-600">{clinic.contact.website}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
