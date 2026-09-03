import React from 'react';
import { technologies, Technology, mobileSubset } from './technologyData';

/**
 * Static HTML fallback rendered when WebGL is unavailable or the Canvas
 * errors. Uses only Tailwind classes that exist globally (no extra CSS).
 */
export const StaticFallback: React.FC<{ isMobile?: boolean }> = ({ isMobile }) => (
  <div className="flex items-center justify-center py-12 sm:py-20 px-4 sm:px-8" aria-label="Technology stack overview">
    <div className="max-w-5xl w-full">
      <div className="flex flex-wrap justify-center gap-4 sm:gap-5">
        {technologies
          .filter((t) => !isMobile || mobileSubset.includes(t.id))
          .sort((a, b) => a.tier - b.tier)
          .map((t: Technology) => (
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
  </div>
);