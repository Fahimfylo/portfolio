import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useUniverse } from '../UniverseContext';

const STAR_COUNT = 180;

const seededFloat = (seed: number, mult = 1) => Math.sin(seed * 127.1) * mult;

/**
 * Sparse static starfield for depth. Rendered in world space (outside the
 * rotating group) so the constellation spins in front of it - cheap parallax.
 */
export const Environment: React.FC = () => {
  const { reduced } = useUniverse();
  const group = useRef<THREE.Points>(null);

  const starPositions = useMemo(() => {
    const arr = new Float32Array(STAR_COUNT * 3);
    for (let i = 0; i < STAR_COUNT; i++) {
      const theta = seededFloat(i);
      const phi = seededFloat(i + 1000);
      const r = 8 + seededFloat(i + 2000) * 6;
      arr[i * 3] = Math.cos(theta) * Math.sin(phi) * r;
      arr[i * 3 + 1] = Math.cos(phi) * r * 0.6;
      arr[i * 3 + 2] = Math.sin(theta) * Math.sin(phi) * r;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (reduced || !group.current) return;
    group.current.rotation.y = state.clock.elapsedTime * 0.0015;
  });

  return (
    <points ref={group}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[starPositions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#8a8982" size={0.02} sizeAttenuation transparent opacity={0.4} depthWrite={false} />
    </points>
  );
};