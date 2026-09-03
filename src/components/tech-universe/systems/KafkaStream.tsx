import React from 'react';
import { Html } from '@react-three/drei';
import { techById } from '../technologyData';
import { useUniverse } from '../UniverseContext';
import { ParticleFlow } from './ParticleFlow';
import { NodeDot } from './atoms';
import { FloatGroup } from './atoms';

/** Kafka event stream: producers → brokers → consumers, as travelling particles. */
export const KafkaStream: React.FC = () => {
  const { selectedId } = useUniverse();
  const kafka = techById['kafka'];
  const active = selectedId === 'kafka';
  const boost = active ? 1 : 0;

  const hub: [number, number, number] = [kafka.position.x, kafka.position.y, kafka.position.z];
  const producer: [number, number, number] = [kafka.position.x - 0.85, kafka.position.y + 0.42, kafka.position.z];
  const consumer: [number, number, number] = [kafka.position.x + 0.85, kafka.position.y - 0.35, kafka.position.z + 0.1];

  return (
    <group>
      <ParticleFlow
        points={[producer, hub, consumer]}
        count={active ? 26 : 12}
        speed={active ? 0.34 : 0.16}
        boost={boost}
        color={active ? '#34d399' : '#6f6d66'}
        size={active ? 0.06 : 0.04}
      />
      <FloatGroup position={producer} amplitude={0.02}>
        <NodeDot position={[0, 0, 0]} color="#34d399" size={0.03} />
      </FloatGroup>
      <FloatGroup position={consumer} amplitude={0.02}>
        <NodeDot position={[0, 0, 0]} color="#81807a" size={0.03} />
      </FloatGroup>
      <FloatGroup position={[producer[0], producer[1] + 0.22, producer[2]]} amplitude={0.02}>
        <Html center style={{ pointerEvents: 'none' }} zIndexRange={[50, 30]}>
          <span className="tech-chip-label" style={{ color: active ? '#34d399' : '#6f6d66' }}>producers</span>
        </Html>
      </FloatGroup>
      <FloatGroup position={[consumer[0], consumer[1] - 0.22, consumer[2]]} amplitude={0.02}>
        <Html center style={{ pointerEvents: 'none' }} zIndexRange={[50, 30]}>
          <span className="tech-chip-label" style={{ color: '#6f6d66' }}>consumers</span>
        </Html>
      </FloatGroup>
    </group>
  );
};