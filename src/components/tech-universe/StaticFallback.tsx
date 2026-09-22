import React from 'react';
import {
  technologies,
  clusterOf,
  clusterOrder,
  clusters,
  mobileSubset,
} from './technologyData';

/**
 * Static HTML fallback rendered when WebGL is unavailable or the Canvas
 * errors. Groups the stack by constellation cluster so it still reads
 * as organized without the 3D scene.
 */
export const StaticFallback: React.FC<{ isMobile?: boolean }> = ({ isMobile }) => (
  <div className="flex items-center justify-center py-12 sm:py-20 px-4 sm:px-8" aria-label="Technology stack overview">
    <div className="max-w-5xl w-full space-y-10">
      {clusterOrder.map((cid) => {
        const def = clusters.find((c) => c.id === cid);
        const items = technologies.filter(
          (t) => clusterOf(t) === cid && (!isMobile || mobileSubset.includes(t.id)),
        );
        if (items.length === 0) return null;
        return (
          <div key={cid} className="space-y-4">
            <div className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-[#888] text-center">
              ({def?.label}{def ? ` · ${def.hint}` : ''})
            </div>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
              {items
                .sort((a, b) => a.tier - b.tier)
                .map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                  >
                    <t.icon size={22} color="#E8E6E0" />
                    <span className="text-xs sm:text-sm font-mono text-[#b8b6ae] uppercase tracking-wide">
                      {t.name}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        );
      })}
    </div>
  </div>
);