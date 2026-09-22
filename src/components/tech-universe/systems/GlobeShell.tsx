import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useUniverse } from '../UniverseContext';

/** Build a lat/long wireframe as one LineSegments geometry (all rings sampled
 *  into segment pairs, each loop closed). */
function buildGrid(radius: number): THREE.BufferGeometry {
  const pts: number[] = [];
  const segs = 60;
  const toRad = Math.PI / 180;

  // Latitude (parallel) rings
  for (let lat = -60; lat <= 60; lat += 15) {
    const phi = lat * toRad;
    const r = radius * Math.cos(phi);
    const y = radius * Math.sin(phi);
    for (let i = 0; i < segs; i++) {
      const a0 = (i / segs) * Math.PI * 2;
      const a1 = ((i + 1) / segs) * Math.PI * 2;
      pts.push(r * Math.cos(a0), y, r * Math.sin(a0));
      pts.push(r * Math.cos(a1), y, r * Math.sin(a1));
    }
  }
  // Longitude (meridian) rings
  for (let lon = 0; lon < 360; lon += 30) {
    const theta = lon * toRad;
    for (let i = 0; i < segs; i++) {
      const a0 = (i / segs) * Math.PI;
      const a1 = ((i + 1) / segs) * Math.PI;
      const cos0 = Math.cos(a0), sin0 = Math.sin(a0);
      const cos1 = Math.cos(a1), sin1 = Math.sin(a1);
      pts.push(
        radius * Math.cos(theta) * sin0, radius * cos0, radius * Math.sin(theta) * sin0,
        radius * Math.cos(theta) * sin1, radius * cos1, radius * Math.sin(theta) * sin1,
      );
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pts), 3));
  return geo;
}

/**
 * The globe itself: a faint wireframe sphere, a translucent core shell that
 * hides far-side nodes, plus two slow accent rings (equator + tilted orbit).
 */
export const GlobeShell: React.FC = () => {
  const { globeRadius: radius, reduced } = useUniverse();
  const ringGroup = useRef<THREE.Group>(null);
  const grid = useMemo(() => buildGrid(radius), [radius]);

  useFrame((state, delta) => {
    if (reduced || !ringGroup.current) return;
    ringGroup.current.rotation.y += delta * 0.12;
    ringGroup.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
  });

  return (
    <group>
      {/* Core shell - BackSide so the far hemisphere reads as a solid interior
          and occludes nodes on the far side of the globe. */}
      <mesh>
        <sphereGeometry args={[radius * 0.985, 48, 48]} />
        <meshBasicMaterial color="#0b0b0b" side={THREE.BackSide} transparent opacity={0.92} depthWrite={true} />
      </mesh>

      {/* Lat/long wireframe on the surface */}
      <lineSegments geometry={grid}>
        <lineBasicMaterial color="#56544e" transparent opacity={0.16} depthWrite={false} />
      </lineSegments>

      {/* Accent rings */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius * 1.02, 0.004, 8, 128]} />
        <meshBasicMaterial color="#34d399" transparent opacity={0.3} depthWrite={false} />
      </mesh>
      <group ref={ringGroup}>
        <mesh rotation={[0.45, 0.3, 0]}>
          <torusGeometry args={[radius * 1.38, 0.003, 8, 128]} />
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.16} depthWrite={false} />
        </mesh>
      </group>
    </group>
  );
};