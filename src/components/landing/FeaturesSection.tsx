'use client';

import {
  Dna,
  Layers,
  Bot,
  GitBranch,
  ShieldCheck,
  Rocket,
  type LucideIcon,
} from 'lucide-react';
import { JINI_FEATURES } from '@/lib/constants';
import { GlassCard } from '@/components/ui/GlassCard';
import { AnimatedSection } from '@/components/ui/AnimatedSection';

// ---------------------------------------------------------------------------
// Icon Mapping — resolves string icon names from constants to components
// ---------------------------------------------------------------------------

const iconMap: Record<string, LucideIcon> = {
  Dna,
  Layers,
  Bot,
  GitBranch,
  ShieldCheck,
  Rocket,
};

// ---------------------------------------------------------------------------
// FeaturesSection
// ---------------------------------------------------------------------------

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="relative py-32 overflow-hidden"
    >
      {/* ── Ambient background glow ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-indigo-500/[0.04] blur-[120px]"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* ── Section heading ── */}
        <AnimatedSection className="text-center mb-16">
          <p className="text-sm tracking-widest uppercase text-zinc-400 mb-4">
            Powered by
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            JINI Intelligence
          </h2>
        </AnimatedSection>

        {/* ── Feature cards grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {JINI_FEATURES.map((feature, index) => {
            const Icon = iconMap[feature.icon];

            return (
              <AnimatedSection
                key={feature.id}
                delay={index * 0.1}
              >
                <GlassCard
                  glow
                  id={`feature-card-${feature.id}`}
                  className="p-8 min-h-[240px] group"
                >
                  {/* Icon container */}
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10">
                    {Icon && (
                      <Icon className="h-6 w-6 text-indigo-400" />
                    )}
                  </div>

                  {/* Feature name + trademark */}
                  <h3 className="mt-4 text-xl font-semibold text-white">
                    {feature.name}
                    <sup className="ml-0.5 text-xs text-indigo-400/70 font-normal">
                      {feature.trademark}
                    </sup>
                  </h3>

                  {/* Description */}
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                    {feature.description}
                  </p>
                </GlassCard>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
