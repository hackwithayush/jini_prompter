import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'glow' | 'outline' | 'gold';
  className?: string;
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const variants = {
    default: 'bg-[#9d4edd]/10 text-[#c4b5fd] border-[#9d4edd]/20',
    glow: 'bg-[#9d4edd]/10 text-[#c4b5fd] border-[#9d4edd]/30 shadow-lg shadow-[#9d4edd]/20',
    outline: 'bg-transparent text-zinc-400 border-zinc-700',
    gold: 'bg-[#eab308]/10 text-[#eab308] border-[#eab308]/30 shadow-lg shadow-[#eab308]/10',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium tracking-wide uppercase rounded-full border ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
