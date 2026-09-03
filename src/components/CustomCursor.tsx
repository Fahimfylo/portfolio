import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export const CustomCursor: React.FC = () => {
  const [isPointerFine, setIsPointerFine] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [cursorText, setCursorText] = useState<string | null>(null);

  // Mouse coordinate motion values
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth springs for outer trailing ring
  const springConfig = { damping: 28, stiffness: 350, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Smooth springs for magnetic offset
  const magnetX = useSpring(0, { damping: 20, stiffness: 200 });
  const magnetY = useSpring(0, { damping: 20, stiffness: 200 });

  useEffect(() => {
    // Only enable on non-touch (fine pointer) devices
    const mediaQuery = window.matchMedia('(pointer: fine)');
    setIsPointerFine(mediaQuery.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsPointerFine(e.matches);
    };

    mediaQuery.addEventListener('change', handleMediaChange);

    if (!mediaQuery.matches) return;

    const onMouseMove = (e: MouseEvent) => {
      setIsVisible(true);
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      // Check element under cursor for interactive hover / magnetic snapping
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactiveEl = target.closest<HTMLElement>(
        'a, button, input, textarea, select, [role="button"], .cursor-pointer, .glass-circle, .service-row, .project-row'
      );

      if (interactiveEl) {
        setIsHovered(true);

        // Check for custom cursor text attribute
        const customText = interactiveEl.getAttribute('data-cursor');
        if (customText) {
          setCursorText(customText);
        } else if (interactiveEl.closest('.project-row') || interactiveEl.classList.contains('glass-circle')) {
          setCursorText('VIEW');
        } else {
          setCursorText(null);
        }

        // Magnetic Snapping Effect for Buttons and Glass Circles
        const isMagneticEl =
          interactiveEl.tagName === 'BUTTON' ||
          interactiveEl.classList.contains('glass-circle') ||
          interactiveEl.classList.contains('magnetic');

        if (isMagneticEl) {
          const rect = interactiveEl.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;

          // Pull slightly towards element center
          const deltaX = (e.clientX - centerX) * 0.35;
          const deltaY = (e.clientY - centerY) * 0.35;

          magnetX.set(deltaX);
          magnetY.set(deltaY);
        } else {
          magnetX.set(0);
          magnetY.set(0);
        }
      } else {
        setIsHovered(false);
        setCursorText(null);
        magnetX.set(0);
        magnetY.set(0);
      }
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);
    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.body.addEventListener('mouseleave', onMouseLeave);
    document.body.addEventListener('mouseenter', onMouseEnter);

    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.body.removeEventListener('mouseleave', onMouseLeave);
      document.body.removeEventListener('mouseenter', onMouseEnter);
    };
  }, [mouseX, mouseY, magnetX, magnetY]);

  if (!isPointerFine || !isVisible) return null;

  return (
    <>
      {/* Global CSS override to hide default system cursor on fine pointer devices */}
      <style>{`
        @media (pointer: fine) {
          body, a, button, input, textarea, select, [role="button"], .cursor-pointer {
            cursor: none !important;
          }
        }
      `}</style>

      {/* Central Sharp Dot */}
      <motion.div
        className="fixed top-0 left-0 w-2.5 h-2.5 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isClicking ? 0.5 : isHovered ? (cursorText ? 0 : 0.4) : 1,
          opacity: isHovered && cursorText ? 0 : 1,
        }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
      />

      {/* Outer Eased / Magnetic Ring */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9998] flex items-center justify-center font-mono text-[10px] font-bold tracking-widest uppercase"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: cursorText ? 68 : isHovered ? 48 : 32,
          height: cursorText ? 68 : isHovered ? 48 : 32,
          scale: isClicking ? 0.85 : 1,
          backgroundColor: isHovered
            ? cursorText
              ? 'rgba(255, 255, 255, 0.95)'
              : 'rgba(255, 255, 255, 0.15)'
            : 'rgba(255, 255, 255, 0)',
          borderColor: isHovered
            ? cursorText
              ? 'rgba(255, 255, 255, 1)'
              : 'rgba(255, 255, 255, 0.6)'
            : 'rgba(255, 255, 255, 0.35)',
          borderWidth: isHovered && cursorText ? 0 : 1,
          color: cursorText ? '#0A0A0A' : '#FFFFFF',
          backdropFilter: isHovered ? 'blur(4px)' : 'blur(0px)',
        }}
        transition={{
          type: 'spring',
          damping: 24,
          stiffness: 260,
          mass: 0.4,
        }}
      >
        {cursorText && (
          <motion.span
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.2 }}
            className="select-none text-[#0A0A0A] font-extrabold"
          >
            {cursorText}
          </motion.span>
        )}
      </motion.div>
    </>
  );
};
