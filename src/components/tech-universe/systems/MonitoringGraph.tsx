import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { techById } from '../technologyData';
import { useUniverse } from '../UniverseContext';
import { ParticleFlow } from './ParticleFlow';

const N = 44;

const GraphLine: React.FC<{
  y: number;
  amp: number;
  speed: number;
  phase: number;
  color: string;
  active: boolean;
  reduced: boolean;
}> = ({ y, amp, speed, phase, color, active, reduced }) => {
  const attr = useRef<THREE.BufferAttribute>(null);
  const mat = useRef<THREE.LineBasicMaterial>(null);
  const positions = useMemo(() => new Float32Array(N * 3), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const a = reduced ? 0 : active ? amp * 1.6 : amp;
    for (let i = 0; i < N; i++) {
      const x = (i / (N - 1) - 0.5) * 1.0;
      positions[i * 3] = x;
      positions[i * 3 + 1] =
        y + Math.sin(t * speed + phase + x * 5) * a + Math.sin(t * speed * 1.7 + phase * 2 + x * 2.4) * a * 0.4;
      positions[i * 3 + 2] = 0;
    }
    if (attr.current) attr.current.needsUpdate = true;
    if (mat.current) {
      const targetOp = active ? 0.85 : 0.4;
      mat.current.opacity += (targetOp - mat.current.opacity) * 0.08;
    }
  });

  return (
    <line>
      <bufferGeometry>
        <bufferAttribute ref={attr} attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <lineBasicMaterial ref={mat} color={color} transparent opacity={0.4} depthWrite={false} />
    </line>
  );
};

/** Prometheus → Grafana: animated metric graph plus a metrics data flow. */
export const MonitoringGraph: React.FC = () => {
  const { selectedId, reduced } = useUniverse();
  const grafana = techById['grafana'];
  const prometheus = techById['prometheus'];
  const active = selectedId === 'grafana' || selectedId === 'prometheus';
  const boost = active ? 1 : 0;

  return (
    <group position={[grafana.position.x + 0.05, grafana.position.y + 0.25, grafana.position.z]}>
      <ParticleFlow
        points={[
          [prometheus.position.x + 0.1, prometheus.position.y + 0.15, prometheus.position.z],
          [grafana.position.x + 0.3, grafana.position.y + 0.35, grafana.position.z],
        ]}
        key="metrics-flow"
        count={active ? 14 : 5}
        speed={active ? 0.4 : 0.15}
        boost={boost}
        color={active ? '#a3e635' : '#5c5b55'}
        size={0.04}
      />
      <GraphLine y={0.14} amp={0.05} speed={1.1} phase={0.2} color="#34d399" active={active} reduced={reduced} />
      <GraphLine y={0.0} amp={0.04} speed={0.9} phase={1.6} color="#a3e635" active={active} reduced={reduced} />
      <GraphLine y={-0.14} amp={0.045} speed={1.3} phase={3.1} color="#fbbf24" active={active} reduced={reduced} />
      <Html position={[0.55, 0.38, 0]} center style={{ pointerEvents: 'none' }} zIndexRange={[50, 30]}>
        <span className="tech-chip-label" style={{ color: active ? '#a3e635' : '#6f6d66' }}>metrics</span>
      </Html>
    </group>
  );
};