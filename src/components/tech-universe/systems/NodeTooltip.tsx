import React from 'react';
import { Html } from '@react-three/drei';
import { techById } from '../technologyData';
import { useUniverse } from '../UniverseContext';

/** Small monospace floating label (1-line description) anchored just above a
 *  node. Desktop: followa hover; mobile: follows the tapped selection.
 *  pointer-events: none so it never swallows the chip hover beneath it, and
 *  it's a single shared element (max one visible) - not one Html per node. */
export const NodeTooltip: React.FC = () => {
  const { isMobile, hoveredId, selectedId, globePositions, globeRadius } = useUniverse();

  const id = isMobile ? selectedId : hoveredId ?? selectedId;
  if (!id) return null;

  const tech = techById[id];
  if (!tech) return null;

  const p = globePositions[id] ?? { x: 0, y: 0, z: 0 };
  const l = Math.hypot(p.x, p.y, p.z) || 1;
  const radius = globeRadius + 0.85;
  const pos: [number, number, number] = [
    (p.x / l) * radius,
    (p.y / l) * radius + 0.45,
    (p.z / l) * radius,
  ];

  return (
    <Html
      position={pos}
      center
      zIndexRange={[60, 40]}
      style={{ pointerEvents: 'none' }}
    >
      <div className="tech-tooltip">
        <span className="tech-tooltip-name">{tech.name}</span>
        <span className="tech-tooltip-desc">{tech.description}</span>
      </div>
    </Html>
  );
};