'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { GradientText } from '@/components/ui/GradientText';
import { Button } from '@/components/ui/Button';

// CTASection Component

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

import { useState, useEffect } from 'react';

export function CTASection() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setParticles(
      Array.from({ length: 24 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 8 + 6,
        delay: Math.random() * 4,
      }))
    );
  }, []);
  return (
    <section className="py-32 relative overflow-hidden">
      {/* ─── Background gradient mesh ─── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Primary orb */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-[700px] h-[500px] -translate-x-1/2 -translate-y-1/2 bg-indigo-600/[0.08] rounded-full blur-[100px]"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.08, 0.14, 0.08],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        {/* Secondary orb */}
        <motion.div
          className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-purple-600/[0.06] rounded-full blur-[100px]"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            opacity: [0.06, 0.12, 0.06],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        {/* Tertiary orb */}
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-[350px] h-[350px] bg-indigo-500/[0.05] rounded-full blur-[120px]"
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* ─── Floating particles ─── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-indigo-400/20"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* ─── Content ─── */}
      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <AnimatedSection>
          {/* Glass container */}
          <div className="relative rounded-3xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-2xl p-12 md:p-16 text-center overflow-hidden">
            {/* Inner gradient accents */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />

            {/* Sparkle icon */}
            <motion.div
              className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 mb-8"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <Sparkles className="w-6 h-6 text-indigo-400" />
            </motion.div>

            {/* Heading */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <GradientText animate>
                Ready to start building?
              </GradientText>
            </h2>

            {/* Subheading */}
            <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Stop endlessly planning and start coding. It's completely free to try. What do you want to build today?
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                id="cta-generate"
                variant="primary"
                size="lg"
                href="#hero-input"
              >
                Generate Your First Blueprint
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
              </Button>
              <Button
                id="cta-explore"
                variant="secondary"
                size="lg"
                href="#features"
              >
                Explore Features
              </Button>
            </div>

            {/* Social proof micro-line */}
            <div className="mt-10 flex items-center justify-center gap-3">
              {/* Stacked avatars */}
              <div className="flex -space-x-2">
                {['from-indigo-500 to-purple-500', 'from-emerald-500 to-teal-500', 'from-amber-500 to-orange-500', 'from-rose-500 to-pink-500'].map(
                  (grad, i) => (
                    <div
                      key={i}
                      className={`w-7 h-7 rounded-full bg-gradient-to-br ${grad} border-2 border-[#09090b]`}
                    />
                  )
                )}
              </div>
              <p className="text-zinc-500 text-sm">
                <span className="text-zinc-300 font-medium">10,000+</span>{' '}
                blueprints generated this month
              </p>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
