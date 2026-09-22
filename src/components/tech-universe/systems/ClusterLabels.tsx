import React from 'react';
import { Html } from '@react-three/drei';
import { clusterOrder, clusters, clusterOf } from '../technologyData';
import { technologies } from '../technologyData';
import { useUniverse } from '../UniverseContext';

/** Faint (…) captions hovering just outside the globe, one per cluster
 *  "continent", plus a small anchor dot at the continent's centroid on the
 *  surface. Position = centroid direction pushed radially outward. */
export const ClusterLabels: React.FC<{ includeIds?: Set<string> }> = ({ includeIds }) => {
  const { globePositions, globeRadius } = useUniverse();

  return (
    <group>
      {clusterOrder.map((cid, i) => {
        const def = clusters.find((c) => c.id === cid);
        if (!def) return null;
        const members = technologies.filter(
          (t) => clusterOf(t) === cid && (!includeIds || includeIds.has(t.id)),
        );
        if (members.length === 0) return null;

        // Centroid of the members on the globe surface.
        const sum = members.reduce(
          (acc, t) => {
            const p = globePositions[t.id] ?? { x: 0, y: 0, z: 0 };
            acc.x += p.x;
            acc.y += p.y;
            acc.z += p.z;
            return acc;
          },
          { x: 0, y: 0, z: 0 },
        );
        const l = Math.hypot(sum.x, sum.y, sum.z) || 1;
        const outR = globeRadius * 1.62;
        const labelPos: [number, number, number] = [
          (sum.x / l) * outR,
          (sum.y / l) * outR,
          (sum.z / l) * outR,
        ];
        const centroidPos: [number, number, number] = [
          (sum.x / l) * globeRadius,
          (sum.y / l) * globeRadius,
          (sum.z / l) * globeRadius,
        ];

        return (
          <group key={cid}>
            <group position={labelPos}>
              <Html center style={{ pointerEvents: 'none' }} zIndexRange={[25, 5]}>
                <div className="cluster-label" style={{ animationDelay: `${0.45 + i * 0.14}s` }}>
                  ({def.label})
                  <span className="cluster-hint"> {def.hint}</span>
                </div>
              </Html>
            </group>
            <mesh position={centroidPos}>
              <sphereGeometry args={[0.024, 8, 8]} />
              <meshBasicMaterial color="#57554f" transparent opacity={0.45} depthWrite={false} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};