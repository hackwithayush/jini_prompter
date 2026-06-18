'use client';

import {
  Search,
  FileSearch,
  Globe,
  PenTool,
  CalendarCheck,
  Zap,
  ChevronRight,
  type LucideIcon,
} from 'lucide-react';
import { COGNITIVE_STAGES } from '@/lib/constants';
import { GlassCard } from '@/components/ui/GlassCard';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { Badge } from '@/components/ui/Badge';

// Icon Mapping

const iconMap: Record<string, LucideIcon> = {
  Search,
  FileSearch,
  Globe,
  PenTool,
  CalendarCheck,
  Zap,
};

// Connecting Arrow — horizontal between stages on desktop

function ConnectorArrow() {
  return (
    <div className="hidden lg:flex items-center justify-center -mx-1 shrink-0">
      <div className="h-px w-6 bg-gradient-to-r from-indigo-500/40 to-purple-500/40" />
      <ChevronRight className="h-4 w-4 text-indigo-400/50 -ml-1" />
    </div>
  );
}

// Vertical Connector — between stages on mobile / tablet

function VerticalConnector() {
  return (
    <div className="flex lg:hidden justify-center py-1">
      <div className="flex flex-col items-center gap-0.5">
        <div className="w-px h-6 bg-gradient-to-b from-indigo-500/40 to-purple-500/40" />
        <ChevronRight className="h-4 w-4 text-indigo-400/50 rotate-90" />
      </div>
    </div>
  );
}

// CognitiveFramework

export default function CognitiveFramework() {
  return (
    <section
      id="framework"
      className="relative py-32"
    >
      {/* ── Ambient glow ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 bottom-0 -translate-x-1/2 h-[600px] w-[800px] rounded-full bg-purple-500/[0.03] blur-[120px]"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* ── Section heading ── */}
        <AnimatedSection className="text-center mb-20">
          <Badge variant="glow" className="mb-4">
            Under the Hood
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-4">
            How the Pipeline Actually Works
          </h2>
        </AnimatedSection>

        {/* ── Desktop: 3-col x 2-row pipeline with arrows ── */}
        {/* ── Mobile / Tablet: Vertical stack ── */}

        {/* Row 1 — Stages 1-3 (desktop) */}
        <div className="hidden lg:flex items-stretch justify-center mb-8">
          {COGNITIVE_STAGES.slice(0, 3).map((stage, i) => (
            <div key={stage.number} className="flex items-stretch">
              <AnimatedSection delay={i * 0.12} className="w-[320px]">
                <StageCard stage={stage} />
              </AnimatedSection>
              {i < 2 && <ConnectorArrow />}
            </div>
          ))}
        </div>

        {/* Row-bridging arrow (desktop) — down from row 1 end to row 2 start */}
        <div className="hidden lg:flex justify-center mb-8">
          <div className="flex flex-col items-center gap-0.5">
            <div className="w-px h-8 bg-gradient-to-b from-purple-500/40 to-indigo-500/40" />
            <ChevronRight className="h-4 w-4 text-purple-400/50 rotate-90" />
          </div>
        </div>

        {/* Row 2 — Stages 4-6 (desktop) */}
        <div className="hidden lg:flex items-stretch justify-center">
          {COGNITIVE_STAGES.slice(3, 6).map((stage, i) => (
            <div key={stage.number} className="flex items-stretch">
              <AnimatedSection delay={(i + 3) * 0.12} className="w-[320px]">
                <StageCard stage={stage} />
              </AnimatedSection>
              {i < 2 && <ConnectorArrow />}
            </div>
          ))}
        </div>

        {/* ── Mobile layout — vertical stack ── */}
        <div className="lg:hidden flex flex-col">
          {COGNITIVE_STAGES.map((stage, i) => (
            <div key={stage.number}>
              <AnimatedSection delay={i * 0.1}>
                <StageCard stage={stage} />
              </AnimatedSection>
              {i < COGNITIVE_STAGES.length - 1 && <VerticalConnector />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// StageCard — individual stage rendering

interface StageCardProps {
  stage: {
    number: number;
    name: string;
    description: string;
    outputs: string[];
    icon: string;
  };
}

function StageCard({ stage }: StageCardProps) {
  const Icon = iconMap[stage.icon];
  const paddedNumber = String(stage.number).padStart(2, '0');

  return (
    <GlassCard
      id={`framework-stage-${stage.number}`}
      className="p-6 h-full group"
      glow
    >
      <div className="flex items-start justify-between mb-4">
        {/* Stage number */}
        <span className="text-3xl font-extrabold bg-gradient-to-br from-indigo-400 to-purple-400 bg-clip-text text-transparent leading-none">
          {paddedNumber}
        </span>

        {/* Icon */}
        {Icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 transition-colors duration-300 group-hover:bg-indigo-500/20">
            <Icon className="h-5 w-5 text-indigo-400" />
          </div>
        )}
      </div>

      {/* Stage name */}
      <h3 className="text-base font-semibold text-white">
        {stage.name}
      </h3>

      {/* Description */}
      <p className="mt-2 text-sm leading-relaxed text-zinc-400">
        {stage.description}
      </p>

      {/* Outputs */}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {stage.outputs.map((output) => (
          <span
            key={output}
            className="inline-block rounded-md bg-white/[0.05] px-2 py-0.5 text-[11px] font-medium text-zinc-300 border border-white/[0.06]"
          >
            {output}
          </span>
        ))}
      </div>
    </GlassCard>
  );
}
