import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { techById } from '../technologyData';
import { useUniverse } from '../UniverseContext';
import { NodeDot } from './atoms';
import { ParticleFlow } from './ParticleFlow';

const NODES: Record<string, { pos: [number, number, number] }> = {
  api:     { pos: [-0.3, -0.05, -0.75] },
  auth:    { pos: [-0.7, -0.45, -0.8] },
  orders:  { pos: [0.1, 0.55, -0.7] },
  users:   { pos: [-0.45, 0.25, -0.9] },
  payments:{ pos: [0.55, 0.2, -0.8] },
  worker:  { pos: [0.65, -0.35, -0.7] },
  db:      { pos: [0.3, -0.6, -0.85] },
};

const LINE_PAIRS: [string, string][] = [
  ['api', 'auth'], ['api', 'orders'], ['api', 'users'], ['api', 'payments'],
  ['api', 'worker'], ['orders', 'db'], ['worker', 'db'],
];

/** Subtle microservice network in the mid-background. */
export const MicroserviceNetwork: React.FC = () => {
  const { selectedId, reduced } = useUniverse();
  const active = selectedId === 'microservices' || selectedId === 'node' || selectedId === 'docker';
  const boost = active ? 1 : 0;

  const lines = useMemo(() => {
    const pts = new Float32Array(LINE_PAIRS.length * 6);
    LINE_PAIRS.forEach(([a, b], i) => {
      const av = NODES[a].pos;
      const bv = NODES[b].pos;
      pts[i * 6]     = av[0]; pts[i * 6 + 1] = av[1]; pts[i * 6 + 2] = av[2];
      pts[i * 6 + 3] = bv[0]; pts[i * 6 + 4] = bv[1]; pts[i * 6 + 5] = bv[2];
    });
    return pts;
  }, []);

  const attr = useRef<THREE.BufferAttribute>(null);
  const mat = useRef<THREE.LineBasicMaterial>(null);

  useFrame((_, delta) => {
    if (mat.current) {
      const target = active ? 0.55 : 0.25;
      mat.current.opacity += (target - mat.current.opacity) * 0.06;
    }
    void delta;
    void reduced;
  });

  return (
    <group position={[0, -0.2, -1.6]}>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute ref={attr} attach="attributes-position" args={[lines, 3]} />
        </bufferGeometry>
        <lineBasicMaterial ref={mat} color="#8a8982" transparent opacity={0.25} depthWrite={false} />
      </lineSegments>
      {Object.values(NODES).map(({ pos }, i) => (
        <NodeDot key={i} position={pos} color={active ? '#34d399' : '#6f6d66'} size={0.018} opacity={active ? 0.8 : 0.55} />
      ))}
      <ParticleFlow
        points={[NODES.api.pos, NODES.orders.pos, NODES.worker.pos, NODES.db.pos, NODES.api.pos]}
        count={active ? 8 : 3}
        speed={active ? 0.35 : 0.12}
        boost={boost}
        color="#6f6d66"
        size={0.028}
        baseOpacity={0.6}
      />
    </group>
  );
};