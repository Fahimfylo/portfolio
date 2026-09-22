import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { edges } from '../technologyData';
import { useUniverse } from '../UniverseContext';

interface Pulse {
  id: number;
  from: string;
  to: string;
  born: number;
  duration: number;
}

const tmp = new THREE.Vector3();

/** A single glowing "bullet" traveling along one chord; self-removes on arrival.
 *  Rendered with depthTest off so the data-flow inside the globe still shows. */
const PulseDot: React.FC<{ pulse: Pulse; onDone: (id: number) => void }> = ({ pulse, onDone }) => {
  const mesh = useRef<THREE.Mesh>(null);
  const mat = useRef<THREE.MeshBasicMaterial>(null);
  const sent = useRef(false);
  const { globePositions } = useUniverse();
  const from = useMemo(() => {
    const p = globePositions[pulse.from] ?? { x: 0, y: 0, z: 0 };
    return new THREE.Vector3(p.x, p.y, p.z);
  }, [globePositions, pulse.from]);
  const to = useMemo(() => {
    const p = globePositions[pulse.to] ?? { x: 0, y: 0, z: 0 };
    return new THREE.Vector3(p.x, p.y, p.z);
  }, [globePositions, pulse.to]);

  useFrame((state) => {
    const t = (state.clock.elapsedTime - pulse.born) / pulse.duration;
    if (t >= 1) {
      if (!sent.current) {
        sent.current = true;
        onDone(pulse.id);
      }
      return;
    }
    const ease = 1 - Math.pow(1 - t, 3);
    const fade = Math.sin(Math.PI * t);
    tmp.copy(from).lerp(to, ease);
    if (mesh.current) {
      mesh.current.position.copy(tmp);
      mesh.current.scale.setScalar(0.5 + fade * 1.1);
    }
    if (mat.current) mat.current.opacity = 0.95 * fade;
  });

  return (
    <mesh ref={mesh} position={from}>
      <sphereGeometry args={[0.055, 12, 12]} />
      <meshBasicMaterial
        ref={mat}
        color="#34d399"
        transparent
        opacity={0}
        depthWrite={false}
        depthTest={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
};

/**
 * Fires glowing dots down random edges ("data in flight"). A couple pulses are
 * live at any moment so the globe always looks slightly alive. Only edges
 * between visible techs are used (mobile shows a subset). Slower on mobile;
 * disabled entirely under prefers-reduced-motion.
 */
export const ConnectionPulse: React.FC<{ includeIds?: Set<string> }> = ({ includeIds }) => {
  const { reduced, isMobile } = useUniverse();
  const [pulses, setPulses] = useState<Pulse[]>([]);
  const nextId = useRef(0);
  const iframeElapsed = useRef(0);

  const pool = useMemo(
    () => (includeIds ? edges.filter((e) => includeIds.has(e.from) && includeIds.has(e.to)) : edges),
    [includeIds],
  );

  // Track the fiber clock so `born` stays in the same timeline PulseDot reads.
  useFrame((state) => {
    iframeElapsed.current = state.clock.elapsedTime;
  });

  useEffect(() => {
    if (reduced || pool.length === 0) return;
    const iv = window.setInterval(() => {
      setPulses((prev) => {
        const cap = isMobile ? 2 : 6;
        if (prev.length >= cap) return prev;
        const pick = () => pool[Math.floor(Math.random() * pool.length)];
        const base = pick();
        const born = iframeElapsed.current;
        const duration = isMobile ? 2.1 + Math.random() * 1.2 : 1.3 + Math.random() * 0.9;
        const batch: Pulse[] = [
          { id: nextId.current++, from: base.from, to: base.to, born, duration },
        ];
        if (!isMobile && Math.random() < 0.5) {
          const second = pick();
          batch.push({ id: nextId.current++, from: second.from, to: second.to, born, duration });
        }
        return [...prev, ...batch];
      });
    }, isMobile ? 6500 : 2400);
    return () => window.clearInterval(iv);
  }, [reduced, isMobile, pool]);

  const remove = React.useCallback((id: number) => {
    setPulses((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return (
    <>
      {pulses.map((p) => (
        <PulseDot key={p.id} pulse={p} onDone={remove} />
      ))}
    </>
  );
};