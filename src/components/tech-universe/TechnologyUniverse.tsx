import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValueEvent, useScroll } from 'motion/react';
import { UniverseProvider, useUniverse } from './UniverseContext';
import { TechScene } from './TechScene';
import { InfoCard } from './InfoCard';
import { Instructions } from './Instructions';
import { StaticFallback } from './StaticFallback';
import { supportsWebGL, useIsMobile, useReducedMotion } from './hooks';
import './tech-universe.css';

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
  const { setSelectedId, rotTargetRef, pointerDragRef, scrollProgressRef } = useUniverse();
  const stageWrapRef = useRef<HTMLDivElement>(null);

  /* ---- Scroll-driven camera / rotation ---------------------------------
   * Desktop: the section body is 230vh tall and holds a full-viewport
   * `position: sticky` stage. `scrollYProgress` therefore goes 0→1 across
   * exactly the pin, so the camera can orbit from a wide constellation shot
   * into the MERN cluster while the stage stays pinned to the viewport.
   * Mobile: no pinning – the box scrolls past and the progress drives a
   * simple scroll-linked rotation instead. The value is written straight
   * into a mutable ref (no React re-render per frame) and consumed by the
   * CameraRig / UniverseGroup inside the Canvas. */
  const { scrollYProgress } = useScroll({
    target: stageWrapRef,
    offset: isMobile ? ['start end', 'end start'] : ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    scrollProgressRef.current = v;
  });

  /* ---- Lazy init: only spin up WebGL once the stage approaches viewport,
   *        then latch so scroll-away/back never tears down the GL context. */
  const stageInView = useInView(stageWrapRef, { margin: '14% 0px' });
  const [canvasMounted, setCanvasMounted] = useState(false);
  useEffect(() => {
    if (stageInView) setCanvasMounted(true);
  }, [stageInView]);

  /* ---- Drag-to-rotate via window listeners (no pointer capture, so DOM
   *        clicks inside the scene still reach their original targets) ---- */
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
      // Y is free (unbounded accumulation => full 360° spin); X is softly
      // clamped so the globe pitches but never flips upside down.
      rotTargetRef.current.y += dx * 0.005 * power;
      rotTargetRef.current.x = Math.min(1.2, Math.max(-1.2, rotTargetRef.current.x + dy * 0.004 * power));
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
  const canvasActive = webgl && canvasMounted;

  const stageContent = (
    <>
      {webgl ? (
        canvasActive ? (
          <WebGLBoundary fallback={<StaticFallback isMobile={isMobile} />}>
            <TechScene isMobile={isMobile} />
          </WebGLBoundary>
        ) : (
          <div className="absolute inset-0 tech-stage-placeholder" aria-hidden="true" />
        )
      ) : (
        <StaticFallback isMobile={isMobile} />
      )}
      {canvasActive && <InfoCard />}
      {canvasActive && <Instructions />}
    </>
  );

  return (
    <section
      id="stack"
      onPointerDown={onPointerDown}
      onClick={onSectionClick}
      className="dark-section relative bg-[#0A0A0A] text-[#E8E6E0] border-t border-white/5"
      style={{ touchAction: 'pan-y', userSelect: 'none', WebkitUserSelect: 'none' }}
      aria-label="The stack behind my work - interactive 3D constellation of technologies"
    >
      {/* ── Section Header (matches existing portfolio headline pattern) ── */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-24 sm:pt-28 pb-10 sm:pb-14 select-none">
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
              (TECHNOLOGY CONSTELLATION)
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-sm md:text-base text-[#888888] font-sans leading-relaxed max-w-xl"
            >
              Explore the full stack, infrastructure, messaging and observability
              ecosystem that powers production-grade applications — as a living
              3D constellation. Scroll to fly through the graph.
            </motion.p>
          </div>
        </div>

        <div className="w-full h-[1px] bg-white/10 mt-12 sm:mt-16" />
      </div>

      {/* ── Pinned 3D Stage ──
           Desktop: 230vh wrapper + 100svh sticky stage => ~130vh of scrubbed
           camera travel, then the sticky releases back into normal page flow.
           Mobile: normal-height rounded box; progress scroll-rotates the graph. */}
      <div
        ref={stageWrapRef}
        className="relative w-full"
        style={isMobile ? { padding: '0 0 6rem' } : { height: '230vh' }}
      >
        {isMobile ? (
          <div className="max-w-7xl mx-auto px-6">
            <div
              className="relative rounded-2xl overflow-hidden border border-white/5"
              style={{ height: 'clamp(380px, 58vh, 560px)' }}
            >
              {stageContent}
            </div>
          </div>
        ) : (
          <div className="sticky top-0 relative w-full overflow-hidden" style={{ height: '100svh' }}>
            {stageContent}
          </div>
        )}
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