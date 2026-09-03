import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { techById } from '../technologyData';
import { useUniverse } from '../UniverseContext';

const POD_COUNT = 6;

/** Pods in a small ring, spawning in subtly, rotating faster when selected. */
export const KubernetesCluster: React.FC = () => {
  const { selectedId, reduced } = useUniverse();
  const kube = techById['kubernetes'];
  const active = selectedId === 'kubernetes';
  const group = useRef<THREE.Group>(null);
  const matRefs = useRef<(THREE.MeshStandardMaterial | null)[]>([]);
  const target = useRef(new THREE.Vector3(kube.position.x, kube.position.y, kube.position.z));

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    target.current.set(kube.position.x, kube.position.y, kube.position.z - (active ? 0.6 : 0));
    g.position.lerp(target.current, Math.min(1, delta * 3.5));
    g.rotation.y += delta * (reduced ? 0.03 : active ? 0.45 : 0.16);
    for (let i = 0; i < POD_COUNT; i++) {
      const m = matRefs.current[i];
      if (m) {
        const spawn = Math.sin(t * 0.6 + i * 1.4) * 0.5 + 0.5;
        m.opacity += ((active ? 0.85 : 0.42) - m.opacity) * 0.06;
        g.children[i]?.scale.setScalar(0.7 + spawn * 0.3);
      }
    }
  });

  return (
    <group ref={group} position={[kube.position.x, kube.position.y, kube.position.z]}>
      <Html center style={{ pointerEvents: 'none' }} position={[0, 0.4, 0]} zIndexRange={[50, 30]}>
        <span className="tech-chip-label" style={{ color: active ? '#60a5fa' : '#6f6d66' }}>K8S</span>
      </Html>
      {Array.from({ length: POD_COUNT }).map((_, i) => {
        const ang = (i / POD_COUNT) * Math.PI * 2;
        const r = 0.28 + (i % 2) * 0.04;
        return (
          <mesh key={i} position={[Math.cos(ang) * r, Math.sin(ang) * r, 0]}>
            <boxGeometry args={[0.09, 0.06, 0.06]} />
            <meshStandardMaterial
              ref={(el) => { matRefs.current[i] = el; }}
              color={active ? '#60a5fa' : '#262626'}
              transparent
              opacity={0.42}
            />
          </mesh>
        );
      })}
    </group>
  );
};