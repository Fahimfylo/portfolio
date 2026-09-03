import React, { useState, useEffect, useRef } from 'react';
import { useContent } from '../ContentProvider';
import { ServiceItem } from '../content';
import { motion, AnimatePresence } from 'motion/react';
import { useSmoothScroll } from './SmoothScroll';

export const ServicesSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { lenis } = useSmoothScroll();
  const data = useContent();

  useEffect(() => {
    if (!containerRef.current) return;
    const rows = Array.from(containerRef.current.querySelectorAll('.service-row'));
    if (rows.length === 0) return;

    let rowTops: number[] = [];

    const updateOffsets = () => {
      rowTops = rows.map((row) => {
        const rect = (row as HTMLElement).getBoundingClientRect();
        return rect.top + window.scrollY;
      });
    };

    updateOffsets();
    window.addEventListener('resize', updateOffsets, { passive: true });

    let ticking = false;
    const checkActiveRow = () => {
      const scrollMid = window.scrollY + window.innerHeight * 0.45;
      let current = 0;
      for (let i = 0; i < rowTops.length; i++) {
        if (rowTops[i] <= scrollMid) {
          current = i;
        }
      }
      setActiveIndex(current);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(checkActiveRow);
        ticking = true;
      }
    };

    if (lenis) {
      lenis.on('scroll', onScroll);
    } else {
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    checkActiveRow();

    return () => {
      window.removeEventListener('resize', updateOffsets);
      if (lenis) {
        lenis.off('scroll', onScroll);
      } else {
        window.removeEventListener('scroll', onScroll);
      }
    };
  }, [lenis]);

  return (
    <section
      id="services"
      ref={containerRef}
      className="dark-section relative bg-[#0A0A0A] text-[#E8E6E0] pt-20 pb-28 px-6 md:px-12 rounded-t-[40px] md:rounded-t-[80px] -mt-12 md:-mt-20 z-10 shadow-[0_-20px_50px_rgba(0,0,0,0.8)] border-t border-white/10"
    >
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Top-Left Huge Display Headline */}
          <div className="lg:col-span-6">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-black tracking-tight text-[#E8E6E0] uppercase"
            >
              WHAT I DO /
            </motion.h2>
          </div>

          {/* Right Side: Services Label + Description */}
          <div className="lg:col-span-6 flex flex-col justify-end space-y-3 pt-2 lg:pt-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xs font-mono uppercase tracking-widest text-[#888888]"
            >
              (SERVICES)
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-sm md:text-base text-[#888888] font-sans leading-relaxed max-w-xl"
            >
              I specialize in building fast, reliable, and user-friendly full-stack web applications. I help small businesses and startups turn ideas into high-quality websites and products that actually work and scale.
            </motion.p>
          </div>

        </div>

        {/* Top Hairline Divider */}
        <div className="w-full h-[1px] bg-white/10" />

        {/* Accordion / Scroll-driven Stack Matching Video Frame 00:08 - 00:11 */}
        <div className="space-y-0">
          {data.services.map((service: ServiceItem, idx: number) => {
            const isExpanded = activeIndex === idx;

            return (
              <div
                key={service.id}
                onClick={() => setActiveIndex(idx)}
                className="service-row group border-b border-white/10 py-6 md:py-8 transition-all duration-300 cursor-pointer select-none"
              >
                {/* Single Row Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Left Column: Index Number e.g. (01) */}
                  <div className="lg:col-span-3 flex items-start pt-1">
                    <span
                      className={`text-3xl sm:text-4xl md:text-5xl font-display font-bold tracking-tight transition-colors duration-300 ${
                        isExpanded ? 'text-white' : 'text-[#666666] group-hover:text-white'
                      }`}
                    >
                      {service.number}
                    </span>
                  </div>

                  {/* Right Column: Title + Description + Subgroups List */}
                  <div className="lg:col-span-9 space-y-6">
                    
                    {/* Display Title */}
                    <div className="flex items-center justify-between">
                      <h3
                        className={`text-3xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight transition-colors duration-300 ${
                          isExpanded ? 'text-white' : 'text-[#888888] group-hover:text-white'
                        }`}
                      >
                        {service.title}
                      </h3>
                    </div>

                    {/* Expanded Content Matching Video Frame 00:09 - 00:11 */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden pt-2 space-y-8"
                        >
                          {/* Paragraph Description */}
                          <p className="text-sm sm:text-base text-[#888888] font-sans leading-relaxed max-w-2xl">
                            {service.description}
                          </p>

                          {/* Subgroups List with Hairline Dividers (Exact match to video frames 00:09, 00:10, 00:11) */}
                          <div className="pt-2 border-t border-white/10 space-y-0">
                            {service.subGroups.map((sub, sIdx) => (
                              <motion.div
                                key={sub.num}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: sIdx * 0.08 }}
                                className="flex items-center space-x-6 py-4 border-b border-white/10 last:border-b-0"
                              >
                                <span className="text-xs font-mono text-[#888888] w-6">
                                  {sub.num}
                                </span>
                                <span className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-white tracking-tight">
                                  {sub.label}
                                </span>
                              </motion.div>
                            ))}
                          </div>

                        </motion.div>
                      )}
                    </AnimatePresence>

                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
