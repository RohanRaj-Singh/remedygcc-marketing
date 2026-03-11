'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Clock, Shield } from 'lucide-react';
import Container from '../layout/Container';

const features = [
  {
    icon: Clock,
    title: 'Quick Appointments',
    description: 'Book your visit in seconds, not hours. Same-day availability.',
  },
  {
    icon: Shield,
    title: 'Verified Therapists',
    description: 'Every therapist is licensed, vetted, and highly qualified.',
  },
  {
    icon: Check,
    title: 'Personalized Care',
    description: 'Treatment plans tailored to your unique health needs.',
  },
];

export default function ProductSection() {
  return (
    <section id="how-it-works" className="py-20 bg-white">
      <Container>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Content */}
          <div>
            {/* Label */}
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="font-satoshi font-bold text-primary uppercase tracking-wider text-sm mb-4 block"
            >
              Our Product
            </motion.span>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-roca-one text-section-heading text-primary mb-6"
            >
              Modern Healthcare,
              <br />
              Traditional Values
            </motion.h2>

            {/* Paragraph */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="font-satoshi text-paragraph text-text-gray mb-10"
            >
              Experience healthcare reimagined. We combine cutting-edge
              technology with holistic approaches to help you achieve optimal
              wellness. Our platform makes it easy to connect with the best
              therapists in your area.
            </motion.p>

            {/* Feature Boxes */}
            <div className="space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="flex gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-satoshi font-bold text-primary text-lg mb-1">
                      {feature.title}
                    </h3>
                    <p className="font-satoshi text-text-gray">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right - Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* Placeholder image with hover zoom effect */}
            <div className="aspect-[4/5] bg-gradient-to-br from-primary to-primary/70 rounded-2xl overflow-hidden group">
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center text-white p-8">
                  <div className="w-32 h-32 mx-auto mb-6 bg-white/10 rounded-full flex items-center justify-center">
                    <span className="font-roca-one text-4xl">R</span>
                  </div>
                  <p className="font-satoshi text-xl opacity-80">
                    Remedy GCC App
                  </p>
                  <p className="font-satoshi text-sm opacity-60 mt-2">
                    Coming Soon
                  </p>
                </div>
              </div>
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
