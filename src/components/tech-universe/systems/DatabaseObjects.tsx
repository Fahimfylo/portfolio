import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { techById } from '../technologyData';
import { useUniverse } from '../UniverseContext';

const cv = (y: number, r: number, active: boolean, h: number) => (
  <mesh position={[0, y, 0]}>
    <cylinderGeometry args={[r, r, h, 26, 1]} />
    <meshStandardMaterial
      color="#262626"
      transparent
      opacity={active ? 0.85 : 0.5}
      roughness={0.6}
      metalness={0.4}
    />
  </mesh>
);

/** Minimal abstract database objects: stacked cylinders (no active spin). */
export const DatabaseObjects: React.FC = () => {
  const { selectedId } = useUniverse();
  const mongodb = techById['mongodb'];
  const postgres = techById['postgres'];
  const mongoActive = selectedId === 'mongodb';
  const pgActive = selectedId === 'postgres';

  const rotateRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (rotateRef.current) rotateRef.current.rotation.y += delta * 0.25;
  });

  return (
    <group>
      {/* MongoDB: stacked cylinders */}
      <group position={[mongodb.position.x, mongodb.position.y, mongodb.position.z]}>
        {cv(-0.22, 0.2, mongoActive, 0.1)}
        {cv(0.0, 0.26, mongoActive, 0.1)}
        {cv(0.22, 0.32, mongoActive, 0.1)}
      </group>
      {/* PostgreSQL: single tall turning cylinder */}
      <group position={[postgres.position.x, postgres.position.y, postgres.position.z]}>
        <mesh ref={rotateRef} position={[0, 0, 0]}>
          <cylinderGeometry args={[0.12, 0.24, 0.5, 26, 1]} />
          <meshStandardMaterial
            color="#262626"
            transparent
            opacity={pgActive ? 0.85 : 0.5}
            roughness={0.6}
            metalness={0.4}
          />
        </mesh>
      </group>
    </group>
  );
};