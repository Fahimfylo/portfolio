import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { useUniverse } from './UniverseContext';

/**
 * Faint HUD instruction that fades once the user interacts with the scene
 * or disappears automatically after a few seconds.
 */
export const Instructions: React.FC = () => {
  const { isMobile } = useUniverse();
  const [visible, setVisible] = useState(true);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timer.current = setTimeout(() => setVisible(false), 7500);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, []);

  // Listen for first pointer move/click anywhere to fade
  useEffect(() => {
    const dismiss = () => setVisible(false);
    window.addEventListener('pointermove', dismiss, { once: true, passive: true });
    window.addEventListener('click', dismiss, { once: true, passive: true });
    return () => {
      window.removeEventListener('pointermove', dismiss);
      window.removeEventListener('click', dismiss);
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-40 flex justify-center pb-4" aria-hidden="true">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.6 }}
        className="universe-hint text-[9px] sm:text-[10px] uppercase tracking-widest text-[#888] px-4 py-2 rounded-lg bg-[#0a0a0a]/70 border border-white/10 backdrop-blur-sm"
      >
        {isMobile
          ? 'Swipe to explore · Tap a technology to focus'
          : '✦ Move · ● Click a technology · ↔ Drag to rotate'}
      </motion.div>
    </div>
  );
};