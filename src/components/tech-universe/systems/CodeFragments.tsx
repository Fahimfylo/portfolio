import React from 'react';
import { Html } from '@react-three/drei';
import { FloatGroup } from './atoms';

const FRAGMENTS: { text: string; pos: [number, number, number]; delay: string }[] = [
  { text: 'docker compose up', pos: [0.2, 1.95, 0.7], delay: '0s' },
  { text: 'npm run build', pos: [-2.9, -0.55, 0.0], delay: '1.2s' },
  { text: 'kafka.send()', pos: [3.1, 1.9, -1.9], delay: '2.4s' },
  { text: 'prisma.findMany()', pos: [-1.1, -2.0, -1.3], delay: '0.8s' },
  { text: 'GET /api/products', pos: [1.9, -1.35, -1.9], delay: '3.6s' },
  { text: 'redis.get("cache")', pos: [0.4, -2.1, -1.6], delay: '1.8s' },
];

/** Tiny atmospheric code snippets floating in the background. */
export const CodeFragments: React.FC = () => (
  <>
    {FRAGMENTS.map((f, i) => (
      <FloatGroup key={i} position={f.pos} amplitude={0.04} speed={0.28} phase={i * 0.7}>
        <Html center style={{ pointerEvents: 'none' }} zIndexRange={[40, 10]}>
          <span className="tech-code fade" style={{ animationDelay: f.delay }}>
            {f.text}
          </span>
        </Html>
      </FloatGroup>
    ))}
  </>
);