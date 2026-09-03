import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { UniverseProvider, useUniverse } from './UniverseContext';
import { TechScene } from './TechScene';
import { InfoCard } from './InfoCard';
import { Instructions } from './Instructions';
import { StaticFallback } from './StaticFallback';
import { supportsWebGL, useIsMobile, useReducedMotion } from './hooks';

/* -------------------------------------------------------------------------- */
/*  WebGL error boundary – stops a GPU crash from taking down the whole site. */
/* -------------------------------------------------------------------------- */
interface BoundaryState { failed: boolean; }
class WebGLBoundary extends React.Component<{ fallback: React.ReactNode; children: React.ReactNode }, BoundaryState> {
  state: BoundaryState = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/* -------------------------------------------------------------------------- */
/*  Inner component that can safely call useUniverse().                       */
/* -------------------------------------------------------------------------- */
const _UniverseInner: React.FC<{ isMobile: boolean; reduced: boolean }> = ({ isMobile, reduced }) => {
  const { setSelectedId, rotTargetRef, pointerDragRef } = useUniverse();
  const sectionRef = useRef<HTMLDivElement>(null);

  const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

  /* ---- Drag-to-rotate via window listeners (no pointer capture, so DOM
           clicks inside the scene still reach their original targets) ---- */
  const start = useRef({ x: 0, y: 0 });
  const winListening = useRef(false);
  const moveFns = useRef<{ m: (e: PointerEvent) => void; u: (e: PointerEvent) => void }>({
    m: () => {},
    u: () => {},
  });

  useEffect(() => {
    const detach = () => {
      if (!winListening.current) return;
      winListening.current = false;
      window.removeEventListener('pointermove', moveFns.current.m);
      window.removeEventListener('pointerup', moveFns.current.u);
      window.removeEventListener('pointercancel', moveFns.current.u);
    };
    return detach;
  }, []);

  moveFns.current.m = (e: PointerEvent) => {
    if (!(e.buttons & 1)) return;
    const dx = e.clientX - start.current.x;
    const dy = e.clientY - start.current.y;
    if (Math.abs(dx) + Math.abs(dy) > 6) {
      pointerDragRef.current.wasDrag = true;
      const power = reduced ? 0.15 : 1;
      rotTargetRef.current.y = clamp(rotTargetRef.current.y + dx * 0.004 * power, -0.4, 0.4);
      rotTargetRef.current.x = clamp(rotTargetRef.current.x + dy * 0.003 * power, -0.3, 0.3);
      start.current = { x: e.clientX, y: e.clientY };
    }
  };
  moveFns.current.u = () => {
    if (!winListening.current) return;
    winListening.current = false;
    window.removeEventListener('pointermove', moveFns.current.m);
    window.removeEventListener('pointerup', moveFns.current.u);
    window.removeEventListener('pointercancel', moveFns.current.u);
    // releases once the browser's click has been dispatched
    setTimeout(() => { pointerDragRef.current.wasDrag = false; }, 30);
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    start.current = { x: e.clientX, y: e.clientY };
    if (winListening.current) return;
    winListening.current = true;
    window.addEventListener('pointermove', moveFns.current.m);
    window.addEventListener('pointerup', moveFns.current.u);
    window.addEventListener('pointercancel', moveFns.current.u);
  };

  /* Click on empty canvas area deselects (chips stopPropagation themselves) */
  const onSectionClick = () => {
    if (pointerDragRef.current.wasDrag) return;
    setSelectedId(null);
  };

  const webgl = supportsWebGL();

  return (
    <section
      id="stack"
      ref={sectionRef}
      onPointerDown={onPointerDown}
      onClick={onSectionClick}
      className="dark-section relative bg-[#0A0A0A] text-[#E8E6E0] py-24 sm:py-28 px-6 md:px-12 border-t border-white/5 overflow-hidden"
      style={{ touchAction: 'pan-y', userSelect: 'none', WebkitUserSelect: 'none' }}
      aria-label="Technology Universe - interactive 3D visualization of technologies"
    >
      <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16 select-none">

        {/* ── Section Header (matches existing portfolio headline pattern) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-black tracking-tight text-[#E8E6E0] uppercase leading-[1]"
            >
              THE STACK <br className="hidden sm:block" />
              BEHIND MY WORK /
            </motion.h2>
          </div>
          <div className="lg:col-span-5 flex flex-col justify-end space-y-3 pt-2 lg:pt-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xs font-mono uppercase tracking-widest text-[#888888]"
            >
              (TECHNOLOGY UNIVERSE)
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-sm md:text-base text-[#888888] font-sans leading-relaxed max-w-xl"
            >
              Explore the full stack, infrastructure, messaging and observability ecosystem that powers
              production-grade applications — in an interactive 3D environment.
            </motion.p>
          </div>
        </div>

        <div className="w-full h-[1px] bg-white/10" />

        {/* ── 3D Canvas Container ── */}
        <div
          className="relative w-full rounded-2xl overflow-hidden border border-white/5"
          style={{ height: isMobile ? 'clamp(380px, 56vh, 560px)' : 'clamp(480px, 66vh, 780px)' }}
        >
          {webgl ? (
            <WebGLBoundary fallback={<StaticFallback isMobile={isMobile} />}>
              <TechScene isMobile={isMobile} />
            </WebGLBoundary>
          ) : (
            <StaticFallback isMobile={isMobile} />
          )}

          {/* DOM overlays sitting above the WebGL layer */}
          <InfoCard />
          <Instructions />
        </div>
      </div>
    </section>
  );
};

/* -------------------------------------------------------------------------- */
/*  Public export.                                                            */
/* -------------------------------------------------------------------------- */
export const TechnologyUniverse: React.FC = () => {
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();

  return (
    <UniverseProvider>
      <_UniverseInner isMobile={isMobile} reduced={reduced} />
    </UniverseProvider>
  );
};