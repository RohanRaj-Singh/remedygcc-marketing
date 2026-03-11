import type { Metadata } from "next";
import "./globals.css";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export const metadata: Metadata = {
  title: "Remedy GCC | Natural Healing & Professional Therapy",
  description: "Experience modern healthcare with traditional values. Connect with certified therapists for physical therapy, chiropractic care, massage therapy, and acupuncture.",
  keywords: "healthcare, physical therapy, chiropractic, massage therapy, acupuncture, wellness, Remedy GCC",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Header />
        <main className="mt-20 lg:mt-0">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
