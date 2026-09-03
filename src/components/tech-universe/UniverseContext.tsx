import React, { createContext, useContext, useMemo, useRef, useState } from 'react';
import { useIsMobile, useReducedMotion } from './hooks';

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
  const isMobile = useIsMobile();
  const reduced = useReducedMotion();
  const pointerDragRef = useRef<PointerDragState>({ wasDrag: false });
  const rotTargetRef = useRef<RotationTarget>({ x: 0, y: 0 });

  const value = useMemo(
    () => ({ selectedId, setSelectedId, isMobile, reduced, pointerDragRef, rotTargetRef }),
    [selectedId, isMobile, reduced],
  );

  return <UniverseContext.Provider value={value}>{children}</UniverseContext.Provider>;
};