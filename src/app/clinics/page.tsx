import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Star, Heart, Video, User, Globe, Sofa } from "lucide-react";

export const metadata: Metadata = {
  title: "Clinics | Remedy GCC",
  description: "Find our partner clinics offering physical therapy, chiropractic care, massage therapy, and acupuncture services near you.",
};

const clinics = [
  {
    id: 1,
    name: "Eunoia Clinic",
    image: "https://placehold.co/450x450",
    address: "First Tower - 2nd Floor, Way 6829 - Al Athiba, Azaiba, Muscat, Oman",
    acceptsInPerson: true,
    iconInfo: [
      { icon: User, label: "Multidisciplinary Therapy Team" },
      { icon: Star, label: "Specialities: Psychotherapy, ADHD Assessments, Play Therapy, Trauma Care" },
      { icon: Globe, label: "Languages not specified" }
    ]
  },
  {
    id: 2,
    name: "Hayat Counseling Center",
    image: "https://placehold.co/450x450",
    address: "Al Khould, Oman",
    acceptsInPerson: true,
    iconInfo: [
      { icon: User, label: "Mental Health Specialists" },
      { icon: Star, label: "13+ Years Experience" },
      { icon: Globe, label: "Psychological, Marital, Family Counseling" }
    ]
  },
  {
    id: 3,
    name: "Al Harub Medical Center",
    image: "https://placehold.co/450x450",
    address: "Address not specified (See website)",
    acceptsInPerson: true,
    iconInfo: [
      { icon: User, label: "Medical Specialists" },
      { icon: Star, label: "General Medical Services" },
      { icon: Globe, label: "More info: alharubmedical.com" }
    ]
  },
  {
    id: 4,
    name: "Whispers of Serenity Clinic",
    image: "https://placehold.co/450x450",
    address: "North Athaiba, 18th Nov. St., Way #6848, Villa #3086 A, Muscat, Oman",
    acceptsInPerson: true,
    iconInfo: [
      { icon: User, label: "Counselors, Psychologists & Therapists" },
      { icon: Star, label: "Specialities: Hypnotherapy, Marriage Counseling, Child & Teen Therapy" },
      { icon: Globe, label: "Languages not specified" }
    ]
  },
  {
    id: 5,
    name: "Ehtewa Mental Health Clinic",
    image: "https://placehold.co/450x450",
    address: "Al Mawaleh Al Janubiyya, Al-Izdihar Street, Seeb, Muscat, Oman",
    acceptsInPerson: true,
    iconInfo: [
      { icon: User, label: "Psychiatry & Family Therapy Specialists" },
      { icon: Star, label: "Evidence-Based Psychological Care" },
      { icon: Globe, label: "Languages not specified" }
    ]
  }
];

export default function ClinicsPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-white pt-28 pb-10">
      {/*Padding top 28 added because of fixed header */}
      <div className="text-center px-4">
        <div className="mb-8">
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary font-satoshi font-bold rounded-full text-sm mb-4">
            Our Clinics
          </span>
          <h1 className="text-5xl md:text-7xl font-roca-one text-primary mb-4">
            Find Your Clinic
          </h1>
          <p className="text-xl text-gray-600 font-satoshi max-w-2xl mx-auto">
            Discover our network of partner clinics providing professional natural healing 
            services in convenient locations.
          </p>
        </div>
        
        {/* <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-satoshi font-bold rounded-lg hover:bg-primary/90 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Home
          </Link>
        </div> */}
        
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-4">
          {clinics.map(clinic => (
            <Link key={clinic.id} href={`/clinics/${clinic.id}`} className="group relative bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-[shadow,transform] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-105 block">
              <div className="w-[450px] h-[450px] mx-auto mb-6">
                <img 
                  src={clinic.image} 
                  alt={clinic.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 pb-4">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-roca-one text-lg text-primary pr-4 text-start">{clinic.name}</h3>
                  <div className="flex items-center space-x-4 relative">
                    {/* Sofa Icon with Tooltip */}
                    <div className="relative group/tooltip">
                      <Sofa className="h-5 w-5 text-primary cursor-pointer" />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs font-satoshi rounded-md opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                        In-person
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                    {/* Video Icon with Tooltip */}
                    <div className="relative group/tooltip">
                      <Video className="h-5 w-5 text-primary cursor-pointer" />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs font-satoshi rounded-md opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                        Video
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 font-satoshi mb-4 text-start">{clinic.address}</p>
            
                 
                {/* Reveal all info icons on hover for the hovered card */}
                <div className="group-hover:opacity-100 group-hover:h-auto opacity-0 h-0 overflow-hidden transition-[opacity,height] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]">
                  <div className="flex flex-col items-start gap-2 mb-4">
                    {clinic.iconInfo.map((info, index) => (
                      <div key={index} className="flex flex-row items-center gap-2">
                        <info.icon className="h-5 w-5 text-primary" />
                        <span className="text-xs font-satoshi text-gray-600 text-start">{info.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
