'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Container from '../layout/Container';

// Placeholder therapist data - in production, this would come from an API
const therapists = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    specialty: 'Physical Therapy',
    image: 'therapist-1',
  },
  {
    id: 2,
    name: 'Dr. Michael Chen',
    specialty: 'Chiropractic Care',
    image: 'therapist-2',
  },
  {
    id: 3,
    name: 'Dr. Emily Williams',
    specialty: 'Massage Therapy',
    image: 'therapist-3',
  },
  {
    id: 4,
    name: 'Dr. James Rodriguez',
    specialty: 'Acupuncture',
    image: 'therapist-4',
  },
  {
    id: 5,
    name: 'Dr. Lisa Thompson',
    specialty: 'Physical Therapy',
    image: 'therapist-5',
  },
  {
    id: 6,
    name: 'Dr. David Kim',
    specialty: 'Chiropractic Care',
    image: 'therapist-6',
  },
];

export default function TherapistsGallery() {
  return (
    <section id="therapists" className="py-20 bg-gray-50">
      <Container>
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-satoshi font-bold text-primary uppercase tracking-wider text-sm mb-4 block"
          >
            Our Therapists
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-roca-one text-section-heading text-primary mb-6"
          >
            Meet Our Expert Team
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="font-satoshi text-paragraph text-text-gray max-w-2xl mx-auto"
          >
            Our team of certified therapists is dedicated to providing you with
            the highest quality care. Each member brings unique expertise and
            a compassionate approach to your healing journey.
          </motion.p>
        </div>

        {/* Masonry Gallery */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {therapists.map((therapist, index) => (
            <motion.div
              key={therapist.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="break-inside-avoid"
            >
              <div className="group relative overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-lg transition-all duration-300">
                {/* Image Placeholder */}
                <div className="aspect-[3/4] bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center overflow-hidden">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <span className="font-roca-one text-2xl text-primary">
                        {therapist.name.charAt(0)}
                      </span>
                    </div>
                  </div>
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300"></div>
                </div>

                {/* Info */}
                <div className="p-6">
                  <h3 className="font-roca-one text-xl text-primary mb-2">
                    {therapist.name}
                  </h3>
                  <p className="font-satoshi text-text-gray">
                    {therapist.specialty}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
