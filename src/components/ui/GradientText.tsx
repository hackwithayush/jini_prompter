import { ReactNode } from 'react';

interface GradientTextProps {
  children: ReactNode;
  className?: string;
  from?: string;
  to?: string;
  animate?: boolean;
}

export function GradientText({
  children,
  className = '',
  from = '#818cf8',
  to = '#c084fc',
  animate = false,
}: GradientTextProps) {
  return (
    <span
      className={`bg-clip-text text-transparent ${animate ? 'animate-gradient-shift' : ''} ${className}`}
      style={{
        backgroundImage: animate 
          ? `linear-gradient(90deg, ${from}, ${to}, ${from})`
          : `linear-gradient(135deg, ${from}, ${to})`,
        backgroundSize: animate ? '200% auto' : '100% auto',
      }}
    >
      {children}
    </span>
  );
}
