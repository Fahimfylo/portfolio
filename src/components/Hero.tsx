import React from 'react';
import { useContent } from '../ContentProvider';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useSmoothScroll } from './SmoothScroll';

export const Hero: React.FC = () => {
  const { scrollTo } = useSmoothScroll();
  const data = useContent();

  const scrollToContact = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    scrollTo('#contact');
  };

  const nameWords = data.personal.name.split(' ');

  return (
    <section id="top" className="relative min-h-screen bg-[#F0EEE8] text-[#111111] pt-24 pb-16 px-6 md:px-12 flex flex-col justify-between overflow-hidden">
      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto w-full my-auto py-8">
        
        {/* Massive Full Name Display Headline with Motion Staggered Word/Letter Reveal */}
        <div className="w-full mb-8 overflow-hidden">
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.12 } },
              hidden: {}
            }}
            className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[11rem] font-display font-black tracking-tight leading-[0.88] text-[#111111] uppercase select-none flex flex-wrap gap-x-6"
          >
            {nameWords.map((word, wIdx) => (
              <motion.span
                key={wIdx}
                variants={{
                  hidden: { y: '100%', opacity: 0 },
                  visible: { y: '0%', opacity: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
                }}
                className="inline-block"
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>
        </div>

        {/* Diagonal Arrow Glyph as visual accent/divider */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8 flex items-center space-x-3 text-[#888888]"
        >
          <ArrowDownRight className="w-8 h-8 md:w-10 md:h-10 stroke-[1.5]" />
          <div className="h-[1px] w-16 md:w-24 bg-[#111111]/15" />
        </motion.div>

        {/* Content Row: Text + CTA on Left, Offset Framed Image on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Text Block */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-8">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="text-lg md:text-xl text-[#444444] font-sans font-normal leading-relaxed max-w-2xl"
            >
              {data.personal.heroSubtext}
            </motion.p>

            {/* Dark Pill CTA Button */}
            <motion.a
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              href="#contact"
              onClick={scrollToContact}
              className="inline-flex items-center space-x-3 bg-[#1A1A1A] hover:bg-[#333333] text-white font-mono text-sm uppercase tracking-wider px-8 py-4 rounded-full transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 group"
            >
              <span>Contact</span>
              <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </motion.a>
          </div>

          {/* Right Portrait/Workspace Photo in Bordered Rectangular Frame (Offset) */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative mt-6 lg:mt-12 flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-sm aspect-[4/5] rounded-2xl p-2 bg-[#E8E6DF] border border-[#111111]/10 shadow-[0_12px_40px_rgba(17,17,17,0.08)] transform lg:translate-y-6">
              <div className="w-full h-full rounded-xl overflow-hidden relative group">
                <img
                  src={data.personal.portraitImage}
                  alt={data.personal.name}
                  className="w-full h-full object-cover grayscale contrast-105 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500 ease-out"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-3 left-3 right-3 text-white/90 text-xs font-mono uppercase tracking-widest flex justify-between items-center backdrop-blur-md bg-black/30 px-3 py-2 rounded-lg border border-white/10">
                  <span>SENIOR ENGINEER</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Bottom Footer Readout Row in Hero */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="max-w-7xl mx-auto w-full pt-12 flex flex-col sm:flex-row items-start sm:items-end justify-between border-t border-[#111111]/10 gap-4"
      >
        <div className="text-xs font-mono uppercase tracking-widest text-[#888888]">
          FULL-STACK & SYSTEM ARCHITECTURE
        </div>

        {/* Bottom-Right: AVAILABLE FOR WORK + Large Mono Date Readout */}
        <div className="text-left sm:text-right">
          <div className="text-[10px] md:text-xs font-mono uppercase tracking-widest text-[#888888] font-semibold mb-1">
            {data.personal.availabilityStatus}
          </div>
          <div className="text-3xl md:text-5xl font-mono font-bold tracking-tight text-[#111111]">
            {data.personal.dateReadout}
          </div>
        </div>
      </motion.div>
    </section>
  );
};
