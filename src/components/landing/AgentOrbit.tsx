'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { AGENT_DEFINITIONS } from '@/lib/constants';

const agents = AGENT_DEFINITIONS.slice(0, 12); // Use all 12 agents

export function AgentOrbit() {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  // Configuration
  const radius = 6;

  // Calculate positions for the agents
  const positions = useMemo(() => {
    return agents.map((agent, i) => {
      const angle = (i / agents.length) * Math.PI * 2;
      return new THREE.Vector3(
        Math.cos(angle) * radius,
        Math.sin(angle * 2) * 1.5, // Wavy orbit
        Math.sin(angle) * radius
      );
    });
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    // Rotate entire group
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.1;
      groupRef.current.rotation.z = Math.sin(time * 0.05) * 0.1;
    }

    // Pulse core
    if (coreRef.current) {
      const scale = 1 + Math.sin(time * 2) * 0.05;
      coreRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central Core */}
      <Sphere ref={coreRef} args={[1.5, 32, 32]}>
        <meshStandardMaterial
          color="#818cf8"
          emissive="#6366f1"
          emissiveIntensity={1.5}
          wireframe
          transparent
          opacity={0.8}
        />
      </Sphere>

      {/* Orbiting Agents */}
      {agents.map((agent, i) => {
        const pos = positions[i];
        return (
          <group key={agent.id} position={pos}>
            {/* Agent Node */}
            <Sphere args={[0.4, 16, 16]}>
              <meshStandardMaterial
                color={agent.color}
                emissive={agent.color}
                emissiveIntensity={0.8}
              />
            </Sphere>
            
            {/* Connection Line to Core */}
            <Line
              points={[new THREE.Vector3(0, 0, 0), new THREE.Vector3(-pos.x, -pos.y, -pos.z)]}
              color={agent.color}
              lineWidth={1}
              transparent
              opacity={0.3}
            />
          </group>
        );
      })}

      {/* Orbit Rings */}
      <Line
        points={Array.from({ length: 65 }).map((_, i) => {
          const angle = (i / 64) * Math.PI * 2;
          return new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
        })}
        color="#ffffff"
        lineWidth={1}
        transparent
        opacity={0.1}
        rotation={[Math.PI / 8, 0, 0]}
      />
      <Line
        points={Array.from({ length: 65 }).map((_, i) => {
          const angle = (i / 64) * Math.PI * 2;
          return new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
        })}
        color="#ffffff"
        lineWidth={1}
        transparent
        opacity={0.1}
        rotation={[-Math.PI / 8, 0, 0]}
      />
    </group>
  );
}
