'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import Container from './Container';

const navItems = [
  { label: 'How it works', href: '/how-it-works' },
  // { label: 'Our Therapists', href: '/therapists' },
  // { label: 'Clinics', href: '/clinics' },
  // { label: 'About Remedy', href: '/about' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <Container>
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="font-roca-one text-3xl text-primary">Remedy</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="font-satoshi font-bold text-lg text-primary hover:text-primary/80 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Side - Desktop */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Language Switch - Disabled */}
            <button
              disabled
              className="font-satoshi font-bold text-primary opacity-50 cursor-not-allowed px-3 py-2"
            >
              EN
            </button>

            {/* Log In Button */}
            {/* <button className="btn-secondary">
              Log In
            </button> */}

            {/* Get Started Button */}
            {/* <button className="btn-primary">
              Get Started
            </button> */}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-primary"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="font-satoshi font-bold text-lg text-primary hover:text-primary/80 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-gray-100">
                <button
                  disabled
                  className="font-satoshi font-bold text-primary opacity-50 text-left"
                >
                  EN
                </button>
                <button className="btn-secondary text-left">
                  Log In
                </button>
                <button className="btn-primary text-center">
                  Get Started
                </button>
              </div>
            </nav>
          </div>
        )}
      </Container>
    </header>
  );
}
