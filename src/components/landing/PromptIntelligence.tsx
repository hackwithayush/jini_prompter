'use client';

import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { Sparkles, Brain, CheckCircle2, TrendingUp, Target, Zap } from 'lucide-react';
import { useBlueprint } from '@/lib/context/BlueprintContext';

export function PromptIntelligence() {
  const { blueprint } = useBlueprint();

  // Use live metrics if available, otherwise default to 0 for the animation effect
  const metrics = [
    { name: 'Clarity', score: blueprint?.clarityScore ?? 0, icon: Target },
    { name: 'Structure', score: blueprint?.structureScore ?? 0, icon: Brain },
    { name: 'Reasoning', score: blueprint?.reasoningScore ?? 0, icon: Zap },
    { name: 'Optimization', score: blueprint?.optimizationScore ?? 0, icon: CheckCircle2 },
    { name: 'Conversion Potential', score: blueprint?.conversionScore ?? 0, icon: TrendingUp },
  ];
  
  const displayScore = blueprint?.qualityScore || 0.0;
  return (
    <section className="py-24 relative overflow-hidden bg-[#09090b]">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#eab308]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <AnimatedSection className="text-center mb-16">
          <Badge variant="gold" className="mb-4">
            <Sparkles className="w-3.5 h-3.5 mr-1" />
            Signature Feature
          </Badge>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
            Prompt Intelligence Dashboard
          </h2>
          <p className="text-lg text-[#c4b5fd] max-w-2xl mx-auto">
            JINI doesn&apos;t just generate prompts, it grades them. Our QA Agent scores every output across 5 dimensions, automatically refining until it hits near-perfect scores.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          
          {/* Main Score Card */}
          <AnimatedSection delay={0.2} className="lg:col-span-1">
            <GlassCard glow className="p-8 flex flex-col items-center justify-center h-full min-h-[300px]">
              <div className="text-[#c4b5fd] font-medium mb-4 uppercase tracking-widest text-sm">Overall Score</div>
              <motion.div 
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
                className="relative w-48 h-48 rounded-full border-4 border-[#eab308]/20 flex items-center justify-center before:absolute before:inset-0 before:rounded-full before:border-4 before:border-[#eab308] before:border-t-transparent before:animate-spin"
              >
                <div className="text-center">
                  <div className="text-6xl font-serif font-bold text-white drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]">
                    {displayScore}<span className="text-2xl text-[#eab308]">/10</span>
                  </div>
                  <div className="text-[#eab308] font-medium mt-2 flex items-center justify-center gap-1">
                    <Sparkles className="w-4 h-4" />
                    {Number(displayScore) > 9 ? "World Class" : "Excellent"}
                  </div>
                </div>
              </motion.div>
            </GlassCard>
          </AnimatedSection>

          {/* Metrics List */}
          <AnimatedSection delay={0.4} className="lg:col-span-2">
            <GlassCard className="p-8">
              <div className="space-y-6">
                {metrics.map((metric, idx) => (
                  <motion.div 
                    key={metric.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + idx * 0.1 }}
                    className="flex flex-col gap-2"
                  >
                    <div className="flex justify-between items-end">
                      <div className="flex items-center gap-2 text-white font-medium">
                        <metric.icon className="w-4 h-4 text-[#9d4edd]" />
                        {metric.name}
                      </div>
                      <div className="text-[#eab308] font-bold">{metric.score}%</div>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${metric.score}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.8 + idx * 0.1 }}
                        className="h-full bg-gradient-to-r from-[#9d4edd] to-[#eab308]"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </AnimatedSection>

        </div>
      </div>
    </section>
  );
}
