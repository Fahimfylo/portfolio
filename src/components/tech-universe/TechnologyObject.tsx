import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Technology, isRelated } from './technologyData';
import { useUniverse } from './UniverseContext';

const ICON_BASE = 30;
const NEAR_FAR = 3.8; // (z - minZ) width used for parallax lane

export const TechnologyObject: React.FC<{ tech: Technology }> = ({ tech }) => {
  const { selectedId, setSelectedId, pointerDragRef, reduced, isMobile } = useUniverse();
  const groupRef = useRef<THREE.Group>(null);
  const target = useRef(new THREE.Vector3(tech.position.x, tech.position.y, tech.position.z));

  const base = useMemo(
    () => new THREE.Vector3(tech.position.x, tech.position.y, tech.position.z),
    [tech.position.x, tech.position.y, tech.position.z],
  );

  const depthMult = 1 + tech.position.z * 0.18;
  const isSelected = selectedId === tech.id;
  const dimmed = selectedId !== null && !isSelected && !isRelated(selectedId, tech.id);
  const opacity = (dimmed ? 0.24 : 1) * Math.min(1, 0.72 + ((tech.position.z + 2) / NEAR_FAR) * 0.5);
  const iconSize = Math.round(ICON_BASE * tech.scale * depthMult);
  const color = isSelected ? '#34d399' : dimmed ? '#6b6a66' : tech.tier === 1 ? '#e7e5de' : '#c9c7bf';

  useFrame((state, delta) => {
    const g = groupRef.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const lane = Math.min(1, Math.max(0, (tech.position.z + 2) / NEAR_FAR));
    const par = reduced ? 0 : 0.05 + lane * 0.25;
    const amp = reduced ? 0 : tech.animation.amplitude;
    const tx =
      base.x +
      Math.cos(t * tech.animation.speed * 0.7 + tech.animation.phase) * amp * 0.5 +
      state.pointer.x * par * 0.55;
    const ty =
      base.y +
      Math.sin(t * tech.animation.speed + tech.animation.phase) * amp +
      state.pointer.y * par * 0.4;
    const tz = base.z - (isSelected ? 0.45 : 0);
    target.current.set(tx, ty, tz);
    g.position.lerp(target.current, Math.min(1, delta * 5));
  });

  return (
    <group ref={groupRef} position={[tech.position.x, tech.position.y, tech.position.z]}>
      <Html center style={{ pointerEvents: 'auto' }} zIndexRange={[40, 20]}>
        <button
          type="button"
          aria-label={`${tech.name}, ${tech.description}`}
          onClick={(e) => {
            e.stopPropagation();
            if (pointerDragRef.current.wasDrag) return;
            setSelectedId(isSelected ? null : tech.id);
          }}
          className="tech-chip"
          style={{ opacity }}
        >
          <span className="tech-chip-icon">
            <tech.icon size={iconSize} color={color} />
          </span>
          {(!isMobile || isSelected) && (
            <span className="tech-chip-label" style={{ opacity: tech.tier === 3 ? 0.6 : 0.9 }}>
              {tech.name}
            </span>
          )}
        </button>
      </Html>
    </group>
  );
};