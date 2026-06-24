'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import Container from './Container';
import { useI18n } from '@/i18n/I18nContext';

const navItems = [
  { labelKey: 'header.howItWorks' as const, href: '/how-it-works' },
];

/** Pill-shaped EN/AR toggle with active-state highlighting. */
function LangToggle() {
  const { locale, setLocale } = useI18n();

  const btnBase =
    "cursor-pointer rounded-full font-satoshi font-bold transition-all duration-200 " +
    "text-[10px] leading-none px-1.5 py-0.5 " +
    "lg:text-sm lg:px-3 lg:py-1.5";

  return (
    <div className="flex bg-gray-100 rounded-full p-0.5 shrink-0 leading-none">
      <button
        type="button"
        onClick={() => setLocale('en')}
        className={`${btnBase} ${
          locale === 'en'
            ? 'bg-primary text-white shadow-sm'
            : 'text-primary hover:bg-gray-200 active:bg-gray-300'
        }`}
        aria-pressed={locale === 'en'}
        aria-label="Switch to English"
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLocale('ar')}
        className={`${btnBase} ${
          locale === 'ar'
            ? 'bg-primary text-white shadow-sm'
            : 'text-primary hover:bg-gray-200 active:bg-gray-300'
        }`}
        aria-pressed={locale === 'ar'}
        aria-label="Switch to Arabic"
      >
        AR
      </button>
    </div>
  );
}

export default function Header() {
  const { t, locale, setLocale } = useI18n();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <Container>
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="font-roca-one text-3xl text-primary">{t('common.siteName')}</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.labelKey}
                href={item.href}
                className="font-satoshi font-bold text-lg text-primary hover:text-primary/80 transition-colors"
              >
                {t(item.labelKey)}
              </Link>
            ))}
          </nav>

          {/* Right Side - Desktop */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/reimbursement"
              className="font-satoshi font-bold text-sm text-primary border border-primary/30 rounded-lg px-4 py-2 hover:bg-primary hover:text-white transition-all duration-200"
            >
              Sign In
            </Link>
            {/* Language Switch */}
            <LangToggle />
          </div>

          {/* Mobile Header Right: language pill + hamburger */}
          <div className="flex lg:hidden items-center gap-1">
            <LangToggle />
            <button
              className="p-2 text-primary"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.labelKey}
                  href={item.href}
                  className="font-satoshi font-bold text-lg text-primary hover:text-primary/80 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t(item.labelKey)}
                </Link>
              ))}
              <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-gray-100">
                <Link
                  href="/reimbursement"
                  className="font-satoshi font-bold text-sm text-center text-primary border border-primary/30 rounded-lg px-4 py-2 hover:bg-primary hover:text-white transition-all duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
              </div>
            </nav>
          </div>
        )}
      </Container>
    </header>
  );
}
