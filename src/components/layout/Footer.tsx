'use client';

import React from 'react';
import Container from './Container';
import { useI18n } from '@/i18n/I18nContext';

export default function Footer() {
  const { t } = useI18n();

  const footerColumns = [
    {
      titleKey: 'footer.columns.company.title',
      links: [
        { labelKey: 'footer.columns.company.links.aboutUs', href: '#' },
        { labelKey: 'footer.columns.company.links.careers', href: '#' },
        { labelKey: 'footer.columns.company.links.press', href: '#' },
        { labelKey: 'footer.columns.company.links.blog', href: '#' },
      ],
    },
    {
      titleKey: 'footer.columns.services.title',
      links: [
        { labelKey: 'footer.columns.services.links.physicalTherapy', href: '#' },
        { labelKey: 'footer.columns.services.links.chiropracticCare', href: '#' },
        { labelKey: 'footer.columns.services.links.massageTherapy', href: '#' },
        { labelKey: 'footer.columns.services.links.acupuncture', href: '#' },
      ],
    },
    {
      titleKey: 'footer.columns.support.title',
      links: [
        { labelKey: 'footer.columns.support.links.contactUs', href: '#' },
        { labelKey: 'footer.columns.support.links.faqs', href: '#' },
        { labelKey: 'footer.columns.support.links.insurance', href: '#' },
        { labelKey: 'footer.columns.support.links.patientPortal', href: '#' },
      ],
    },
    {
      titleKey: 'footer.columns.legal.title',
      links: [
        { labelKey: 'footer.columns.legal.links.privacyPolicy', href: '#' },
        { labelKey: 'footer.columns.legal.links.termsOfService', href: '#' },
        { labelKey: 'footer.columns.legal.links.hipaaCompliance', href: '#' },
        { labelKey: 'footer.columns.legal.links.accessibility', href: '#' },
      ],
    },
  ];

  return (
    <footer className="bg-primary text-white pt-16 pb-8">
      <Container>
        {/* Footer Columns */}
        <div className="mb-12">
          <span className="font-roca-one text-4xl text-white">{t('common.siteName')}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {footerColumns.map((column) => (
            <div key={column.titleKey}>
              <h3 className="font-roca-one text-xl mb-4 relative pb-2">
                {t(column.titleKey)}
                <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-white/30"></span>
              </h3>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.labelKey}>
                    <a
                      href={link.href}
                      className="font-satoshi text-footer-text hover:text-white transition-colors"
                    >
                      {t(link.labelKey)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-white/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Left - Copyright */}
            <p className="font-satoshi text-footer-text text-sm">
              &copy; {new Date().getFullYear()} {t('common.siteName')} GCC. {t('footer.copyright')}
            </p>

            {/* Right - Links */}
            <div className="flex gap-6">
              <a
                href="#"
                className="font-satoshi text-footer-text hover:text-white text-sm transition-colors"
              >
                {t('footer.privacyPolicy')}
              </a>
              <a
                href="#"
                className="font-satoshi text-footer-text hover:text-white text-sm transition-colors"
              >
                {t('footer.termsOfService')}
              </a>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
