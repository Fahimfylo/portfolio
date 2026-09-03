import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface ParticleFlowProps {
  /** Deterministic control points through the 3D scene. */
  points: [number, number, number][];
  count: number;
  speed: number;
  /** >1 when the linked system is active. */
  boost: number;
  color?: string;
  size?: number;
  baseOpacity?: number;
  depthWrite?: boolean;
}

/**
 * Small particles travelling along a fixed Catmull-Rom spline.
 * Geometry is allocated once and mutated per-frame (no React state in the loop).
 */
export const ParticleFlow: React.FC<ParticleFlowProps> = ({
  points,
  count,
  speed,
  boost,
  color = '#34d399',
  size = 0.045,
  baseOpacity = 0.8,
  depthWrite = false,
}) => {
  const curve = useMemo(
    () => new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p))),
    [points],
  );
  const positions = useMemo(() => new Float32Array(count * 3), [count]);
  const progress = useMemo(
    () => Float32Array.from({ length: count }, () => Math.random()),
    [count],
  );
  const attrRef = useRef<THREE.BufferAttribute>(null);
  const matRef = useRef<THREE.PointsMaterial>(null);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const spd = speed * (1 + boost * 1.4);
    const step = dt * spd;
    for (let i = 0; i < count; i++) {
      progress[i] += step;
      if (progress[i] > 1) progress[i] -= 1;
      const v = curve.getPoint(progress[i] * (points.length - 1));
      positions[i * 3] = v.x;
      positions[i * 3 + 1] = v.y;
      positions[i * 3 + 2] = v.z;
    }
    if (attrRef.current) {
      attrRef.current.needsUpdate = true;
    }
    if (matRef.current) {
      const targetOpacity = (1 - boost * 0.25) * baseOpacity;
      matRef.current.opacity += (targetOpacity - matRef.current.opacity) * 0.1;
      void state;
    }
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          ref={attrRef}
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={matRef}
        color={color}
        size={size}
        sizeAttenuation
        transparent
        opacity={baseOpacity}
        depthWrite={depthWrite}
      />
    </points>
  );
};