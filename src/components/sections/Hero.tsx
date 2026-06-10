'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Container from '../layout/Container';
import { useI18n } from '@/i18n/I18nContext';

export default function Hero() {
  const { t } = useI18n();

  return (
    <section className="min-h-screen flex items-center justify-center bg-primary pt-20">
      <Container>
        <div className="text-center">
          {/* Hero Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="font-roca-one text-hero-heading text-white mb-8"
          >
            {t('hero.title1')}
            <br />
            {t('hero.title2')}
          </motion.h1>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          >
            <button className="btn-primary text-xl px-10 py-4">
              {t('hero.cta')}
            </button>
          </motion.div>
        </div>
      </Container>

      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/4 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-1/2 -left-1/4 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl"></div>
      </div>
    </section>
  );
}
