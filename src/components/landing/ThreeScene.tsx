'use client';

import { Canvas } from '@react-three/fiber';
import { ReactNode } from 'react';

interface ThreeSceneProps {
  children: ReactNode;
  className?: string;
  camera?: { position?: [number, number, number]; fov?: number; [key: string]: unknown };
}

export function ThreeScene({ children, className = '', camera = { position: [0, 0, 15], fov: 45 } }: ThreeSceneProps) {
  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      <Canvas camera={camera} dpr={[1, 2]}>
        {children}
      </Canvas>
    </div>
  );
}
