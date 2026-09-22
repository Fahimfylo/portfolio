import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const loadingPhrases = [
    'INITIALIZING SYSTEM',
    'LOADING CORE MODULES',
    'RENDERING COMPONENT CANVAS',
    'FAHIM RAHMAN / PORTFOLIO 2026'
  ];

  useEffect(() => {
    // Progress counter timer
    const duration = 2000; // 2 seconds
    const intervalTime = 30;
    const steps = duration / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const nextProgress = Math.min(Math.round((currentStep / steps) * 100), 100);
      setProgress(nextProgress);

      if (currentStep % Math.floor(steps / loadingPhrases.length) === 0) {
        setCurrentTextIndex((prev) => (prev + 1) % loadingPhrases.length);
      }

      if (currentStep >= steps) {
        clearInterval(timer);
        setTimeout(() => {
          setIsFinished(true);
          setTimeout(onComplete, 800);
        }, 300);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          key="preloader"
          initial={{ y: 0 }}
          exit={{ y: '-100%', transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
          className="fixed inset-0 z-50 flex flex-col justify-between bg-[#0A0A0A] text-[#E8E6E0] p-8 md:p-16 select-none font-mono"
        >
          {/* Top Brand Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-6">
            <div className="flex items-center space-x-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs uppercase tracking-widest text-white/80 font-bold">
                FAHIM RAHMAN
              </span>
            </div>
            <div className="text-xs uppercase tracking-widest text-[#888888]">
              SENIOR FULL-STACK ARCHITECT
            </div>
          </div>

          {/* Center Dynamic Text Reveal & Percentage */}
          <div className="my-auto space-y-8 max-w-4xl">
            <div className="text-xs text-[#888888] uppercase tracking-widest flex items-center space-x-2">
              <span className="inline-block w-4 h-[1px] bg-emerald-400" />
              <span>{loadingPhrases[currentTextIndex]}</span>
            </div>

            {/* Giant Display Progress Number with Letter-by-letter / digit motion */}
            <div className="relative overflow-hidden">
              <div className="text-7xl sm:text-9xl md:text-[12rem] font-display font-black tracking-tighter text-white leading-none">
                {progress}
                <span className="text-3xl sm:text-5xl font-mono text-emerald-400 font-light ml-2">
                  %
                </span>
              </div>
            </div>

            {/* Sleek Progress Bar */}
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-500 via-white to-emerald-400"
                style={{ width: `${progress}%` }}
                transition={{ ease: 'easeOut' }}
              />
            </div>
          </div>

          {/* Bottom Footer Info */}
          <div className="flex items-center justify-between text-[11px] uppercase tracking-widest text-[#888888] pt-6 border-t border-white/10">
            <div>[ MOMENTUM DESIGN SYSTEM ]</div>
            <div>STATUS: READY</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
