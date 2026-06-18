'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Crown,
  Package,
  MousePointerClick,
  Palette,
  Code2,
  Brain,
  Shield,
  Megaphone,
  TrendingUp,
  DollarSign,
  CheckCircle2,
  Lightbulb,
  type LucideIcon,
} from 'lucide-react';
import { AGENT_DEFINITIONS } from '@/lib/constants';
import { GlassCard } from '@/components/ui/GlassCard';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { Badge } from '@/components/ui/Badge';
import { ThreeScene } from './ThreeScene';
import { AgentOrbit } from './AgentOrbit';

// ---------------------------------------------------------------------------
// Icon Mapping
// ---------------------------------------------------------------------------

const iconMap: Record<string, LucideIcon> = {
  Crown,
  Package,
  MousePointerClick,
  Palette,
  Code2,
  Brain,
  Shield,
  Megaphone,
  TrendingUp,
  DollarSign,
  CheckCircle2,
  Lightbulb,
};

// ---------------------------------------------------------------------------
// AgentShowcase
// ---------------------------------------------------------------------------

export default function AgentShowcase() {
  const [hoveredAgent, setHoveredAgent] = useState<string | null>(null);

  return (
    <section
      id="agents"
      className="relative py-32 overflow-hidden"
    >
      {/* ── Ambient background glow ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-1/4 h-[500px] w-[500px] rounded-full bg-purple-500/[0.04] blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 bottom-1/4 h-[400px] w-[400px] rounded-full bg-indigo-500/[0.03] blur-[100px]"
      />

      {/* ── 3D Agent Orbit ── */}
      <ThreeScene className="opacity-40" camera={{ position: [0, 5, 20], fov: 45 }}>
        <AgentOrbit />
      </ThreeScene>

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* ── Section heading ── */}
        <AnimatedSection className="text-center mb-16">
          <Badge variant="gold" className="mb-4">
            Agent Factory
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-4 font-serif">
            12 AI Agents. One Mission.
          </h2>
          <p className="mt-4 text-lg text-[#c4b5fd] max-w-2xl mx-auto text-center">
            Every wish is analyzed by 12 specialized AI agents working in
            parallel, turning your prompt into reality.
          </p>
        </AnimatedSection>

        {/* ── Subtle connecting mesh ── */}
        <div className="relative">
          {/* Connecting lines SVG — decorative mesh behind cards */}
          <svg
            aria-hidden
            className="pointer-events-none absolute inset-0 z-0 hidden lg:block"
            width="100%"
            height="100%"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="line-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#818cf8" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#c084fc" stopOpacity="0.08" />
              </linearGradient>
            </defs>
            {/* Horizontal lines */}
            {[0, 1, 2].map((row) => (
              <line
                key={`h-${row}`}
                x1="8%"
                y1={`${22 + row * 50}%`}
                x2="92%"
                y2={`${22 + row * 50}%`}
                stroke="url(#line-grad)"
                strokeWidth="1"
                strokeDasharray="6 10"
              />
            ))}
            {/* Vertical lines */}
            {[0, 1, 2, 3].map((col) => (
              <line
                key={`v-${col}`}
                x1={`${18 + col * 22}%`}
                y1="5%"
                x2={`${18 + col * 22}%`}
                y2="95%"
                stroke="url(#line-grad)"
                strokeWidth="1"
                strokeDasharray="6 10"
              />
            ))}
          </svg>

          {/* ── Agent cards grid ── */}
          <div className="relative z-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {AGENT_DEFINITIONS.map((agent, index) => {
              const Icon = iconMap[agent.icon];

              return (
                <AnimatedSection
                  key={agent.id}
                  delay={index * 0.06}
                >
                  <a href="/login" className="block h-full">
                    <GlassCard
                      id={`agent-card-${agent.id}`}
                      className="p-6 relative group cursor-pointer h-full"
                      glow={hoveredAgent === agent.id}
                    >
                      <div
                        onMouseEnter={() => setHoveredAgent(agent.id)}
                        onMouseLeave={() => setHoveredAgent(null)}
                        className="flex flex-col items-start h-full"
                      >
                        {/* Circular icon */}
                        <div
                          className="flex h-12 w-12 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110"
                          style={{
                            backgroundColor: `${agent.color}1A`, // 10% opacity
                          }}
                        >
                          {Icon && (
                            <Icon
                              className="h-5 w-5"
                              style={{ color: agent.color }}
                            />
                          )}
                        </div>

                        {/* Agent name */}
                        <h3 className="mt-3 text-sm font-semibold text-white group-hover:text-indigo-400 transition-colors duration-200">
                          {agent.name}
                        </h3>

                        {/* Agent role */}
                        <p className="mt-1 text-xs text-zinc-500">
                          {agent.role}
                        </p>

                        {/* Hover tooltip / description */}
                        <AnimatePresence>
                          {hoveredAgent === agent.id && (
                            <motion.p
                              initial={{ opacity: 0, height: 0, marginTop: 0 }}
                              animate={{ opacity: 1, height: 'auto', marginTop: 8 }}
                              exit={{ opacity: 0, height: 0, marginTop: 0 }}
                              transition={{ duration: 0.25, ease: 'easeOut' }}
                              className="text-xs leading-relaxed text-zinc-400 overflow-hidden"
                            >
                              {agent.description}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Active dot indicator on hover */}
                      <motion.div
                        className="absolute top-3 right-3 h-2 w-2 rounded-full"
                        style={{ backgroundColor: agent.color }}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={
                          hoveredAgent === agent.id
                            ? { scale: 1, opacity: 1 }
                            : { scale: 0, opacity: 0 }
                        }
                        transition={{ duration: 0.2 }}
                      />
                    </GlassCard>
                  </a>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
