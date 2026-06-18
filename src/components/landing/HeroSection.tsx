'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { GradientText } from '@/components/ui/GradientText';
import { Button } from '@/components/ui/Button';
import { HERO_STATS } from '@/lib/mock-data';
import { ThreeScene } from './ThreeScene';
import { ParticleField } from './ParticleField';
import { MagicLampIcon } from '@/components/icons/MagicLampIcon';
import { WishBox } from './WishBox';

/* ─── Framer Motion helpers ─── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] as const },
});

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

export default function HeroSection() {

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#09090b]"
    >
      {/* ─── Animated Gradient Mesh Background ─── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {/* Orb 1 — Indigo, top-left */}
        <div
          className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)',
            filter: 'blur(100px)',
            animation: 'hero-float 8s ease-in-out infinite',
          }}
        />
        {/* Orb 2 — Purple, bottom-right */}
        <div
          className="absolute -bottom-[20%] -right-[10%] w-[50vw] h-[50vw] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, #a855f7 0%, transparent 70%)',
            filter: 'blur(100px)',
            animation: 'hero-float 10s ease-in-out 2s infinite',
          }}
        />
        {/* Orb 3 — Cyan, center */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] rounded-full opacity-[0.15]"
          style={{
            background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)',
            filter: 'blur(100px)',
            animation: 'hero-float 12s ease-in-out 4s infinite',
          }}
        />
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* 3D Particle Field */}
        <ThreeScene className="opacity-60" camera={{ position: [0, 0, 20], fov: 60 }}>
          <ParticleField count={2500} />
        </ThreeScene>

        {/* Top radial fade */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#09090b] via-transparent to-[#09090b]" />
      </div>

      {/* ─── Main Content ─── */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 pt-32 pb-20 flex flex-col items-center text-center">
        {/* ── Magic Lamp Logo ── */}
        <motion.div
          {...fadeUp(0)}
          className="mb-8"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="relative group cursor-pointer">
            {/* Breathing purple glow */}
            <motion.div 
              className="absolute inset-0 bg-[#9d4edd]/30 blur-2xl rounded-full" 
              animate={{ opacity: [0.5, 0.8, 0.5], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
            {/* Gold pulse every few seconds */}
            <motion.div 
              className="absolute inset-0 bg-[#eab308]/40 blur-xl rounded-full" 
              animate={{ opacity: [0, 0.6, 0], scale: [0.8, 1.5, 0.8] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', times: [0, 0.1, 0.2] }}
            />
            <MagicLampIcon className="w-16 h-16 text-[#eab308] relative z-10 transition-transform duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]" animated={true} />
          </div>
        </motion.div>

        {/* ── Heading ── */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="space-y-2 max-w-4xl"
        >
          <motion.h1
            className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.1] font-serif"
            {...fadeUp(0.1)}
          >
            Turn Any Wish Into A<br/>
            <GradientText from="#c4b5fd" to="#9d4edd">
              Production-Ready Reality
            </GradientText>
          </motion.h1>
        </motion.div>

        {/* ── Subheadline ── */}
        <motion.p
          className="mt-8 text-lg md:text-xl text-[#c4b5fd] max-w-2xl mx-auto leading-relaxed"
          {...fadeUp(0.38)}
        >
          Generate expert prompts, business blueprints, AI agents,
          marketing systems, and execution plans.
        </motion.p>

        {/* ─── Wish Box ─── */}
        <motion.div
          id="hero-input"
          className="mt-12 w-full max-w-2xl mx-auto text-left"
          {...fadeUp(0.5)}
        >
          <WishBox />
        </motion.div>

        {/* ── Secondary CTAs ── */}
        <motion.div
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
          {...fadeUp(0.62)}
        >
          <Button id="hero-cta-demo" variant="ghost" size="md" href="#demo">
            <Sparkles className="w-4 h-4 fill-current mr-2 text-[#eab308]" />
            See the magic
          </Button>
        </motion.div>

        {/* ─── Stats Bar ─── */}
        <motion.div
          className="mt-20 w-full max-w-3xl mx-auto"
          {...fadeUp(0.75)}
        >
          <div className="relative rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-lg p-6 sm:p-8">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/[0.03] via-transparent to-purple-500/[0.03] pointer-events-none" />

            <div className="relative grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12">
              {HERO_STATS.map((stat, i) => (
                <motion.div
                  key={stat.id}
                  id={stat.id}
                  className="flex flex-col items-center text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.85 + i * 0.1,
                    ease: [0.16, 1, 0.3, 1] as const,
                  }}
                >
                  <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    {stat.value}
                  </span>
                  <span className="mt-1 text-xs sm:text-sm text-zinc-500 leading-tight">
                    {stat.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ─── CSS Keyframes ─── */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes hero-float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33%      { transform: translate(30px, -20px) scale(1.05); }
          66%      { transform: translate(-20px, 20px) scale(0.95); }
        }
        @keyframes hero-glow-border {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}} />
    </section>
  );
}
