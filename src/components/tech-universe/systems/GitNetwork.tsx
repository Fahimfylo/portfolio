import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { techById } from '../technologyData';
import { useUniverse } from '../UniverseContext';

/** Abstract commit branch structure that slowly grows. */
export const GitNetwork: React.FC = () => {
  const { selectedId, reduced } = useUniverse();
  const git = techById['git'];
  const active = selectedId === 'git' || selectedId === 'github';
  const count = active ? 4 : 2;

  const lineData = useMemo(() => {
    const y0 = git.position.y;
    const commits = Array.from({ length: count * 2 + 1 }, (_, i) => 0 + i * 0.14);
    const main = commits.map((d, i) => new THREE.Vector3(git.position.x + d - 0.5, y0, git.position.z));
    const branchA = commits.slice(0, 3).map((d, i) => new THREE.Vector3(git.position.x + d - 0.5, y0 + 0.2 + i % 2 * 0.06, git.position.z));
    const branchB = commits.slice(0, 3).map((d, i) => new THREE.Vector3(git.position.x + d - 0.5, y0 - 0.2 - i % 2 * 0.06, git.position.z));
    return { main, branchA, branchB };
  }, [git.position.x, git.position.y, git.position.z, count]);

  const mainPos = useMemo(() => new Float32Array(lineData.main.length * 3), [lineData.main]);
  const aPos = useMemo(() => new Float32Array(lineData.branchA.length * 3), [lineData.branchA]);
  const bPos = useMemo(() => new Float32Array(lineData.branchB.length * 3), [lineData.branchB]);

  const fill = (arr: Float32Array, pts: THREE.Vector3[]) => {
    pts.forEach((p, i) => {
      arr[i * 3] = p.x;
      arr[i * 3 + 1] = p.y;
      arr[i * 3 + 2] = p.z;
    });
  };
  fill(mainPos, lineData.main);
  fill(aPos, lineData.branchA);
  fill(bPos, lineData.branchB);

  const mainAttr = useRef<THREE.BufferAttribute>(null);
  const aAttr = useRef<THREE.BufferAttribute>(null);
  const bAttr = useRef<THREE.BufferAttribute>(null);
  const matRef = useRef<THREE.LineBasicMaterial>(null);

  useFrame((_, delta) => {
    const targetOp = active ? 0.8 : 0.35;
    if (matRef.current) matRef.current.opacity += (targetOp - matRef.current.opacity) * 0.08;
    void delta;
    void reduced;
  });

  return (
    <group>
      <line>
        <bufferGeometry>
          <bufferAttribute ref={mainAttr} attach="attributes-position" args={[mainPos, 3]} />
        </bufferGeometry>
        <lineBasicMaterial ref={matRef} color="#34d399" transparent opacity={0.35} depthWrite={false} />
      </line>
      <line>
        <bufferGeometry>
          <bufferAttribute ref={aAttr} attach="attributes-position" args={[aPos, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#6f6d66" transparent opacity={0.3} depthWrite={false} />
      </line>
      <line>
        <bufferGeometry>
          <bufferAttribute ref={bAttr} attach="attributes-position" args={[bPos, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#6f6d66" transparent opacity={0.3} depthWrite={false} />
      </line>
      {lineData.main.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.022, 10, 10]} />
          <meshBasicMaterial color={i === 0 ? '#34d399' : '#8a8982'} transparent opacity={active ? 0.95 : 0.6} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
};