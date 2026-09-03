import React, { useState, useEffect } from 'react';
import { Save, User } from 'lucide-react';
import { getPortfolioData, savePortfolioData } from '../lib/storage';
import { ImageUpload } from './ImageUpload';

export const PersonalInfoManager: React.FC = () => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [heroSubtext, setHeroSubtext] = useState('');
  const [availabilityStatus, setAvailabilityStatus] = useState('');
  const [dateReadout, setDateReadout] = useState('');
  const [portraitImage, setPortraitImage] = useState('');
  const [email, setEmail] = useState('');
  const [cvUrl, setCvUrl] = useState('');
  const [aboutHeadline, setAboutHeadline] = useState('');
  const [aboutBio, setAboutBio] = useState('');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    getPortfolioData().then((data) => {
      if (!alive) return;
      const p = data.personal;
      setName(p.name);
      setRole(p.role);
      setHeroSubtext(p.heroSubtext);
      setAvailabilityStatus(p.availabilityStatus);
      setDateReadout(p.dateReadout);
      setPortraitImage(p.portraitImage);
      setEmail(p.email);
      setCvUrl(p.cvUrl || '');
      setAboutHeadline(p.aboutHeadline);
      setAboutBio(p.aboutBio.join('\n'));
      setLoading(false);
    });
    return () => { alive = false; };
  }, []);

  const save = async () => {
    const data = await getPortfolioData();
    data.personal = {
      name,
      role,
      heroSubtext,
      availabilityStatus,
      dateReadout,
      portraitImage,
      email,
      cvUrl,
      aboutHeadline,
      aboutBio: aboutBio.split('\n').filter((l) => l.trim()),
    };
    await savePortfolioData(data);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Personal Info</h1>
          <p className="text-xs font-mono text-[#888] mt-1">Update your profile details</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && <span className="text-xs font-mono text-emerald-400">Saved!</span>}
          <button
            onClick={save}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400 hover:bg-emerald-500/20 transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            Save
          </button>
        </div>
      </div>

      <div className="glass-dark p-6 space-y-5">
        {loading && (
          <div className="py-16 flex justify-center">
            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          </div>
        )}
        {/* Portrait Preview */}
        {portraitImage && (
          <div className="flex items-center gap-4 mb-4 p-4 bg-black/30 rounded-xl border border-white/5">
            <img src={portraitImage} alt="Portrait" className="w-16 h-16 rounded-full object-cover border-2 border-white/10" />
            <div>
              <p className="text-sm font-display font-bold text-white">{name || 'No Name'}</p>
              <p className="text-xs font-mono text-[#666]">{role || 'No Role'}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Full Name" value={name} onChange={setName} />
          <Field label="Role Title" value={role} onChange={setRole} />
          <Field label="Email" value={email} onChange={setEmail} type="email" />
          <Field label="CV / Resume URL" value={cvUrl} onChange={setCvUrl} placeholder="https://example.com/cv.pdf" />
          <Field label="Availability Status" value={availabilityStatus} onChange={setAvailabilityStatus} />
          <Field label="Date Readout" value={dateReadout} onChange={setDateReadout} />
        </div>

        <ImageUpload label="Portrait Image" value={portraitImage} onChange={setPortraitImage} />

        <Field label="Portrait Image URL (alternative)" value={portraitImage} onChange={setPortraitImage} />

        <TextArea label="Hero Subtext" value={heroSubtext} onChange={setHeroSubtext} rows={3} />

        <TextArea label="About Headline" value={aboutHeadline} onChange={setAboutHeadline} rows={2} />

        <TextArea label="About Bio (one paragraph per line)" value={aboutBio} onChange={setAboutBio} rows={6} />

        <p className="text-[10px] font-mono text-[#555]">
          Bio is split by newlines. Each line becomes a separate paragraph on the site.
        </p>
      </div>
    </div>
  );
};

const Field: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}> = ({ label, value, onChange, type = 'text', placeholder }) => (
  <div className="space-y-1.5">
    <label className="text-[11px] font-mono uppercase text-[#888] block">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white placeholder:text-[#444] focus:outline-none focus:border-white/25 transition-colors"
    />
  </div>
);

const TextArea: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}> = ({ label, value, onChange, rows = 4 }) => (
  <div className="space-y-1.5">
    <label className="text-[11px] font-mono uppercase text-[#888] block">{label}</label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-white/25 transition-colors resize-y"
    />
  </div>
);
