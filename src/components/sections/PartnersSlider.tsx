'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Container from '../layout/Container';

// Placeholder partner logos - in production, replace with actual logos
const partners = [
  { id: 1, name: 'Partner 1', initials: 'P1' },
  { id: 2, name: 'Partner 2', initials: 'P2' },
  { id: 3, name: 'Partner 3', initials: 'P3' },
  { id: 4, name: 'Partner 4', initials: 'P4' },
  { id: 5, name: 'Partner 5', initials: 'P5' },
];

export default function PartnersSlider() {
  return (
    <section className="py-16 bg-gray-50 overflow-hidden">
      <Container>
        {/* Infinite scrolling logo carousel */}
        <div className="relative">
          <div className="flex gap-12 items-center">
            {/* Duplicate the logos for infinite scroll effect */}
            {[...partners, ...partners, ...partners].map((partner, index) => (
              <motion.div
                key={`${partner.id}-${index}`}
                className="flex-shrink-0 flex items-center justify-center"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="w-32 h-16 md:w-40 md:h-20 bg-white rounded-lg flex items-center justify-center shadow-sm hover:shadow-md transition-shadow duration-300">
                  <span className="font-roca-one text-xl text-primary">
                    {partner.initials}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
