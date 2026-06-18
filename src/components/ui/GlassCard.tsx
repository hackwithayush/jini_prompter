'use client';

import { motion } from 'framer-motion';
import { ReactNode, useRef, useState } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
  hover?: boolean;
  spotlight?: boolean;
  id?: string;
}

export function GlassCard({
  children,
  className = '',
  glow = false,
  hover = true,
  spotlight = false,
  id,
}: GlassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!spotlight || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      ref={cardRef}
      id={id}
      className={`relative rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      whileHover={hover ? { y: -2, borderColor: 'rgba(255,255,255,0.15)' } : {}}
      transition={{ duration: 0.2 }}
    >
      {/* Gradient glow border */}
      {glow && (
        <div className="absolute inset-0 rounded-2xl p-px bg-gradient-to-br from-[#9d4edd]/30 via-transparent to-[#9d4edd]/10 pointer-events-none" style={{ WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude' }} />
      )}
      {/* Mouse spotlight */}
      {spotlight && (
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(157, 78, 221, 0.08), transparent 40%)`,
          }}
        />
      )}
      {/* Inner glow */}
      {glow && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#9d4edd]/5 via-transparent to-transparent pointer-events-none" />
      )}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
