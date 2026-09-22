import React, { createContext, useContext, useMemo, useRef, useState } from 'react';
import { useIsMobile, useReducedMotion } from './hooks';
import { buildGlobePositions, globeRadiusFor, Vec3 } from './globeLayout';

export interface PointerDragState {
  wasDrag: boolean;
}

export interface RotationTarget {
  x: number;
  y: number;
}

interface UniverseContextValue {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  hoveredId: string | null;
  setHoveredId: React.Dispatch<React.SetStateAction<string | null>>;
  /** Normalized scroll progress (0..1) of the section stage - written by the
   *  section's useScroll, read each frame by the camera/rotation rigs. */
  scrollProgressRef: React.MutableRefObject<number>;
  /** Globe geometry shared by every subsystem so they all agree on a layout. */
  globeRadius: number;
  globePositions: Record<string, Vec3>;
  isMobile: boolean;
  reduced: boolean;
  pointerDragRef: React.MutableRefObject<PointerDragState>;
  rotTargetRef: React.MutableRefObject<RotationTarget>;
}

const UniverseContext = createContext<UniverseContextValue | null>(null);

export const useUniverse = (): UniverseContextValue => {
  const ctx = useContext(UniverseContext);
  if (!ctx) throw new Error('useUniverse must be used within <UniverseProvider>');
  return ctx;
};

export const UniverseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const reduced = useReducedMotion();
  const pointerDragRef = useRef<PointerDragState>({ wasDrag: false });
  const rotTargetRef = useRef<RotationTarget>({ x: 0, y: 0 });
  const scrollProgressRef = useRef(0);

  const globeRadius = useMemo(() => globeRadiusFor(isMobile), [isMobile]);
  const globePositions = useMemo(() => buildGlobePositions(globeRadius), [globeRadius]);

  const value = useMemo(
    () => ({
      selectedId,
      setSelectedId,
      hoveredId,
      setHoveredId,
      scrollProgressRef,
      globeRadius,
      globePositions,
      isMobile,
      reduced,
      pointerDragRef,
      rotTargetRef,
    }),
    [selectedId, hoveredId, isMobile, reduced, globeRadius, globePositions],
  );

  return <UniverseContext.Provider value={value}>{children}</UniverseContext.Provider>;
};