import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { I18nProvider } from "../i18n/I18nContext";
import { en, ar } from "../i18n/locales";

/**
 * Locale-aware root metadata.
 * Reads the "remedy-locale" cookie (set client-side when the user toggles
 * language) and returns matching title / description / keywords.
 */
export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const locale = cookieStore.get("remedy-locale")?.value === "ar" ? "ar" : "en";
  const dict = locale === "ar" ? ar : en;

  return {
    title: `${dict.common.siteName} | ${dict.common.tagline}`,
    description:
      locale === "ar"
        ? "اكتشف ريمدي جي سي سي - منصتنا تربطك بمعالجين معتمدين للعلاج الطبيعي والعناية بتقويم العمود الفقري والعلاج بالتدليك والوخز بالإبر."
        : "Experience modern healthcare with traditional values. Connect with certified therapists for physical therapy, chiropractic care, massage therapy, and acupuncture.",
    keywords:
      locale === "ar"
        ? "رعاية صحية, علاج طبيعي, تقويم العمود الفقري, علاج بالتدليك, وخز بالإبر, عافية, ريمدي جي سي سي"
        : "healthcare, physical therapy, chiropractic, massage therapy, acupuncture, wellness, Remedy GCC",
    icons: {
      icon: "/favicon.svg",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <I18nProvider>
          <Header />
          <main className="mt-20 lg:mt-0">{children}</main>
          <Footer />
        </I18nProvider>
      </body>
    </html>
  );
}
