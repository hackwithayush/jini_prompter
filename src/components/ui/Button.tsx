'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  href?: string;
  className?: string;
  id?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  href,
  className = '',
  id,
  type = 'button',
  disabled = false,
}: ButtonProps) {
  const baseClasses = 'relative inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 cursor-pointer overflow-hidden group';
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };
  
  const variantClasses = {
    primary: 'bg-[#9d4edd] hover:bg-[#8b3dcc] text-white shadow-lg shadow-[#9d4edd]/20 hover:shadow-[#9d4edd]/40 border border-white/10',
    secondary: 'bg-[#09090b]/50 hover:bg-[#241344] text-zinc-200 border border-[#9d4edd]/30 hover:border-[#9d4edd]/60',
    ghost: 'bg-transparent hover:bg-[#241344]/50 text-zinc-400 hover:text-zinc-200 border border-transparent',
  };

  const content = (
    <>
      {variant === 'primary' && (
        <span className="absolute inset-0 bg-gradient-to-r from-[#8b3dcc] via-[#9d4edd] to-[#7b2cbb] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}
      {/* Shimmer effect for primary */}
      {variant === 'primary' && (
        <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-[#eab308]/20 to-transparent" />
      )}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </>
  );

  const allClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;

  if (href) {
    return (
      <motion.a
        href={href}
        id={id}
        className={allClasses}
        whileHover={{ scale: 1.02, y: -1 }}
        whileTap={{ scale: 0.98 }}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      id={id}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${allClasses} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      whileHover={disabled ? {} : { scale: 1.02, y: -1 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
    >
      {content}
    </motion.button>
  );
}
