import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { techById } from '../technologyData';
import { useUniverse } from '../UniverseContext';

const RING_TECHS = ['docker', 'kafka', 'kubernetes', 'grafana', 'redis'];

const RingPair: React.FC<{ techId: string }> = ({ techId }) => {
  const { selectedId, reduced } = useUniverse();
  const group = useRef<THREE.Group>(null);
  const matA = useRef<THREE.MeshBasicMaterial>(null);
  const matB = useRef<THREE.MeshBasicMaterial>(null);
  const ringA = useRef<THREE.Mesh>(null);
  const ringB = useRef<THREE.Mesh>(null);
  const pos = techById[techId]?.position ?? { x: 0, y: 0, z: 0 };
  const active = selectedId === techId;

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const targetOpacity = active ? 0.5 : 0;
    if (matA.current) matA.current.opacity += (targetOpacity - matA.current.opacity) * 0.08;
    if (matB.current) matB.current.opacity += (targetOpacity - matB.current.opacity) * 0.08;
    if (group.current) {
      const rate = (reduced ? 0.1 : active ? 0.5 : 0.22) * (active ? 1.4 : 1);
      group.current.rotation.z += state.clock.getDelta() * rate;
      group.current.rotation.y += state.clock.getDelta() * rate * 0.6;
    }
    const r = 0.52 + Math.sin(t * (active ? 1.6 : 0.7) + 1) * 0.05;
    if (ringA.current) ringA.current.scale.setScalar(r / 0.52);
    if (ringB.current) ringB.current.scale.setScalar((r * 0.72) / 0.52);
    void state;
  });

  return (
    <group position={[pos.x, pos.y, pos.z]}>
      <group ref={group}>
        <mesh ref={ringA} rotation={[Math.PI / 2.2, 0, 0]}>
          <torusGeometry args={[0.52, 0.006, 8, 64]} />
          <meshBasicMaterial ref={matA} color="#3f3e3a" transparent opacity={0} depthWrite={false} />
        </mesh>
        <mesh ref={ringB} rotation={[Math.PI / 1.7, Math.PI / 4, 0]}>
          <torusGeometry args={[0.52, 0.004, 8, 64]} />
          <meshBasicMaterial ref={matB} color="#34d399" transparent opacity={0} depthWrite={false} />
        </mesh>
      </group>
    </group>
  );
};

export const SelectionRings: React.FC = () => (
  <group>
    {RING_TECHS.map((id) => (
      <RingPair key={id} techId={id} />
    ))}
  </group>
);