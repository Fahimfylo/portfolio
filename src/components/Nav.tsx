import React, { useState, useEffect } from 'react';
import { useContent } from '../ContentProvider';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSmoothScroll } from './SmoothScroll';

export const Nav: React.FC = () => {
  const [isScrolledToDark, setIsScrolledToDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { lenis, scrollTo } = useSmoothScroll();
  const data = useContent();

  useEffect(() => {
    if (menuOpen) {
      lenis?.stop();
    } else {
      lenis?.start();
    }
  }, [menuOpen, lenis]);

  useEffect(() => {
    const handleScroll = () => {
      const servicesSection = document.getElementById('services');
      if (servicesSection) {
        const rect = servicesSection.getBoundingClientRect();
        setIsScrolledToDark(rect.top <= 120);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMenuOpen(false);

    if (href === '#top') {
      scrollTo(0);
      return;
    }

    scrollTo(href);
  };

  return (
    <>
      {/* Sticky Top Header Bar */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolledToDark ? 'opacity-0 pointer-events-none -translate-y-4' : 'opacity-100 translate-y-0'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          {/* Left Role Label */}
          <div className="text-xs font-mono uppercase tracking-widest text-[#111111]/70 font-medium">
            {data.personal.role}
          </div>

          {/* Right Links + Menu Button */}
          <div className="flex items-center space-x-8">
            <nav className="hidden md:flex items-center space-x-8">
              {data.navLinks.slice(1).map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className="text-sm font-medium text-[#111111] hover:text-[#888888] transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Circular Hamburger Trigger */}
            <button
              onClick={() => setMenuOpen(true)}
              className="w-10 h-10 rounded-full bg-[#111111]/10 hover:bg-[#111111]/20 text-[#111111] flex items-center justify-center transition-all focus:outline-none cursor-pointer"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Floating Circular Trigger Button (When Scrolled into Dark Section) */}
      <div
        className={`fixed top-6 right-6 z-40 transition-all duration-300 ${
          isScrolledToDark ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-90 pointer-events-none'
        }`}
      >
        <button
          onClick={() => setMenuOpen(true)}
          className="w-12 h-12 flex items-center justify-center rounded-full glass-circle text-[#E8E6E0] focus:outline-none group shadow-lg hover:scale-105 transition-transform cursor-pointer"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
        </button>
      </div>

      {/* Full-Screen Side Hamburger Overlay (Exact Match to Screenshot) */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-2xl flex flex-col justify-between p-8 sm:p-12 md:p-20 overflow-hidden text-[#E8E6E0]"
          >
            {/* Top Right Dark Bubble/Circle Arc Accent */}
            <motion.div
              initial={{ scale: 0, x: 100, y: -100 }}
              animate={{ scale: 1, x: 0, y: 0 }}
              exit={{ scale: 0, x: 100, y: -100 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="absolute -top-28 -right-28 sm:-top-36 sm:-right-36 w-[380px] h-[380px] sm:w-[520px] sm:h-[520px] rounded-full bg-[#333333]/70 pointer-events-none z-10 shadow-2xl"
            />

            {/* White Circular Close Button (X) in Top Right */}
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-6 right-6 sm:top-10 sm:right-10 z-20 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white text-black flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-transform duration-200 cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-6 h-6 stroke-[2.5]" />
            </button>

            {/* Spacer / Top Gap */}
            <div className="w-full h-8" />

            {/* Giant Uppercase Display Nav Links (Full Width Across Container) */}
            <div className="my-auto w-full max-w-7xl mx-auto z-20">
              <div className="flex flex-col space-y-1 sm:space-y-2 w-full">
                {data.navLinks.map((link, idx) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.08 }}
                    className="w-full"
                  >
                    <a
                      href={link.href}
                      onClick={(e) => scrollToSection(e, link.href)}
                      className="w-full block text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-black tracking-tight text-white hover:text-white/50 transition-colors uppercase leading-[1.02] select-none cursor-pointer"
                    >
                      {link.label}
                    </a>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Bottom Metadata Block (Full Width Footer) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="w-full max-w-7xl mx-auto z-20 pt-8 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 border-t border-white/10"
            >
              {/* Email Block */}
              <div>
                <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-[#888888] block mb-1">
                  EMAIL ADDRESS
                </span>
                <a
                  href={`mailto:${data.personal.email}`}
                  className="text-xs sm:text-sm font-mono text-white hover:underline tracking-wide block"
                >
                  {data.personal.email}
                </a>
                {data.personal.cvUrl && (
                  <a
                    href={data.personal.cvUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs sm:text-sm font-mono text-white/80 hover:text-emerald-400 tracking-wide block mt-1 transition-colors"
                  >
                    VIEW CV ↗
                  </a>
                )}
              </div>

              {/* Socials Row */}
              <div className="flex items-center space-x-6 sm:space-x-8">
                {data.socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs sm:text-sm font-mono text-white hover:text-white/60 transition-colors font-medium"
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
