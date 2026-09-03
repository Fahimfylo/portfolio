import React from 'react';
import { useContent } from '../ContentProvider';
import { motion } from 'motion/react';

export const AboutSkillsSection: React.FC = () => {
  const data = useContent();
  return (
    <section id="about" className="dark-section relative bg-[#0A0A0A] text-[#E8E6E0] py-24 px-6 md:px-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto space-y-20">
        
        {/* Top Row Grid: Stacked Headline on Left + Skills on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Top-Left: 3-Line Stacked Display Headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 space-y-6"
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-black tracking-tight text-[#E8E6E0] leading-none uppercase">
              {data.personal.aboutHeadline.split(' / ').map((line, idx) => (
                <span key={idx} className="block">
                  {line} {idx < 3 ? '/' : ''}
                </span>
              ))}
            </h2>

            {/* Framed Photo in same style as hero */}
            <div className="pt-4">
              <div className="relative w-full max-w-xs aspect-[4/5] rounded-2xl p-2 bg-[#141414] border border-white/10 shadow-2xl">
                <div className="w-full h-full rounded-xl overflow-hidden relative group">
                  <img
                    src={data.personal.portraitImage}
                    alt={data.personal.name}
                    className="w-full h-full object-cover grayscale contrast-110 group-hover:grayscale-0 transition-all duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 text-white text-[10px] font-mono uppercase tracking-widest bg-black/50 px-2.5 py-1 rounded border border-white/10">
                    ENGINEERING & DESIGN
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Top-Right: Skills Heading + 3 Columns of Plain Mono Text Lists */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-7 space-y-8"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-3xl md:text-4xl font-display font-bold text-white">
                Skills
              </h3>
              <span className="text-xs font-mono uppercase tracking-widest text-[#888888]">
                (TECHNICAL MATRIX)
              </span>
            </div>

            {/* Three Columns of Plain Mono Text Lists (No badges/chips per Section 4 requirement!) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              
              {/* Languages & Tools */}
              <div className="space-y-4">
                <h4 className="text-sm font-sans font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2">
                  Languages & Tools
                </h4>
                <ul className="space-y-2">
                  {data.skills.languagesAndTools.map((item) => (
                    <li
                      key={item}
                      className="text-xs font-mono text-[#888888] hover:text-white transition-colors"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Frameworks & Libraries */}
              <div className="space-y-4">
                <h4 className="text-sm font-sans font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2">
                  Frameworks & Libraries
                </h4>
                <ul className="space-y-2">
                  {data.skills.frameworksAndLibraries.map((item) => (
                    <li
                      key={item}
                      className="text-xs font-mono text-[#888888] hover:text-white transition-colors"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Core CS Concepts */}
              <div className="space-y-4">
                <h4 className="text-sm font-sans font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2">
                  Core CS Concepts
                </h4>
                <ul className="space-y-2">
                  {data.skills.coreCS.map((item) => (
                    <li
                      key={item}
                      className="text-xs font-mono text-[#888888] hover:text-white transition-colors"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </motion.div>

        </div>

        {/* Bottom Section: Confident Single-Sentence Headline + (ABOUT ME) Bio */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="pt-12 border-t border-white/10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
        >
          
          {/* Left Label */}
          <div className="lg:col-span-3">
            <span className="text-xs font-mono uppercase tracking-widest text-[#888888]">
              (ABOUT ME)
            </span>
          </div>

          {/* Right Bio Content */}
          <div className="lg:col-span-9 space-y-6">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white leading-tight">
              I specialize in constructing low-latency web platforms that process millions of events without degrading user responsiveness.
            </h3>

            <div className="space-y-4 text-base md:text-lg text-[#888888] font-sans leading-relaxed max-w-3xl">
              {data.personal.aboutBio.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </div>

        </motion.div>

      </div>
    </section>
  );
};
