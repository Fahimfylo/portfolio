import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { techById } from '../technologyData';
import { useUniverse } from '../UniverseContext';

/**
 * Redis cache: particles streak in/out of the node and a HIT/MISS ping oscillates.
 * Geometry reuses one shared attribute; only material opacities change per frame.
 */
export const RedisCache: React.FC = () => {
  const { selectedId, reduced } = useUniverse();
  const redis = techById['redis'];
  const active = selectedId === 'redis' || selectedId === 'node';
  const N = 26;

  const offsets = useMemo(
    () =>
      Array.from({ length: N }, (_, i) => {
        const ang = (i / N) * Math.PI * 2;
        const r = 0.34;
        return { a: ang, r: r + (i % 3) * 0.08 };
      }),
    [N],
  );
  const dynamics = useMemo(() => Float32Array.from({ length: N }, () => Math.random()), [N]);
  const positions = useMemo(() => new Float32Array(N * 3), [N]);
  const attr = useRef<THREE.BufferAttribute>(null);
  const mat = useRef<THREE.PointsMaterial>(null);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    for (let i = 0; i < N; i++) {
      const o = offsets[i];
      const p = (t * (active ? 0.8 : 0.35) * 0.3 + dynamics[i]) % 1;
      const goingIn = p < 0.5;
      const f = goingIn ? p * 2 : 1 - (p - 0.5) * 2;
      const rad = o.r * f;
      positions[i * 3] = redis.position.x + Math.cos(o.a) * rad;
      positions[i * 3 + 1] = redis.position.y + Math.sin(o.a) * rad;
      positions[i * 3 + 2] = redis.position.z + Math.sin(t * 0.5) * 0.02;
    }
    if (attr.current) attr.current.needsUpdate = true;
    if (mat.current) {
      const targetOp = active ? 0.95 : 0.45;
      mat.current.opacity += (targetOp - mat.current.opacity) * 0.08;
      mat.current.size = active ? 0.05 : 0.035;
    }
    void delta;
    void reduced;
  });

  return (
    <group>
      <points position={[redis.position.x, redis.position.y, redis.position.z]}>
        <bufferGeometry>
          <bufferAttribute ref={attr} attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial ref={mat} color="#f43f5e" size={0.035} sizeAttenuation transparent opacity={0.45} depthWrite={false} />
      </points>
      <Html
        position={[redis.position.x, redis.position.y + 0.34, redis.position.z]}
        center
        style={{ pointerEvents: 'none' }}
        zIndexRange={[50, 30]}
      >
        <span className={`cache-chip ${active ? 'hit' : 'miss'}`}>{active ? 'CACHE HIT' : 'CACHE MISS'}</span>
      </Html>
    </group>
  );
};