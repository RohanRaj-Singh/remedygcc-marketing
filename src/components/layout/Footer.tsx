import React from 'react';
import Container from './Container';

const footerColumns = [
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Press', href: '#' },
      { label: 'Blog', href: '#' },
    ],
  },
  {
    title: 'Services',
    links: [
      { label: 'Physical Therapy', href: '#' },
      { label: 'Chiropractic Care', href: '#' },
      { label: 'Massage Therapy', href: '#' },
      { label: 'Acupuncture', href: '#' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Contact Us', href: '#' },
      { label: 'FAQs', href: '#' },
      { label: 'Insurance', href: '#' },
      { label: 'Patient Portal', href: '#' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'HIPAA Compliance', href: '#' },
      { label: 'Accessibility', href: '#' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-primary text-white pt-16 pb-8">
      <Container>
        {/* Footer Columns */}
        <div className="mb-12">
          <span className="font-roca-one text-4xl text-white">Remedy</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* {footerColumns.map((column) => (
            <div key={column.title}>
              <h3 className="font-roca-one text-xl mb-4 relative pb-2">
                {column.title}
                <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-white/30"></span>
              </h3>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="font-satoshi text-footer-text hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))} */}
        </div>

        {/* Divider */}
        <div className="border-t border-white/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Left - Copyright */}
            <p className="font-satoshi text-footer-text text-sm">
              © {new Date().getFullYear()} Remedy GCC. All rights reserved.
            </p>

            {/* Right - Links */}
            <div className="flex gap-6">
              <a
                href="#"
                className="font-satoshi text-footer-text hover:text-white text-sm transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="font-satoshi text-footer-text hover:text-white text-sm transition-colors"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
