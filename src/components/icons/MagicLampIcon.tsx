'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export function MagicLampIcon({ className = '', animated = false }: { className?: string, animated?: boolean }) {
  const Wrapper = animated ? motion.g : 'g';

  const [particles, setParticles] = useState<{cx: number, r: number, y: number, x: number, duration: number, delay: number}[]>([]);

  useEffect(() => {
    if (animated) {
      setTimeout(() => setParticles(
        [...Array(6)].map(() => ({
          cx: 80 + Math.random() * 40,
          r: Math.random() * 2 + 1,
          y: -40 - Math.random() * 60,
          x: (Math.random() - 0.5) * 40,
          duration: 2 + Math.random() * 3,
          delay: Math.random() * 2
        }))
      ), 0);
    }
  }, [animated]);

  return (
    <div className={`relative ${className} flex items-center justify-center`}>
      <div className="relative w-full h-full max-w-[120px] max-h-[120px] aspect-square flex items-center justify-center">
        
        {/* World-Class Background Aura */}
        {animated && (
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle at center, rgba(155, 109, 255, 0.4) 0%, rgba(155, 109, 255, 0) 70%)',
              filter: 'blur(10px)'
            }}
            animate={{ scale: [0.8, 1.4, 0.8], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}

        {/* Core SVG Canvas */}
        <svg
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full overflow-visible relative z-10"
        >
          {/* ─── WORLD-CLASS DEFS ─── */}
          <defs>
            {/* Lamp Body Gradient */}
            <linearGradient id="lampGrad" x1="50" y1="100" x2="150" y2="135" gradientUnits="userSpaceOnUse">
              <stop stopColor="#24184E" />
              <stop offset="1" stopColor="#0D081C" />
            </linearGradient>
            
            {/* Lamp Dome Gradient */}
            <linearGradient id="domeGrad" x1="70" y1="80" x2="130" y2="105" gradientUnits="userSpaceOnUse">
              <stop stopColor="#3D2980" />
              <stop offset="1" stopColor="#1A1137" />
            </linearGradient>

            {/* Gold Gradient */}
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="50%" stopColor="#EAB308" />
              <stop offset="100%" stopColor="#A16207" />
            </linearGradient>

            {/* Glowing Filters */}
            <filter id="goldGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            
            <filter id="purpleGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* ─── DYNAMIC FLUID SMOKE ─── */}
          {animated && (
            <>
              <motion.path
                d="M100 80 C 80 60, 130 40, 90 20"
                stroke="url(#goldGrad)"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: [0, 1, 1], opacity: [0, 0.8, 0], y: [0, -10, -20] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                filter="url(#goldGlow)"
              />
              <motion.path
                d="M100 80 C 120 50, 70 30, 110 10"
                stroke="#9b6dff"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: [0, 1, 1], opacity: [0, 0.6, 0], y: [0, -15, -30] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                filter="url(#purpleGlow)"
              />
            </>
          )}

          {/* ─── MAIN LAMP HOVERING ─── */}
          <Wrapper
            {...(animated ? {
              initial: { y: 0, rotate: 0 },
              animate: { y: [-4, 4, -4], rotate: [-1.5, 1.5, -1.5] },
              transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' }
            } : {})}
            className="origin-center"
          >
            {/* Lamp Base UFO Shape */}
            <path
              d="M50 115 C50 140, 150 140, 150 115 C150 95, 50 95, 50 115 Z"
              fill="url(#lampGrad)"
              stroke="#583B99"
              strokeWidth="1.5"
            />
            {/* Intricate Gold Inlay on Base */}
            <path
              d="M70 120 C 100 130, 130 110, 130 110"
              stroke="url(#goldGrad)"
              strokeWidth="1"
              strokeLinecap="round"
              fill="none"
              opacity="0.6"
            />
            <path
              d="M80 125 C 100 135, 120 125, 120 125"
              stroke="#9b6dff"
              strokeWidth="0.5"
              strokeLinecap="round"
              fill="none"
              opacity="0.8"
            />

            {/* Lamp Middle Dome */}
            <path
              d="M70 105 C70 75, 130 75, 130 105 Z"
              fill="url(#domeGrad)"
              stroke="#8B5CF6"
              strokeWidth="1.5"
            />
            {/* Dome Inlay Detail */}
            <path
              d="M85 95 L 115 95"
              stroke="url(#goldGrad)"
              strokeWidth="1"
              strokeLinecap="round"
              opacity="0.4"
            />

            {/* Lamp Top Knob */}
            <path
              d="M92 82 C92 70, 108 70, 108 82 Z"
              fill="#24184E"
              stroke="#A78BFA"
              strokeWidth="1.5"
            />
            {/* Gold Ring on Knob */}
            <ellipse cx="100" cy="74" rx="7" ry="2.5" fill="url(#goldGrad)" filter="url(#goldGlow)" />
            
            {/* Magic Spark (Gold Star) - Spinning and Pulsing */}
            <Wrapper
              {...(animated ? {
                initial: { scale: 0.8, opacity: 0.8, rotate: 0 },
                animate: { scale: [0.8, 1.4, 0.8], opacity: [0.7, 1, 0.7], rotate: [0, 180, 360] },
                transition: { duration: 4, repeat: Infinity, ease: 'linear' }
              } : {})}
              className="origin-center"
            >
              <path
                d="M100 40 L103 52 L115 55 L103 58 L100 70 L97 58 L85 55 L97 52 Z"
                fill="url(#goldGrad)"
                filter="url(#goldGlow)"
              />
              <circle cx="100" cy="55" r="2" fill="#FFFFFF" />
            </Wrapper>
          </Wrapper>

          {/* ─── DYNAMIC FLOATING PARTICLES ─── */}
          {animated && particles.map((p, i) => (
            <motion.circle
              key={i}
              cx={p.cx}
              cy={120}
              r={p.r}
              fill={i % 2 === 0 ? '#e8b84b' : '#9b6dff'}
              filter={i % 2 === 0 ? 'url(#goldGlow)' : 'url(#purpleGlow)'}
              initial={{ opacity: 0, y: 0, x: 0 }}
              animate={{ 
                opacity: [0, 1, 0], 
                y: p.y,
                x: p.x 
              }}
              transition={{ 
                duration: p.duration, 
                repeat: Infinity, 
                delay: p.delay,
                ease: 'easeOut'
              }}
            />
          ))}
        </svg>
      </div>
    </div>
  );
}
