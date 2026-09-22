import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Technology, isRelated, introDelayOf } from './technologyData';
import { useUniverse } from './UniverseContext';

const ICON_BASE = 30;

export const TechnologyObject: React.FC<{ tech: Technology }> = ({ tech }) => {
  const { selectedId, setSelectedId, hoveredId, setHoveredId, pointerDragRef, reduced, isMobile, globePositions, globeRadius } =
    useUniverse();
  const groupRef = useRef<THREE.Group>(null);
  const startPos = globePositions[tech.id] ?? { x: 0, y: 0, z: 0 };
  const target = useRef(new THREE.Vector3(startPos.x, startPos.y, startPos.z));

  // Sit just above the shell surface so chips read as sitting ON the globe.
  const base = useMemo(() => {
    const p = globePositions[tech.id] ?? { x: 0, y: 0, z: 0 };
    const l = Math.hypot(p.x, p.y, p.z) || 1;
    const lift = (globeRadius + 0.055) / l;
    return new THREE.Vector3(p.x * lift, p.y * lift, p.z * lift);
  }, [globePositions, globeRadius, tech.id]);

  const depthMult = 1 + startPos.z * 0.08;
  const isSelected = selectedId === tech.id;
  const isHovered = hoveredId === tech.id;
  const focusId = hoveredId ?? selectedId;
  const dimmed = focusId !== null && !isRelated(focusId, tech.id);
  // When hovering the whole graph, the hovered node keeps full opacity too.
  const dimmedActive = dimmed && !isHovered;
  const depthLane = Math.min(1, Math.max(0, (startPos.z + globeRadius) / (globeRadius * 2)));
  const opacity = (dimmedActive ? 0.24 : 1) * (0.6 + depthLane * 0.52);
  const iconSize = Math.round(ICON_BASE * tech.scale * depthMult * (isSelected ? 1.22 : 1));
  const color = isSelected || isHovered
    ? '#34d399'
    : dimmedActive
      ? '#6b6a66'
      : tech.tier === 1
        ? '#e7e5de'
        : '#c9c7bf';

  useFrame((state, delta) => {
    const g = groupRef.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const par = reduced ? 0 : 0.035 + depthLane * 0.08;
    const amp = reduced ? 0 : tech.animation.amplitude;
    const tx =
      base.x +
      Math.cos(t * tech.animation.speed * 0.7 + tech.animation.phase) * amp * 0.45 +
      state.pointer.x * par * 0.5;
    const ty =
      base.y +
      Math.sin(t * tech.animation.speed + tech.animation.phase) * amp +
      state.pointer.y * par * 0.4;
    target.current.set(tx, ty, base.z);
    g.position.lerp(target.current, Math.min(1, delta * 5));
  });

  return (
    <group ref={groupRef} position={[base.x, base.y, base.z]}>
      <Html center style={{ pointerEvents: 'auto' }} zIndexRange={[40, 20]}>
        <button
          type="button"
          aria-label={`${tech.name}, ${tech.description}`}
          onPointerEnter={() => {
            if (isMobile || pointerDragRef.current.wasDrag) return;
            setHoveredId((h) => (h === tech.id ? h : tech.id));
          }}
          onPointerLeave={() => {
            if (isMobile) return;
            setHoveredId((h) => (h === tech.id ? null : h));
          }}
          onClick={(e) => {
            e.stopPropagation();
            if (pointerDragRef.current.wasDrag) return;
            setSelectedId(isSelected ? null : tech.id);
            setHoveredId(null);
          }}
          className="tech-chip"
          style={{ opacity }}
        >
          <span className="tech-chip-inner" style={{ '--intro-delay': `${introDelayOf(tech)}ms` } as React.CSSProperties}>
            <span className="tech-chip-icon">
              <tech.icon size={iconSize} color={color} />
            </span>
            {(!isMobile || isSelected) && (
              <span className="tech-chip-label" style={{ opacity: tech.tier === 3 ? 0.6 : 0.9 }}>
                {tech.name}
              </span>
            )}
          </span>
        </button>
      </Html>
    </group>
  );
};