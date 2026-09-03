import React, { useState, useEffect } from 'react';
import { getContent } from '../content';
import { GlassCard } from './GlassCard';
import { Settings, X, Shield, ExternalLink } from 'lucide-react';
import { useSmoothScroll } from './SmoothScroll';

export const CustomizationBar: React.FC = () => {
  const { lenis } = useSmoothScroll();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      lenis?.stop();
    } else {
      lenis?.start();
    }
  }, [open, lenis]);

  const goToAdmin = () => {
    window.location.hash = '#/admin';
  };

  const handleGoHome = () => {
    setOpen(false);
    const base = window.location.pathname + window.location.search;
    window.location.href = base;
  };

  return (
    <>
      {/* Floating Settings trigger button at bottom-left */}
      <div className="fixed bottom-6 left-6 z-40">
        <button
          onClick={() => setOpen(!open)}
          className="glass-circle px-3.5 py-2.5 flex items-center space-x-2 text-xs font-mono uppercase text-white/90 hover:text-white backdrop-blur-md bg-black/60 border border-white/20 shadow-xl group"
          title="Open admin panel"
        >
          <Settings className="w-3.5 h-3.5 transition-transform group-hover:rotate-45" />
          <span className="hidden sm:inline">Admin</span>
        </button>
      </div>

      {/* Customization Drawer / Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <GlassCard variant="elevated" className="w-full max-w-md p-6 space-y-6 border-white/15">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <h3 className="text-base font-display font-bold text-white">
                  Admin Panel
                </h3>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-[#888888] hover:text-white p-1"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs font-mono text-[#888888] leading-relaxed">
              Manage your portfolio content: projects, links, CV, personal info, and skills through the admin dashboard.
            </p>

            <div className="space-y-3">
              <button
                onClick={goToAdmin}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white text-black font-mono text-xs uppercase font-bold hover:bg-neutral-200 transition-colors"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Open Admin Panel</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleGoHome}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-[#888888] hover:text-white transition-colors"
              >
                <span>Back to home</span>
              </button>
            </div>
          </GlassCard>
        </div>
      )}
    </>
  );
};
