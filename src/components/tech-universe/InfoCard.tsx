import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { techById } from './technologyData';
import { useUniverse } from './UniverseContext';

/** Animated info card for the currently focused technology. */
export const InfoCard: React.FC = () => {
  const { selectedId, isMobile } = useUniverse();
  const tech = selectedId ? techById[selectedId] : null;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-30"
      style={{ overflow: 'hidden' }}
      aria-live="polite"
      onClick={(e) => e.stopPropagation()}
    >
      <AnimatePresence>
        {tech && (
          <motion.div
            key={tech.id}
            initial={{ opacity: 0, y: 18, x: isMobile ? 0 : 10 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className={`glass-dark pointer-events-auto absolute ${
              isMobile ? 'bottom-4 left-4 right-4' : 'top-6 right-6 w-64'
            } p-4 space-y-3 border-white/10`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <tech.icon size={18} color="#34d399" />
                <h3 className="text-sm font-bold text-white font-mono tracking-tight uppercase">
                  {tech.name}
                </h3>
              </div>
              <span className="text-[9px] font-mono uppercase tracking-widest text-[#888] px-2 py-0.5 rounded bg-white/5 border border-white/10">
                {tech.category}
              </span>
            </div>

            <p className="text-[11px] font-mono leading-relaxed text-[#b8b6ae]">
              {tech.description}
            </p>

            {tech.usedFor.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {tech.usedFor.map((use) => (
                  <span
                    key={use}
                    className="text-[8px] font-mono uppercase tracking-widest text-[#888] bg-white/5 border border-white/10 px-2 py-0.5 rounded"
                  >
                    {use}
                  </span>
                ))}
              </div>
            )}

            {tech.related.length > 0 && (
              <div className="pt-2 border-t border-white/10 flex flex-wrap gap-x-2 gap-y-1">
                <span className="text-[8px] font-mono uppercase text-[#666] tracking-widest mr-1">related</span>
                {tech.related.slice(0, 5).map((r) => {
                  const rt = techById[r];
                  return rt ? (
                    <span key={r} className="text-[9px] font-mono text-[#888]">
                      {rt.name}
                    </span>
                  ) : null;
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};