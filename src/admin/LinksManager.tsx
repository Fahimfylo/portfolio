import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, X, ExternalLink, Navigation, Globe } from 'lucide-react';
import { getPortfolioData, savePortfolioData } from '../lib/storage';

interface NavLink {
  label: string;
  href: string;
}

interface SocialLink {
  label: string;
  href: string;
  icon: string;
}

export const LinksManager: React.FC = () => {
  const [navLinks, setNavLinks] = useState<NavLink[]>([]);
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    getPortfolioData().then((data) => {
      if (alive) {
        setNavLinks(data.navLinks);
        setSocials(data.socials);
        setLoading(false);
      }
    });
    return () => { alive = false; };
  }, []);

  const save = async () => {
    const data = await getPortfolioData();
    data.navLinks = navLinks;
    data.socials = socials;
    await savePortfolioData(data);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addNavLink = () => {
    setNavLinks([...navLinks, { label: '', href: '' }]);
  };

  const updateNavLink = (index: number, field: keyof NavLink, value: string) => {
    const updated = [...navLinks];
    updated[index] = { ...updated[index], [field]: value };
    setNavLinks(updated);
  };

  const removeNavLink = (index: number) => {
    setNavLinks(navLinks.filter((_, i) => i !== index));
  };

  const addSocial = () => {
    setSocials([...socials, { label: '', href: '', icon: 'Globe' }]);
  };

  const updateSocial = (index: number, field: keyof SocialLink, value: string) => {
    const updated = [...socials];
    updated[index] = { ...updated[index], [field]: value };
    setSocials(updated);
  };

  const removeSocial = (index: number) => {
    setSocials(socials.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Links & Socials</h1>
          <p className="text-xs font-mono text-[#888] mt-1">Manage navigation and social media links</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && <span className="text-xs font-mono text-emerald-400">Saved!</span>}
          <button
            onClick={save}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400 hover:bg-emerald-500/20 transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            Save All
          </button>
        </div>
      </div>

      {/* Navigation Links */}
      {loading ? (
        <div className="py-16 flex justify-center">
          <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      ) : (
      <>
      <div className="glass-dark p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-white/60" />
            <h3 className="text-sm font-display font-bold text-white">Navigation Links</h3>
          </div>
          <button onClick={addNavLink} className="text-[10px] font-mono text-[#666] hover:text-white flex items-center gap-1 transition-colors">
            <Plus className="w-3 h-3" /> Add
          </button>
        </div>
        <div className="space-y-2">
          {navLinks.map((link, i) => (
            <div key={i} className="flex items-center gap-3">
              <input
                type="text"
                value={link.label}
                onChange={(e) => updateNavLink(i, 'label', e.target.value)}
                placeholder="Label"
                className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white placeholder:text-[#444] focus:outline-none focus:border-white/25 transition-colors"
              />
              <input
                type="text"
                value={link.href}
                onChange={(e) => updateNavLink(i, 'href', e.target.value)}
                placeholder="href (e.g. #works)"
                className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white placeholder:text-[#444] focus:outline-none focus:border-white/25 transition-colors"
              />
              <button onClick={() => removeNavLink(i)} className="p-2 text-[#555] hover:text-red-400 transition-colors shrink-0">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          {navLinks.length === 0 && (
            <p className="text-xs font-mono text-[#555] text-center py-4">No navigation links</p>
          )}
        </div>
      </div>

      {/* Social Links */}
      <div className="glass-dark p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-white/60" />
            <h3 className="text-sm font-display font-bold text-white">Social Links</h3>
          </div>
          <button onClick={addSocial} className="text-[10px] font-mono text-[#666] hover:text-white flex items-center gap-1 transition-colors">
            <Plus className="w-3 h-3" /> Add
          </button>
        </div>
        <div className="space-y-2">
          {socials.map((social, i) => (
            <div key={i} className="flex items-center gap-3">
              <input
                type="text"
                value={social.label}
                onChange={(e) => updateSocial(i, 'label', e.target.value)}
                placeholder="Label (e.g. GitHub)"
                className="w-32 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white placeholder:text-[#444] focus:outline-none focus:border-white/25 transition-colors"
              />
              <input
                type="text"
                value={social.href}
                onChange={(e) => updateSocial(i, 'href', e.target.value)}
                placeholder="https://..."
                className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white placeholder:text-[#444] focus:outline-none focus:border-white/25 transition-colors"
              />
              <input
                type="text"
                value={social.icon}
                onChange={(e) => updateSocial(i, 'icon', e.target.value)}
                placeholder="Icon name"
                className="w-28 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white placeholder:text-[#444] focus:outline-none focus:border-white/25 transition-colors"
              />
              <a href={social.href} target="_blank" rel="noopener noreferrer" className="p-2 text-[#555] hover:text-white transition-colors shrink-0">
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button onClick={() => removeSocial(i)} className="p-2 text-[#555] hover:text-red-400 transition-colors shrink-0">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          {socials.length === 0 && (
            <p className="text-xs font-mono text-[#555] text-center py-4">No social links</p>
          )}
        </div>
        <p className="text-[10px] font-mono text-[#555] mt-3">
          Icon names: Linkedin, Github, Code, Twitter, Globe, Mail, etc. (uses lucide-react icons)
        </p>
      </div>
      </>
      )}
    </div>
  );
};
