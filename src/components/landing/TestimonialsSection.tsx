'use client';

import { Star } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { TESTIMONIALS } from '@/lib/mock-data';

// Avatar gradient presets (cycled per testimonial)

const AVATAR_GRADIENTS = [
  'from-indigo-500 to-purple-500',
  'from-emerald-500 to-teal-500',
  'from-amber-500 to-orange-500',
  'from-rose-500 to-pink-500',
  'from-cyan-500 to-blue-500',
  'from-violet-500 to-fuchsia-500',
];

// TestimonialsSection Component

export function TestimonialsSection() {
  // Duplicate testimonials for seamless infinite loop
  const doubled = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <section className="py-32 relative">
      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/4 w-[600px] h-[400px] bg-purple-500/[0.03] rounded-full blur-[120px] pointer-events-none" />

      {/* Heading */}
      <AnimatedSection className="text-center mb-16 px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          What early users are saying
        </h2>
        <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
          Don&apos;t just take my word for it. Here&apos;s what people who have tried the early version think about it.
        </p>
      </AnimatedSection>

      {/* Scrolling Row */}
      <AnimatedSection delay={0.2}>
        <div className="relative overflow-hidden">
          {/* Left fade */}
          <div className="absolute left-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-r from-[#09090b] to-transparent pointer-events-none" />
          {/* Right fade */}
          <div className="absolute right-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-l from-[#09090b] to-transparent pointer-events-none" />

          {/* Scrolling track */}
          <div className="group">
            <div
              className="flex gap-6 w-max"
              style={{
                animation: 'testimonial-scroll 40s linear infinite',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.animationPlayState = 'paused')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.animationPlayState = 'running')
              }
            >
              {doubled.map((testimonial, index) => (
                <TestimonialCard
                  key={`${testimonial.id}-${index}`}
                  testimonial={testimonial}
                  gradient={AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length]}
                />
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Keyframes injected via style tag */}
      <style>{`
        @keyframes testimonial-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}

// Individual Testimonial Card

interface TestimonialCardProps {
  testimonial: (typeof TESTIMONIALS)[number];
  gradient: string;
}

function TestimonialCard({ testimonial, gradient }: TestimonialCardProps) {
  return (
    <GlassCard
      className="p-6 w-[380px] shrink-0"
      hover={false}
      id={`testimonial-card-${testimonial.id}`}
    >
      {/* Stars */}
      <div className="flex items-center gap-0.5 mb-4">
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <Star
            key={i}
            className="w-4 h-4 text-amber-400 fill-amber-400"
          />
        ))}
      </div>

      {/* Quote */}
      <p className="text-zinc-300 text-sm leading-relaxed italic mb-6 line-clamp-4">
        &ldquo;{testimonial.quote}&rdquo;
      </p>

      {/* Author */}
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div
          className={`w-10 h-10 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0`}
        >
          <span className="text-white text-xs font-bold tracking-wide">
            {testimonial.avatar}
          </span>
        </div>
        <div>
          <p className="text-white text-sm font-semibold">{testimonial.name}</p>
          <p className="text-zinc-500 text-xs">
            {testimonial.role} · {testimonial.company}
          </p>
        </div>
      </div>
    </GlassCard>
  );
}
