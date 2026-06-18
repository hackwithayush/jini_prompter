'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/Badge';
import { GlassCard } from '@/components/ui/GlassCard';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { Check, X, Sparkles } from 'lucide-react';

const FEATURES = [
  { name: 'Prompt Scoring & Critique', jini: true, generic: false },
  { name: 'Live Refine Loop', jini: true, generic: false },
  { name: 'Multi-Agent Architecture (12 Agents)', jini: true, generic: false },
  { name: 'Execution Plan Generation', jini: true, generic: false },
  { name: 'Blueprint OS™', jini: true, generic: false },
  { name: 'Basic Text Generation', jini: true, generic: true },
];

export function ComparisonSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-[#09090b]">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#9d4edd]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <AnimatedSection className="text-center mb-16">
          <Badge variant="gold" className="mb-4">
            <Sparkles className="w-3.5 h-3.5 mr-1" />
            The Unfair Advantage
          </Badge>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
            Why JINI Wins
          </h2>
          <p className="text-lg text-[#c4b5fd] max-w-2xl mx-auto">
            Generic AI tools generate text. JINI acts as an entire execution engine, evaluating its own work until it produces world-class blueprints.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <GlassCard glow className="p-1 sm:p-8">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr>
                    <th className="p-4 sm:p-6 text-lg font-medium text-white border-b border-white/10 w-1/2">
                      Feature Capability
                    </th>
                    <th className="p-4 sm:p-6 text-center border-b border-white/10 w-1/4">
                      <div className="inline-block bg-[#9d4edd]/20 border border-[#9d4edd]/50 rounded-lg px-4 py-2">
                        <span className="font-serif font-bold text-white text-xl">JINI <span className="text-[#eab308]">AI</span></span>
                      </div>
                    </th>
                    <th className="p-4 sm:p-6 text-center text-lg font-medium text-zinc-400 border-b border-white/10 w-1/4">
                      Generic AI
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {FEATURES.map((feature, idx) => (
                    <motion.tr 
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + idx * 0.1 }}
                      className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="p-4 sm:p-6 text-zinc-300 font-medium">
                        {feature.name}
                      </td>
                      <td className="p-4 sm:p-6">
                        <div className="flex justify-center">
                          {feature.jini ? (
                            <div className="w-8 h-8 rounded-full bg-[#9d4edd]/20 flex items-center justify-center border border-[#9d4edd]/50 text-[#eab308]">
                              <Check className="w-5 h-5" />
                            </div>
                          ) : (
                            <X className="w-5 h-5 text-zinc-600" />
                          )}
                        </div>
                      </td>
                      <td className="p-4 sm:p-6">
                        <div className="flex justify-center">
                          {feature.generic ? (
                            <div className="w-8 h-8 rounded-full bg-zinc-800/50 flex items-center justify-center border border-zinc-700 text-zinc-400">
                              <Check className="w-5 h-5" />
                            </div>
                          ) : (
                            <X className="w-5 h-5 text-zinc-700" />
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </AnimatedSection>
      </div>
    </section>
  );
}
