import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useUniverse } from '../UniverseContext';

const STAR_COUNT = 240;
const CUBE_COUNT = 9;

const seededFloat = (seed: number, mult = 1) =>
  Math.sin(seed * 127.1) * mult;

/** Background starfield + wireframe cubes creating ambient depth. */
export const Environment: React.FC = () => {
  const { reduced } = useUniverse();
  const group = useRef<THREE.Group>(null);

  const starPositions = useMemo(() => {
    const arr = new Float32Array(STAR_COUNT * 3);
    for (let i = 0; i < STAR_COUNT; i++) {
      const theta = seededFloat(i);
      const phi = seededFloat(i + 1000);
      const r = 5 + seededFloat(i + 2000) * 4;
      arr[i * 3]     = Math.cos(theta) * Math.sin(phi) * r;
      arr[i * 3 + 1] = Math.cos(phi) * r * 0.6;
      arr[i * 3 + 2] = Math.sin(theta) * Math.sin(phi) * r;
    }
    return arr;
  }, []);

  const cubeConfigs = useMemo(
    () =>
      Array.from({ length: CUBE_COUNT }).map((_, i) => ({
        pos: [
          seededFloat(i + 500) * 4,
          seededFloat(i + 600) * 3,
          seededFloat(i + 700) * 2.5 - 1.2,
        ] as [number, number, number],
        size: 0.12 + seededFloat(i + 800) * 0.08,
        rot: seededFloat(i + 900) * 6,
        speed: 0.18 + seededFloat(i + 1000) * 0.1,
      })),
    [],
  );

  useFrame((state) => {
    if (reduced || !group.current) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.y = t * 0.004;
    group.current.rotation.x = Math.sin(t * 0.001) * 0.04;
  });

  return (
    <group>
      {/* Stars */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[starPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#8a8982" size={0.018} sizeAttenuation transparent opacity={0.45} depthWrite={false} />
      </points>
      {/* Wireframe cubes */}
      <group ref={group}>
        {cubeConfigs.map((c, i) => (
          <WireCube key={i} {...c} reduced={reduced} />
        ))}
      </group>
    </group>
  );
};

const WireCube: React.FC<{
  pos: [number, number, number];
  size: number;
  rot: number;
  speed: number;
  reduced: boolean;
}> = ({ pos, size, rot, speed, reduced }) => {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const m = ref.current;
    if (!m) return;
    const t = state.clock.elapsedTime;
    m.rotation.x = rot + (reduced ? 0 : t * speed * 0.35);
    m.rotation.y = rot * 0.7 + (reduced ? 0 : t * speed * 0.25);
    m.position.y = pos[1] + Math.sin(t * speed + pos[0]) * 0.04;
  });

  return (
    <mesh ref={ref} position={pos}>
      <boxGeometry args={[size, size, size]} />
      <meshBasicMaterial color="#6f6d66" wireframe transparent opacity={0.22} depthWrite={false} />
    </mesh>
  );
};