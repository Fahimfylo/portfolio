import React from 'react';
import { Html } from '@react-three/drei';
import { FloatGroup } from './atoms';

const TERMINALS: {
  pos: [number, number, number];
  lines: { cmd?: boolean; ok?: boolean; text: string }[];
}[] = [
  {
    pos: [-1.6, 3.6, -1.4],
    lines: [
      { text: '$ docker compose up' },
      { cmd: false, text: 'api        running' },
      { cmd: false, text: 'redis      running' },
      { cmd: false, text: 'kafka      running' },
    ],
  },
  {
    pos: [3.4, -1.8, -1.6],
    lines: [
      { text: '$ npm run dev' },
      { ok: true, text: 'Server running :5000' },
      { ok: true, text: 'MongoDB connected' },
    ],
  },
  {
    pos: [-3.3, 0.35, -0.9],
    lines: [
      { text: '$ npm run build' },
      { ok: true, text: 'dist/ ready' },
      { cmd: false, text: 'gzip 134.8 kB' },
    ],
  },
];

/** Floating translucent terminal panels adding atmosphere to the scene. */
export const TerminalPanels: React.FC<{ mobileLimit?: number }> = ({ mobileLimit = 1 }) => (
  <>
    {TERMINALS.map((t, i) => (
      <FloatGroup key={i} position={t.pos} amplitude={0.025} speed={0.35} phase={i * 1.8}>
        <Html center style={{ pointerEvents: 'none' }} zIndexRange={[50, 20]}>
          <div
            className="tech-terminal"
            style={{ width: i < mobileLimit ? 130 : 120, opacity: i >= mobileLimit ? 0.65 : 1, transform: i >= mobileLimit ? 'scale(0.88)' : undefined }}
          >
            <div className="term-title">
              <span className="dot" style={{ background: '#f43f5e' }} />
              <span className="dot" style={{ background: '#fbbf24' }} />
              <span className="dot" style={{ background: '#34d399' }} />
            </div>
            {t.lines.map((l, j) => (
              <div key={j} className={l.cmd ? 'cmd' : l.ok ? 'ok' : undefined}>
                {l.text}
              </div>
            ))}
          </div>
        </Html>
      </FloatGroup>
    ))}
  </>
);