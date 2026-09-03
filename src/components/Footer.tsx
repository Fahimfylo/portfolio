import React, { useState, useEffect } from 'react';
import { useContent } from '../ContentProvider';
import { ArrowUp, ArrowUpRight, Github, Linkedin, Instagram, Clock } from 'lucide-react';
import { useSmoothScroll } from './SmoothScroll';

export const Footer: React.FC = () => {
  const { scrollTo } = useSmoothScroll();
  const data = useContent();
  const [timeString, setTimeString] = useState('');
  const [timeZoneLabel, setTimeZoneLabel] = useState('IST');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format as IST / Local Time with ticking seconds
      const formatted = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
      setTimeString(formatted);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    scrollTo(0);
  };

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (href === '#home' || href === '#') {
      scrollToTop();
      return;
    }
    scrollTo(href);
  };

  const getSocialIcon = (iconName: string) => {
    switch (iconName) {
      case 'Linkedin':
        return <Linkedin className="w-4 h-4" />;
      case 'Github':
        return <Github className="w-4 h-4" />;
      case 'Instagram':
        return <Instagram className="w-4 h-4" />;
      default:
        return <ArrowUpRight className="w-4 h-4" />;
    }
  };

  return (
    <footer className="relative bg-[#F0EEE8] text-[#111111] pt-20 pb-12 px-6 md:px-12 border-t border-[#111111]/10">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Two Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
          
          {/* Column 1: Menu */}
          <div className="space-y-4">
            <h4 className="text-sm font-sans font-bold text-[#111111] uppercase tracking-wider pb-3 border-b border-[#111111]/15">
              Menu
            </h4>
            <nav className="flex flex-col space-y-2">
              <a
                href="#home"
                onClick={(e) => scrollToSection(e, '#home')}
                className="text-sm font-mono text-[#444444] hover:text-[#111111] transition-colors py-1 flex items-center justify-between group max-w-xs"
              >
                <span>Home</span>
                <span className="text-xs text-[#888888] opacity-0 group-hover:opacity-100 transition-opacity">01</span>
              </a>
              {data.navLinks.map((link, idx) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className="text-sm font-mono text-[#444444] hover:text-[#111111] transition-colors py-1 flex items-center justify-between group max-w-xs"
                >
                  <span>{link.label}</span>
                  <span className="text-xs text-[#888888] opacity-0 group-hover:opacity-100 transition-opacity">
                    0{idx + 2}
                  </span>
                </a>
              ))}
            </nav>
          </div>

          {/* Column 2: Socials */}
          <div className="space-y-4">
            <h4 className="text-sm font-sans font-bold text-[#111111] uppercase tracking-wider pb-3 border-b border-[#111111]/15">
              Socials
            </h4>
            <div className="flex flex-col space-y-2">
              {data.socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-mono text-[#444444] hover:text-[#111111] transition-colors py-1 flex items-center justify-between group max-w-xs"
                >
                  <span className="flex items-center space-x-2">
                    {getSocialIcon(social.icon)}
                    <span>{social.label}</span>
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Bar: Live Time + Circular Scroll-to-Top Button */}
        <div className="pt-12 border-t border-[#111111]/15 flex flex-col sm:flex-row items-center justify-between gap-6">
          
          {/* Bottom-Left: LOCAL TIME + Live Ticking Time Readout */}
          <div className="flex items-center space-x-3 text-left w-full sm:w-auto">
            <div className="p-2 rounded-full bg-[#111111]/5 border border-[#111111]/10">
              <Clock className="w-4 h-4 text-[#111111]" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-[#888888] font-semibold">
                LOCAL TIME
              </div>
              <div className="text-base sm:text-lg font-mono font-bold text-[#111111]">
                {timeString || '9:34:58 PM'}, {timeZoneLabel}
              </div>
            </div>
          </div>

          {/* Copyright Note */}
          <div className="text-xs font-mono text-[#888888] text-center">
            © {new Date().getFullYear()} {data.personal.name}. All rights reserved.
          </div>

          {/* Bottom-Right: Circular Scroll-to-Top Glass Button (Up-Arrow Icon) */}
          <div className="w-full sm:w-auto flex justify-end">
            <button
              onClick={scrollToTop}
              className="w-12 h-12 flex items-center justify-center rounded-full glass-circle text-[#111111] hover:text-white focus:outline-none group shadow-md"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-5 h-5 transition-transform duration-200 group-hover:-translate-y-1" />
            </button>
          </div>

        </div>

      </div>
    </footer>
  );
};
