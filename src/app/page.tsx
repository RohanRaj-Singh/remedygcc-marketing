// TEMPORARY: Clinics page set as homepage for testing
// TODO: Revert to original homepage content when done
import ClinicsPage from "./clinics/page";

// Original imports (commented out for reference):
// import Hero from "../components/sections/Hero";
// import PartnersSlider from "../components/sections/PartnersSlider";
// import ProductSection from "../components/sections/ProductSection";
// import TherapistsGallery from "../components/sections/TherapistsGallery";

export default function Home() {
  return (
    <ClinicsPage />
  );
  
  // Original return statement:
  // return (
  //   <>
  //     <Hero />
  //     <PartnersSlider />
  //     <ProductSection />
  //     <TherapistsGallery />
  //   </>
  // );
}
