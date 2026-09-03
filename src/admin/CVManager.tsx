import React, { useState, useEffect } from 'react';
import { Save, FileText, Upload, ExternalLink, Trash2 } from 'lucide-react';
import { getPortfolioData, savePortfolioData } from '../lib/storage';

export const CVManager: React.FC = () => {
  const [cvUrl, setCvUrl] = useState('');
  const [cvFileName, setCvFileName] = useState('');
  const [saved, setSaved] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    getPortfolioData().then((data) => {
      if (alive) {
        setCvUrl(data.personal.cvUrl || '');
        const storedName = localStorage.getItem('portfolio_cv_filename');
        if (storedName) setCvFileName(storedName);
        setLoading(false);
      }
    });
    return () => { alive = false; };
  }, []);

  const save = async () => {
    const data = await getPortfolioData();
    data.personal.cvUrl = cvUrl;
    await savePortfolioData(data);
    if (cvFileName) {
      localStorage.setItem('portfolio_cv_filename', cvFileName);
    } else {
      localStorage.removeItem('portfolio_cv_filename');
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.type === 'application/pdf' || file.name.endsWith('.pdf'))) {
      const reader = new FileReader();
      reader.onload = () => {
        setCvUrl(reader.result as string);
        setCvFileName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCvUrl(reader.result as string);
        setCvFileName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearCV = () => {
    setCvUrl('');
    setCvFileName('');
    localStorage.removeItem('portfolio_cv_filename');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">CV / Resume</h1>
          <p className="text-xs font-mono text-[#888] mt-1">Upload a PDF or link to your resume</p>
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

      {/* Upload Area */}
      {loading ? (
        <div className="py-16 flex justify-center">
          <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      ) : (
      <>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleFileDrop}
        className={`glass-dark p-8 border-2 border-dashed transition-colors text-center ${
          dragOver ? 'border-emerald-400/50 bg-emerald-500/5' : 'border-white/10'
        }`}
      >
        <Upload className="w-8 h-8 text-[#555] mx-auto mb-3" />
        <p className="text-sm font-mono text-white mb-1">
          Drop a PDF here, or{' '}
          <label className="text-emerald-400 hover:text-emerald-300 cursor-pointer transition-colors">
            browse
            <input type="file" accept=".pdf" onChange={handleFileSelect} className="hidden" />
          </label>
        </p>
        <p className="text-[10px] font-mono text-[#555]">PDF files only. Stored locally in your browser.</p>
      </div>

      {/* Current CV Status */}
      <div className="glass-dark p-5 mt-4">
        <div className="flex items-center gap-2 mb-3">
          <FileText className="w-4 h-4 text-white/60" />
          <h3 className="text-sm font-display font-bold text-white">Current CV</h3>
        </div>

        {cvUrl ? (
          <div className="flex items-center gap-3 p-3 bg-black/30 rounded-xl border border-white/5">
            <FileText className="w-5 h-5 text-emerald-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-mono text-white truncate">
                {cvFileName || 'CV uploaded'}
              </p>
              <p className="text-[10px] font-mono text-[#555]">
                {cvUrl.startsWith('data:') ? 'Embedded as base64 (stored in localStorage)' : cvUrl}
              </p>
            </div>
            <a
              href={cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-[#666] hover:text-white transition-colors shrink-0"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={clearCV}
              className="p-2 text-[#666] hover:text-red-400 transition-colors shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <p className="text-xs font-mono text-[#555] py-3">No CV uploaded yet</p>
        )}
      </div>

      {/* Or: Link to external CV */}
      <div className="glass-dark p-5 mt-4">
        <div className="flex items-center gap-2 mb-3">
          <ExternalLink className="w-4 h-4 text-white/60" />
          <h3 className="text-sm font-display font-bold text-white">Or Link to External CV</h3>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="url"
            value={cvUrl.startsWith('data:') ? '' : cvUrl}
            onChange={(e) => {
              setCvUrl(e.target.value);
              if (e.target.value) setCvFileName('');
            }}
            placeholder="https://example.com/your-cv.pdf"
            className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white placeholder:text-[#444] focus:outline-none focus:border-white/25 transition-colors"
          />
        </div>
        <p className="text-[10px] font-mono text-[#555] mt-2">
          If you uploaded a file, entering a URL here will replace it.
        </p>
      </div>
      </>
      )}
    </div>
  );
};
