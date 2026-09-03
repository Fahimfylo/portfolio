import React, { useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { technologies, mobileSubset } from './technologyData';
import { useUniverse } from './UniverseContext';
import { TechnologyObject } from './TechnologyObject';
import { Environment } from './systems/Environment';
import { SelectionRings } from './systems/Rings';
import { DockerCluster } from './systems/DockerCluster';
import { KafkaStream } from './systems/KafkaStream';
import { MonitoringGraph } from './systems/MonitoringGraph';
import { ApiParticles } from './systems/ApiParticles';
import { RedisCache } from './systems/RedisCache';
import { GitNetwork } from './systems/GitNetwork';
import { DatabaseObjects } from './systems/DatabaseObjects';
import { KubernetesCluster } from './systems/KubernetesCluster';
import { MicroserviceNetwork } from './systems/MicroserviceNetwork';
import { TerminalPanels } from './systems/TerminalPanels';
import { CodeFragments } from './systems/CodeFragments';

/* -------------------------------------------------------------------------- */
/*  Camera: slow parallax drift + follows pointer subtly.                     */
/* -------------------------------------------------------------------------- */
const CameraRig: React.FC = () => {
  const { reduced } = useUniverse();
  const pointer = useThree((s) => s.pointer);

  useFrame((state) => {
    const cam = state.camera;
    const t = state.clock.elapsedTime;
    const power = reduced ? 0.15 : 1;
    const tx =
      Math.sin(t * 0.11) * 0.35 * power +
      pointer.x * 0.35 * power;
    const ty =
      Math.cos(t * 0.09) * 0.28 * power +
      pointer.y * 0.22 * power + 0.1;
    cam.position.x += (tx - cam.position.x) * 0.025;
    cam.position.y += (ty - cam.position.y) * 0.025;
    cam.lookAt(0, 0, 0);
  });

  return null;
};

/* -------------------------------------------------------------------------- */
/*  Universe rotation group driven by drag (from DOM pointer handlers).       */
/* -------------------------------------------------------------------------- */
const UniverseGroup: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { rotTargetRef, reduced } = useUniverse();
  const group = useRef<THREE.Group>(null);
  const rot = useRef(new THREE.Euler(0, 0, 0, 'YXZ'));

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    const k = Math.min(1, delta * (reduced ? 2 : 3.5));
    rot.current.x += (rotTargetRef.current.x - rot.current.x) * k;
    rot.current.y += (rotTargetRef.current.y - rot.current.y) * k;
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
  const visible = isMobile
    ? technologies.filter((t) => mobileSubset.includes(t.id))
    : technologies;

  return (
    <Canvas
      className="w-full h-full !bg-[#0A0A0A]"
      dpr={[1, isMobile ? 1.5 : 2]}
      gl={{ antialias: true, alpha: false }}
      camera={{ position: [0, 0.2, 7], fov: 42, near: 0.1, far: 60 }}
      resize={{ scroll: true }}
    >
      <color attach="background" args={['#0A0A0A']} />
      <fog attach="fog" args={['#0A0A0A', 6, 16]} />

      <ambientLight intensity={1.1} />
      <pointLight position={[4, 5, 6]} intensity={1.2} />
      <pointLight position={[-4, -3, 3]} intensity={0.6} color="#34d399" />
      <pointLight position={[0, 0, -4]} intensity={0.5} color="#3b82f6" />

      <CameraRig />
      <UniverseGroup>
        {visible.map((tech) => (
          <TechnologyObject key={tech.id} tech={tech} />
        ))}

        {/* Systems */}
        <SelectionRings />
        <DockerCluster />
        <KafkaStream />
        <MonitoringGraph />
        <ApiParticles />
        <RedisCache />
        <GitNetwork />
        <DatabaseObjects />
        <KubernetesCluster />
        <MicroserviceNetwork />
        <Environment />
        {!isMobile && (
          <>
            <TerminalPanels />
            <CodeFragments />
          </>
        )}
      </UniverseGroup>
    </Canvas>
  );
};