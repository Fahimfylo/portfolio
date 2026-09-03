import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useUniverse } from '../UniverseContext';

interface FloatGroupProps {
  position: [number, number, number];
  amplitude?: number;
  speed?: number;
  phase?: number;
  children: React.ReactNode;
}

/** Bounded group that drifts gently for organic composition motion. */
export const FloatGroup: React.FC<FloatGroupProps> = ({
  position,
  amplitude = 0.07,
  speed = 0.5,
  phase = 0,
  children,
}) => {
  const ref = useRef<THREE.Group>(null);
  const { reduced } = useUniverse();

  useFrame((state) => {
    const g = ref.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    if (reduced) return;
    g.position.y = position[1] + Math.sin(t * speed + phase) * amplitude;
    g.position.x = position[0] + Math.cos(t * speed * 0.6 + phase) * amplitude * 0.5;
  });

  return (
    <group ref={ref} position={position}>
      {children}
    </group>
  );
};

export const NodeDot: React.FC<{
  position: [number, number, number];
  color?: string;
  size?: number;
  opacity?: number;
}> = ({ position, color = '#8a8982', size = 0.024, opacity = 0.7 }) => (
  <mesh position={position}>
    <sphereGeometry args={[size, 12, 12]} />
    <meshBasicMaterial color={color} transparent opacity={opacity} depthWrite={false} />
  </mesh>
);