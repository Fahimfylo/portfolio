import React from 'react';
import { techById } from '../technologyData';
import { useUniverse } from '../UniverseContext';
import { ParticleFlow } from './ParticleFlow';
import { NodeDot } from './atoms';

const SEGMENTS: [number, number, number][] = [
  [-1.55, 0.2, 1.15], // frontend
  [-0.1, 0.45, 1.0],
  [2.0, 0.55, 1.0], // api / node
  [2.35, 0.0, 0.6],
  [2.7, -0.6, 0.25], // database
];

/** Frontend → API → Database request traffic. */
export const ApiParticles: React.FC = () => {
  const { selectedId } = useUniverse();
  const active =
    selectedId === 'node' || selectedId === 'express' || selectedId === 'restapi' || selectedId === 'react' || selectedId === 'next';
  const boost = active ? 1 : 0;

  const frontend: [number, number, number] = [-1.55, 0.2, 1.15];
  const api: [number, number, number] = [2.0, 0.55, 1.0];
  const db: [number, number, number] = [2.7, -0.6, 0.25];
  void techById;

  return (
    <group>
      <ParticleFlow
        points={SEGMENTS}
        count={active ? 22 : 9}
        speed={active ? 0.42 : 0.16}
        boost={boost}
        color={active ? '#34d399' : '#6f6d66'}
        size={active ? 0.055 : 0.04}
      />
      <NodeDot position={frontend} color="#81807a" size={0.02} />
      <NodeDot position={api} color={active ? '#34d399' : '#81807a'} size={0.02} />
      <NodeDot position={db} color="#81807a" size={0.02} />
    </group>
  );
};