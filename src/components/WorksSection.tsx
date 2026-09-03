import React, { useState, useEffect, useRef } from 'react';
import { useContent } from '../ContentProvider';
import { ProjectItem } from '../content';
import { GlassCard } from './GlassCard';
import { ExternalLink, Github, ArrowUpRight, Cpu, Sparkles } from 'lucide-react';
import { ProjectDetailModal } from './ProjectDetailModal';
import { motion, AnimatePresence } from 'motion/react';
import { useSmoothScroll } from './SmoothScroll';

export const WorksSection: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { lenis } = useSmoothScroll();
  const data = useContent();
  const shownProjects = data.projects.filter((p) => p.showOnHome !== false);

  // Scroll observer to activate project items as user scrolls down
  useEffect(() => {
    if (!containerRef.current) return;
    const rows = Array.from(containerRef.current.querySelectorAll('.project-row'));
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
  }, [lenis, shownProjects]);

  return (
    <section
      id="works"
      ref={containerRef}
      className="dark-section relative bg-[#0A0A0A] text-[#E8E6E0] py-28 px-6 md:px-12 border-t border-white/5"
    >
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-20">
          <div className="lg:col-span-7">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-black tracking-tight text-[#E8E6E0] uppercase"
            >
              SELECTED WORKS /
            </motion.h2>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-end space-y-3 pt-2 lg:pt-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xs font-mono uppercase tracking-widest text-[#888888]"
            >
              (PROJECTS)
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-sm md:text-base text-[#888888] font-sans leading-relaxed"
            >
              Thoughtfully crafted digital experiences that blend utility and aesthetics into something functional, memorable, and refined.
            </motion.p>
          </div>
        </div>

        {/* Vertical Stack of Project Blocks with Scroll-Driven Active Animations */}
        <div className="space-y-24 md:space-y-32">
          {shownProjects.map((project: ProjectItem, idx: number) => {
            const isActive = activeIndex === idx;

            return (
              <div
                key={project.id}
                onClick={() => setActiveIndex(idx)}
                className="project-row group grid grid-cols-1 lg:grid-cols-12 gap-8 items-start cursor-pointer select-none"
              >
                {/* Left Column: Index Numeral (Highlights brightly on active scroll) */}
                <div className="lg:col-span-2 lg:sticky lg:top-32 flex items-center justify-start lg:justify-center pt-2">
                  <motion.span
                    animate={{
                      scale: isActive ? 1.05 : 0.95,
                      opacity: isActive ? 1 : 0.35,
                    }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className={`text-7xl md:text-8xl lg:text-9xl font-display font-black tracking-tighter transition-colors duration-500 ${
                      isActive
                        ? 'text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.2)]'
                        : 'text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,0.25)] group-hover:[-webkit-text-stroke:1.5px_rgba(255,255,255,0.6)]'
                    }`}
                  >
                    {project.number}
                  </motion.span>
                </div>

                {/* Right Column: Dynamic Project Card & Details */}
                <div className="lg:col-span-10 space-y-8">
                  
                  {/* Image Frame with Motion Scale / Border Glow */}
                  <motion.div
                    animate={{
                      borderColor: isActive ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                      scale: isActive ? 1 : 0.98,
                    }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="relative rounded-2xl overflow-hidden bg-[#141414] border group/preview shadow-2xl transition-shadow duration-500"
                  >
                    {/* Main Preview Image */}
                    <div className="aspect-[16/9] w-full overflow-hidden relative">
                      <img
                        src={project.previewImage}
                        alt={project.title}
                        className={`w-full h-full object-cover transition-all duration-700 ease-out ${
                          isActive
                            ? 'grayscale-0 scale-100'
                            : 'grayscale contrast-110 scale-102 group-hover/preview:grayscale-0 group-hover/preview:scale-105'
                        }`}
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    </div>

                    {/* Overlapping Device Frame Mockup Card (Bottom Right) */}
                    <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 w-48 sm:w-64 md:w-80 rounded-xl overflow-hidden border border-white/20 bg-black/80 backdrop-blur-md shadow-2xl transition-transform duration-500 group-hover/preview:translate-y-[-4px]">
                      <div className="px-3 py-1.5 bg-white/10 flex items-center justify-between border-b border-white/10">
                        <div className="flex space-x-1.5">
                          <div className="w-2 h-2 rounded-full bg-red-500/80" />
                          <div className="w-2 h-2 rounded-full bg-yellow-500/80" />
                          <div className="w-2 h-2 rounded-full bg-green-500/80" />
                        </div>
                        <span className="text-[9px] font-mono text-white/60 uppercase tracking-widest">
                          {project.category}
                        </span>
                      </div>
                      <div className="aspect-[16/10] overflow-hidden">
                        <img
                          src={project.deviceMockupImage}
                          alt={`${project.title} mockup`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    </div>

                    {/* Centered Glass Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProject(project);
                        }}
                        className="glass-circle px-6 py-4 flex items-center space-x-2 text-white font-mono text-xs uppercase tracking-wider group/btn cursor-pointer shadow-lg hover:scale-105 transition-transform"
                      >
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                        <span>View Deep Dive</span>
                        <ArrowUpRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                      </button>
                    </div>

                    {/* Top-Left Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="text-xs font-mono uppercase tracking-widest px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/15 text-white/90">
                        {project.category}
                      </span>
                    </div>
                  </motion.div>

                  {/* Project Metadata & Technical Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                    
                    {/* Left Metadata Block */}
                    <div className="md:col-span-7 space-y-4">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-2xl md:text-3xl font-display font-bold text-white">
                          {project.title}
                        </h3>
                      </div>
                      <p className="text-sm md:text-base text-[#888888] font-sans leading-relaxed">
                        {project.tagline}
                      </p>

                      {/* Tech Stack Tags */}
                      <div className="flex flex-wrap gap-2 pt-2">
                        {project.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="text-[11px] font-mono text-white/80 bg-white/5 border border-white/10 px-2.5 py-1 rounded-md"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Right Technical Impact & Metric Summary Block */}
                    <div className="md:col-span-5 space-y-4">
                      <GlassCard variant="dark" className="p-5 space-y-3 border-white/10">
                        <div className="text-[10px] font-mono uppercase text-emerald-400 tracking-wider flex items-center space-x-1 font-semibold">
                          <Cpu className="w-3.5 h-3.5" />
                          <span>HARD TECHNICAL PROBLEM & OUTCOME</span>
                        </div>
                        <p className="text-xs text-[#E8E6E0] font-sans leading-relaxed line-clamp-3">
                          {project.technicalNarrative.outcome}
                        </p>
                        
                        {/* Metric Callout Chips */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {project.metrics.map((metric) => (
                            <span
                              key={metric}
                              className="text-[10px] font-mono text-emerald-300 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded"
                            >
                              {metric}
                            </span>
                          ))}
                        </div>

                        {/* External Action Links */}
                        <div className="pt-3 border-t border-white/10 flex items-center space-x-4 text-xs font-mono uppercase">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedProject(project);
                            }}
                            className="text-white hover:underline flex items-center gap-1 font-medium cursor-pointer"
                          >
                            <span>Full Narrative</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-[#888888] hover:text-white transition-colors flex items-center gap-1"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Demo</span>
                          </a>
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-[#888888] hover:text-white transition-colors flex items-center gap-1"
                          >
                            <Github className="w-3.5 h-3.5" />
                            <span>Code</span>
                          </a>
                        </div>
                      </GlassCard>
                    </div>

                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Project Deep Dive Modal */}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  );
};
