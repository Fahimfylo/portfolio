import React, { useState, useRef } from 'react';
import { Upload, X, Loader } from 'lucide-react';
import { uploadImage } from '../lib/storage';
import { compressImage } from '../lib/imageUpload';

interface ImageUploadProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ label, value, onChange }) => {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setError('');
    setUploading(true);
    try {
      const compressed = await compressImage(file);
      const uploaded = await uploadImage(compressed.data, compressed.contentType, compressed.filename);
      onChange(uploaded.url);
    } catch (e: any) {
      setError(e.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const clear = () => {
    onChange('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-mono uppercase text-[#888] block">{label}</label>
        <span className="text-[10px] font-mono text-[#555]">max 5MB · PNG/JPG/GIF</span>
      </div>

      {value && !uploading && (
        <div className="flex items-center gap-3 p-3 bg-black/30 rounded-xl border border-white/5">
          <img src={value} alt="" className="w-16 h-16 object-cover rounded-lg border border-white/10" />
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-mono text-[#555] break-all">{value}</p>
            {value.startsWith('/api/media/') && (
              <p className="text-[10px] font-mono text-emerald-400 mt-0.5">Stored in database</p>
            )}
          </div>
          <button
            onClick={clear}
            className="p-2 text-[#666] hover:text-red-400 transition-colors shrink-0"
            title="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl px-4 py-6 text-center transition-colors cursor-pointer ${
          dragOver ? 'border-emerald-400/50 bg-emerald-500/5' : 'border-white/10 hover:border-white/25'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/gif"
          onChange={(e) => handleFile(e.target.files?.[0])}
          className="hidden"
        />
        {uploading ? (
          <div className="flex items-center justify-center gap-2 text-[#888]">
            <Loader className="w-4 h-4 animate-spin" />
            <span className="text-xs font-mono">Uploading & compressing...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1.5">
            <Upload className="w-5 h-5 text-[#555]" />
            <p className="text-xs font-mono text-[#888]">
              Drop an image here or <span className="text-emerald-400">browse</span>
            </p>
            <p className="text-[10px] font-mono text-[#555]">Auto-resized to max 1600px</p>
          </div>
        )}
      </div>

      {error && <p className="text-[11px] font-mono text-red-400">{error}</p>}
    </div>
  );
};