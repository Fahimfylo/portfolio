import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { techById } from '../technologyData';
import { useUniverse } from '../UniverseContext';

const SERVICES = ['API', 'Redis', 'Kafka', 'Worker', 'DB'];

const Container: React.FC<{ label: string; angle: number; radius: number; phase: number; active: boolean; reduced: boolean }> = ({
  label,
  angle,
  radius,
  phase,
  active,
  reduced,
}) => {
  const ref = useRef<THREE.Group>(null);
  const mat = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((state) => {
    const g = ref.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const speed = reduced ? 0 : active ? 0.32 : 0.14;
    const a = angle + t * speed;
    const r = active ? radius * 1.12 : radius;
    g.position.x = Math.cos(a) * r;
    g.position.z = Math.sin(a) * r * 0.7;
    g.position.y = Math.sin(t * 0.8 + phase) * 0.06;
    if (mat.current) {
      const targetOp = active ? 0.9 : 0.5;
      mat.current.opacity += (targetOp - mat.current.opacity) * 0.08;
    }
  });

  return (
    <group ref={ref}>
      <mesh>
        <boxGeometry args={[0.26, 0.16, 0.16]} />
        <meshStandardMaterial ref={mat} color={active ? '#2dd4bf' : '#262626'} transparent opacity={0.5} />
      </mesh>
      <Html center style={{ pointerEvents: 'none' }} zIndexRange={[60, 40]}>
        <span className="tech-chip-label">{label}</span>
      </Html>
    </group>
  );
};

/** Minimal abstract container cluster orbiting the Docker node. */
export const DockerCluster: React.FC = () => {
  const { selectedId, reduced } = useUniverse();
  const docker = techById['docker'];
  const group = useRef<THREE.Group>(null);
  const active = selectedId === 'docker';
  const target = useRef(new THREE.Vector3(docker.position.x, docker.position.y, docker.position.z));

  const radius = 0.72;
  const phases = useMemo(() => SERVICES.map((_, i) => i * 1.26), []);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    target.current.set(
      docker.position.x,
      docker.position.y,
      docker.position.z - (active ? 0.5 : 0),
    );
    g.position.lerp(target.current, Math.min(1, delta * 4));
  });

  return (
    <group ref={group} position={[docker.position.x, docker.position.y, docker.position.z]}>
      {SERVICES.map((label, i) => (
        <Container key={label} label={label} angle={(i * Math.PI * 2) / SERVICES.length} radius={radius} phase={phases[i]} active={active} reduced={reduced} />
      ))}
    </group>
  );
};