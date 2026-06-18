'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const dummy = new THREE.Object3D();

export function ParticleField({ count = 2000 }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const light = useRef<THREE.PointLight>(null);

  // Generate random positions and colors
  const { positions, colors, scales } = useMemo(() => {
    /* eslint-disable react-hooks/purity */
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    
    const colorChoices = [
      new THREE.Color('#9d4edd'), // Jini Purple
      new THREE.Color('#c4b5fd'), // Lavender
      new THREE.Color('#eab308'), // Lamp Gold
      new THREE.Color('#241344'), // Deep Purple
    ];

    for (let i = 0; i < count; i++) {
      // Spherically distribute particles
      const radius = 10 + Math.random() * 20;
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(Math.random() * 2 - 1);
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      const color = colorChoices[Math.floor(Math.random() * colorChoices.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      scales[i] = Math.random() * 0.05 + 0.01;
    }
    
    return { positions, colors, scales };
    /* eslint-enable react-hooks/purity */
  }, [count]);
  
  // Animation loop
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (mesh.current) {
      mesh.current.rotation.y = time * 0.05;
      mesh.current.rotation.z = time * 0.02;

      // Make particles pulse and react to mouse
      const mouseX = state.mouse.x * 2;
      const mouseY = state.mouse.y * 2;

      for (let i = 0; i < count; i++) {
        const x = positions[i * 3];
        const y = positions[i * 3 + 1];
        const z = positions[i * 3 + 2];

        // Calculate distance from mouse
        const dx = mouseX * 10 - x;
        const dy = mouseY * 10 - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Push particles away from mouse
        const force = Math.max(0, 5 - distance) * 0.5;
        const targetX = x - (dx / distance) * force;
        const targetY = y - (dy / distance) * force;

        dummy.position.set(targetX, targetY, z);
        
        // Add a gentle wave motion
        const wave = Math.sin(time * 2 + x) * 0.5;
        dummy.position.y += wave;
        
        const scale = scales[i] * (1 + Math.sin(time * 3 + i) * 0.5) * (1 + force * 2);
        dummy.scale.set(scale, scale, scale);
        
        dummy.updateMatrix();
        mesh.current.setMatrixAt(i, dummy.matrix);
      }
      mesh.current.instanceMatrix.needsUpdate = true;
    }

    // Move the point light around
    if (light.current) {
      light.current.position.x = Math.sin(time * 0.5) * 15;
      light.current.position.y = Math.cos(time * 0.3) * 15;
      light.current.position.z = Math.sin(time * 0.7) * 15;
    }
  });

  return (
    <group>
      <ambientLight intensity={0.2} />
      <pointLight ref={light} intensity={2} distance={30} color="#818cf8" />
      <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
        <sphereGeometry args={[1, 8, 8]}>
          <instancedBufferAttribute
            attach="attributes-color"
            args={[colors, 3]}
          />
        </sphereGeometry>
        <meshBasicMaterial vertexColors transparent opacity={0.6} depthWrite={false} blending={THREE.AdditiveBlending} />
      </instancedMesh>
    </group>
  );
}
