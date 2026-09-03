import React, { useEffect } from 'react';
import { ProjectItem } from '../content';
import { GlassCard } from './GlassCard';
import { X, ExternalLink, Github, Cpu, ShieldCheck, Zap, ArrowUpRight } from 'lucide-react';
import { useSmoothScroll } from './SmoothScroll';

interface ProjectDetailModalProps {
  project: ProjectItem;
  onClose: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ project, onClose }) => {
  const { lenis } = useSmoothScroll();

  useEffect(() => {
    lenis?.stop();
    return () => lenis?.start();
  }, [lenis]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      <GlassCard
        variant="elevated"
        data-lenis-prevent
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 md:p-10 space-y-8 relative border-white/15"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors focus:outline-none"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-md">
              {project.category}
            </span>
            <span className="text-xs font-mono text-[#888888]">
              CASE STUDY #{project.number}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white">
            {project.title}
          </h2>
          <p className="text-base text-[#888888] font-sans">
            {project.tagline}
          </p>
        </div>

        {/* Technical Narrative Grid */}
        <div className="space-y-6">
          <div className="text-xs font-mono uppercase tracking-widest text-[#888888] border-b border-white/10 pb-2">
            TECHNICAL DEEP DIVE & ARCHITECTURAL TRADEOFFS
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Problem Card */}
            <GlassCard variant="dark" className="p-5 space-y-3 border-white/10">
              <div className="flex items-center space-x-2 text-red-400 text-xs font-mono uppercase font-semibold">
                <Cpu className="w-4 h-4" />
                <span>The Hard Problem</span>
              </div>
              <p className="text-xs text-[#E8E6E0] font-sans leading-relaxed">
                {project.technicalNarrative.problem}
              </p>
            </GlassCard>

            {/* Tradeoff Card */}
            <GlassCard variant="dark" className="p-5 space-y-3 border-white/10">
              <div className="flex items-center space-x-2 text-amber-400 text-xs font-mono uppercase font-semibold">
                <Zap className="w-4 h-4" />
                <span>Architectural Tradeoff</span>
              </div>
              <p className="text-xs text-[#E8E6E0] font-sans leading-relaxed">
                {project.technicalNarrative.tradeoff}
              </p>
            </GlassCard>

            {/* Outcome Card */}
            <GlassCard variant="dark" className="p-5 space-y-3 border-white/10">
              <div className="flex items-center space-x-2 text-emerald-400 text-xs font-mono uppercase font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>Impact & Metrics</span>
              </div>
              <p className="text-xs text-[#E8E6E0] font-sans leading-relaxed">
                {project.technicalNarrative.outcome}
              </p>
            </GlassCard>

          </div>
        </div>

        {/* Tech Stack List */}
        <div className="space-y-3">
          <div className="text-xs font-mono uppercase tracking-widest text-[#888888]">
            TECHNOLOGY STACK
          </div>
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="text-xs font-mono text-white bg-white/10 border border-white/15 px-3 py-1.5 rounded-lg"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-white text-black font-mono text-xs uppercase px-5 py-3 rounded-full hover:bg-neutral-200 transition-colors font-medium"
            >
              <span>Live Demonstration</span>
              <ExternalLink className="w-4 h-4" />
            </a>
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-white/10 text-white font-mono text-xs uppercase px-5 py-3 rounded-full border border-white/20 hover:bg-white/20 transition-colors"
            >
              <span>Source Code</span>
              <Github className="w-4 h-4" />
            </a>
          </div>

          <button
            onClick={onClose}
            className="text-xs font-mono uppercase text-[#888888] hover:text-white transition-colors"
          >
            Close Overview
          </button>
        </div>
      </GlassCard>
    </div>
  );
};
