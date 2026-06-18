'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PRICING_TIERS } from '@/lib/mock-data';

// Helpers

function getAnnualPrice(monthlyPrice: string): string {
  const num = parseFloat(monthlyPrice.replace('$', ''));
  if (isNaN(num) || num === 0) return monthlyPrice;
  return `$${Math.round(num * 0.8)}`;
}

// PricingSection Component

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <section id="pricing" className="py-32 relative">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-indigo-500/[0.03] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <AnimatedSection className="text-center mb-12">
          <Badge variant="glow" className="mb-4">
            Pricing
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            Start free. Scale when you&apos;re ready.
          </p>
        </AnimatedSection>

        {/* Billing Toggle */}
        <AnimatedSection delay={0.1} className="flex justify-center mb-14">
          <div className="flex items-center gap-4 bg-white/[0.04] border border-white/[0.08] rounded-full p-1.5">
            <button
              id="pricing-toggle-monthly"
              onClick={() => setIsAnnual(false)}
              className={`px-5 py-2 text-sm font-medium rounded-full transition-all duration-200 cursor-pointer ${
                !isAnnual
                  ? 'bg-white/10 text-white shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Monthly
            </button>
            <button
              id="pricing-toggle-annual"
              onClick={() => setIsAnnual(true)}
              className={`px-5 py-2 text-sm font-medium rounded-full transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                isAnnual
                  ? 'bg-white/10 text-white shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Annual
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-semibold">
                -20%
              </span>
            </button>
          </div>
        </AnimatedSection>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {PRICING_TIERS.map((tier, i) => (
            <AnimatedSection key={tier.name} delay={0.15 + i * 0.1}>
              <PricingCard tier={tier} isAnnual={isAnnual} />
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// Individual Pricing Card

interface PricingCardProps {
  tier: (typeof PRICING_TIERS)[number];
  isAnnual: boolean;
}

function PricingCard({ tier, isAnnual }: PricingCardProps) {
  const price = isAnnual ? getAnnualPrice(tier.price) : tier.price;
  const period =
    tier.price === '$0'
      ? 'forever'
      : tier.price === 'Custom'
        ? ''
        : isAnnual
          ? '/month'
          : tier.period;

  return (
    <motion.div
      className={tier.highlighted ? 'relative z-10' : ''}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      {/* Outer glow for highlighted */}
      {tier.highlighted && (
        <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-indigo-500/40 via-purple-500/20 to-indigo-500/40 blur-sm pointer-events-none" />
      )}

      <GlassCard
        className={`p-8 relative ${
          tier.highlighted ? 'scale-[1.03] md:scale-105' : ''
        }`}
        glow={tier.highlighted}
        hover={false}
        id={`pricing-card-${tier.name.toLowerCase()}`}
      >
        {/* Most Popular badge */}
        {tier.highlighted && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
            <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-indigo-500/25">
              Most Popular
            </span>
          </div>
        )}

        {/* Tier name */}
        <h3 className="text-lg font-semibold text-white mb-2">{tier.name}</h3>

        {/* Price */}
        <div className="flex items-baseline gap-1 mb-2">
          <motion.span
            key={price}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold text-white"
          >
            {price}
          </motion.span>
          {period && (
            <span className="text-zinc-500 text-lg">{period}</span>
          )}
        </div>

        {/* Description */}
        <p className="text-zinc-400 text-sm mb-6">{tier.description}</p>

        {/* Divider */}
        <div className="border-t border-white/10 my-6" />

        {/* Features */}
        <ul className="space-y-3 mb-8">
          {tier.features.map((feature, fi) => (
            <li key={fi} className="flex items-start gap-3">
              <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span className="text-zinc-300 text-sm">{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Button
          id={`pricing-cta-${tier.name.toLowerCase()}`}
          variant={tier.highlighted ? 'primary' : 'secondary'}
          size="lg"
          className="w-full"
          href={tier.price === 'Custom' ? 'mailto:contact@jini.ai' : '/login'}
        >
          {tier.cta}
        </Button>
      </GlassCard>
    </motion.div>
  );
}
