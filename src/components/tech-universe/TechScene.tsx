import React, { useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { technologies, mobileSubset } from './technologyData';
import { useUniverse } from './UniverseContext';
import { TechnologyObject } from './TechnologyObject';
import { GlobeShell } from './systems/GlobeShell';
import { ConstellationEdges } from './systems/ConstellationEdges';
import { ConnectionPulse } from './systems/ConnectionPulse';
import { ClusterLabels } from './systems/ClusterLabels';
import { NodeTooltip } from './systems/NodeTooltip';
import { Environment } from './systems/Environment';
import { TerminalPanels } from './systems/TerminalPanels';

/* -------------------------------------------------------------------------- */
/*  Camera: keeps the globe framed on every device.                           */
/*  The distance-to-radius ratio is derived from the live viewport (fov +     */
/*  aspect) so a portrait phone, a tablet and a widescreen desktop all show   */
/*  the same "big globe with margin" composition, without the camera ever     */
/*  ending up inside the sphere. Scroll adds a gentle zoom + orbit (the orbit */
/*  lives in UniverseGroup).                                                  */
/* -------------------------------------------------------------------------- */
const CameraRig: React.FC = () => {
  const { reduced, isMobile, scrollProgressRef, globeRadius } = useUniverse();
  const pointer = useThree((s) => s.pointer);
  const size = useThree((s) => s.size);

  useFrame((state) => {
    const cam = state.camera as THREE.PerspectiveCamera;
    const t = state.clock.elapsedTime;
    const power = reduced ? 0.15 : 1;
    const sp = scrollProgressRef.current;

    const aspect = size.width / size.height || 1.6;
    const tanHalf = Math.tan(THREE.MathUtils.degToRad(cam.fov) / 2);
    const startFrac = isMobile ? 0.56 : 0.68;
    const endFrac = isMobile ? 0.68 : 0.82;
    const frac = startFrac + (endFrac - startFrac) * THREE.MathUtils.smoothstep(sp, 0, 1);

    let d = globeRadius / (frac * tanHalf);
    // Narrow screens: clamp so the globe + label halo always fits horizontally.
    const minHalfW = globeRadius * 1.28;
    const halfW = d * tanHalf * aspect;
    if (halfW < minHalfW) d = minHalfW / (tanHalf * aspect);

    const tx = Math.sin(t * 0.06) * 0.12 * power + pointer.x * 0.15 * power;
    const ty = Math.cos(t * 0.05) * 0.1 * power + pointer.y * 0.12 * power;
    const tz = d;

    cam.position.x += (tx - cam.position.x) * 0.03;
    cam.position.y += (ty - cam.position.y) * 0.03;
    cam.position.z += (tz - cam.position.z) * 0.03;
    cam.lookAt(0, 0, 0);
  });

  return null;
};

/* -------------------------------------------------------------------------- */
/*  UniverseGroup: drag rotation + ambient spin + scroll-linked orbit.         */
/*  The ambient Y spin (≈28s/revolution, with a slow axial wobble) keeps the   */
/*  globe "quietly alive" even when idle. Drag deltas are accumulated onto     */
/*  rotTargetRef (free, unbounded spin) and lerped at a snappy rate so the     */
/*  globe follows the mouse 1:1 while the ambient motion keeps running below   */
/*  it - grabbing never fights the idle animation. Scroll adds its own orbit.  */
/* -------------------------------------------------------------------------- */
const UniverseGroup: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { rotTargetRef, reduced, scrollProgressRef } = useUniverse();
  const group = useRef<THREE.Group>(null);
  const rot = useRef(new THREE.Euler(0, 0.3, 0, 'YXZ'));

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const k = Math.min(1, delta * (reduced ? 3.5 : 6));
    const sp = scrollProgressRef.current;
    const t = state.clock.elapsedTime;
    const ambient = reduced ? 0 : (t * Math.PI * 2) / 28;
    const wobble = reduced ? 0 : Math.sin(t * 0.35) * 0.06;
    const scrollRot = (sp - 0.5) * 0.9;
    rot.current.x += (rotTargetRef.current.x + wobble - rot.current.x) * k;
    rot.current.y += (rotTargetRef.current.y + ambient + scrollRot - rot.current.y) * k;
    g.rotation.copy(rot.current);
  });

  return <group ref={group}>{children}</group>;
};

/* -------------------------------------------------------------------------- */
/*  Scene.                                                                    */
/* -------------------------------------------------------------------------- */
interface TechSceneProps {
  isMobile: boolean;
}

export const TechScene: React.FC<TechSceneProps> = ({ isMobile }) => {
  const visible = isMobile ? technologies.filter((t) => mobileSubset.includes(t.id)) : technologies;
  const visibleIds = useRef(new Set(visible.map((t) => t.id)));

  return (
    <Canvas
      className="w-full h-full !bg-[#0A0A0A]"
      dpr={[1, isMobile ? 1.5 : 2]}
      gl={{ antialias: true, alpha: false }}
      camera={{ position: [0, 0, isMobile ? 13 : 11], fov: 42, near: 0.1, far: 60 }}
      resize={{ scroll: true }}
    >
      <color attach="background" args={['#0A0A0A']} />
      <fog attach="fog" args={['#0A0A0A', 10, 28]} />

      <ambientLight intensity={1.1} />
      <pointLight position={[4, 5, 6]} intensity={1.2} />
      <pointLight position={[-4, -3, 3]} intensity={0.6} color="#34d399" />
      <pointLight position={[0, 0, -4]} intensity={0.5} color="#3b82f6" />

      <CameraRig />
      <Environment />

      <UniverseGroup>
        <GlobeShell />
        <ConstellationEdges includeIds={visibleIds.current} />
        <ConnectionPulse includeIds={visibleIds.current} />
        <ClusterLabels includeIds={visibleIds.current} />

        {visible.map((tech) => (
          <TechnologyObject key={tech.id} tech={tech} />
        ))}

        <TerminalPanels mobileLimit={isMobile ? 1 : 3} />

        <NodeTooltip />
      </UniverseGroup>
    </Canvas>
  );
};