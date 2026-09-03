import React, { useState, useEffect } from 'react';
import { Plus, Trash2, GripVertical, Save, X, ExternalLink } from 'lucide-react';
import { getPortfolioData, savePortfolioData } from '../lib/storage';
import type { ProjectItem } from '../content';

const emptyProject: () => ProjectItem = () => ({
  id: '',
  number: '01',
  title: '',
  tagline: '',
  description: '',
  category: '',
  previewImage: '',
  deviceMockupImage: '',
  techStack: [],
  liveUrl: '',
  githubUrl: '',
  showOnHome: false,
  technicalNarrative: { problem: '', tradeoff: '', outcome: '' },
  metrics: [],
});

export const ProjectsManager: React.FC = () => {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<ProjectItem>(emptyProject());
  const [isAdding, setIsAdding] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    getPortfolioData().then((data) => {
      if (alive) {
        setProjects(data.projects);
        setLoading(false);
      }
    });
    return () => { alive = false; };
  }, []);

  const save = async () => {
    const data = await getPortfolioData();
    data.projects = projects;
    await savePortfolioData(data);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const startEdit = (project: ProjectItem) => {
    setEditingId(project.id);
    setEditData({ ...project, techStack: [...project.techStack], metrics: [...project.metrics] });
    setIsAdding(false);
  };

  const startAdd = () => {
    const newProject = emptyProject();
    newProject.id = `project-${Date.now()}`;
    newProject.number = String(projects.length + 1).padStart(2, '0');
    setEditingId(newProject.id);
    setEditData(newProject);
    setIsAdding(true);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsAdding(false);
  };

  const saveEdit = () => {
    if (isAdding) {
      setProjects([...projects, editData]);
    } else {
      setProjects(projects.map((p) => (p.id === editingId ? editData : p)));
    }
    setEditingId(null);
    setIsAdding(false);
  };

  const deleteProject = (id: string) => {
    setProjects(projects.filter((p) => p.id !== id));
  };

  const toggleShowOnHome = (id: string) => {
    setProjects(
      projects.map((p) =>
        p.id === id ? { ...p, showOnHome: !(p.showOnHome !== false) } : p
      )
    );
  };

  const updateField = <K extends keyof ProjectItem>(key: K, value: ProjectItem[K]) => {
    setEditData({ ...editData, [key]: value });
  };

  const updateNarrative = (key: keyof ProjectItem['technicalNarrative'], value: string) => {
    setEditData({
      ...editData,
      technicalNarrative: { ...editData.technicalNarrative, [key]: value },
    });
  };

  const addTag = (field: 'techStack' | 'metrics') => {
    setEditData({ ...editData, [field]: [...editData[field], ''] });
  };

  const updateTag = (field: 'techStack' | 'metrics', index: number, value: string) => {
    const arr = [...editData[field]];
    arr[index] = value;
    setEditData({ ...editData, [field]: arr });
  };

  const removeTag = (field: 'techStack' | 'metrics', index: number) => {
    setEditData({ ...editData, [field]: editData[field].filter((_, i) => i !== index) });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Projects</h1>
          <p className="text-xs font-mono text-[#888] mt-1">
            {projects.length} project(s) ·{' '}
            <span className="text-emerald-400">{projects.filter((p) => p.showOnHome !== false).length} on home</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="text-xs font-mono text-emerald-400">Saved!</span>
          )}
          <button
            onClick={save}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400 hover:bg-emerald-500/20 transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            Save All
          </button>
          <button
            onClick={startAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white text-black font-mono text-xs uppercase font-bold hover:bg-neutral-200 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Project
          </button>
        </div>
      </div>

      {/* Editor Modal */}
      {editingId && (
        <div className="glass-elevated p-6 mb-6 space-y-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="text-sm font-display font-bold text-white">
              {isAdding ? 'New Project' : 'Edit Project'}
            </h3>
            <div className="flex gap-2">
              <button onClick={cancelEdit} className="p-2 text-[#666] hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
              <button onClick={saveEdit} className="p-2 text-emerald-400 hover:text-emerald-300 transition-colors">
                <Save className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Title" value={editData.title} onChange={(v) => updateField('title', v)} />
            <Field label="Tagline" value={editData.tagline} onChange={(v) => updateField('tagline', v)} />
            <Field label="Category" value={editData.category} onChange={(v) => updateField('category', v)} />
            <Field label="Number" value={editData.number} onChange={(v) => updateField('number', v)} />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-white/10">
            <div>
              <p className="text-[11px] font-mono uppercase text-[#888]">Show on Home Screen</p>
              <p className="text-[10px] font-mono text-[#555] mt-0.5">
                Marked projects appear in the Works section on the home page
              </p>
            </div>
            <Toggle
              checked={editData.showOnHome !== false}
              onChange={(v) => updateField('showOnHome', v)}
            />
          </div>

          <TextArea label="Description" value={editData.description} onChange={(v) => updateField('description', v)} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Preview Image URL" value={editData.previewImage} onChange={(v) => updateField('previewImage', v)} />
            <Field label="Device Mockup Image URL" value={editData.deviceMockupImage} onChange={(v) => updateField('deviceMockupImage', v)} />
            <Field label="Live URL" value={editData.liveUrl} onChange={(v) => updateField('liveUrl', v)} />
            <Field label="GitHub URL" value={editData.githubUrl} onChange={(v) => updateField('githubUrl', v)} />
          </div>

          {/* Tech Stack Tags */}
          <TagEditor label="Tech Stack" tags={editData.techStack} field="techStack" onAdd={addTag} onUpdate={updateTag} onRemove={removeTag} />

          {/* Metrics Tags */}
          <TagEditor label="Metrics" tags={editData.metrics} field="metrics" onAdd={addTag} onUpdate={updateTag} onRemove={removeTag} />

          {/* Technical Narrative */}
          <div className="space-y-3">
            <p className="text-[11px] font-mono uppercase text-[#888]">Technical Narrative</p>
            <TextArea label="Problem" value={editData.technicalNarrative.problem} onChange={(v) => updateNarrative('problem', v)} rows={3} />
            <TextArea label="Tradeoff" value={editData.technicalNarrative.tradeoff} onChange={(v) => updateNarrative('tradeoff', v)} rows={3} />
            <TextArea label="Outcome" value={editData.technicalNarrative.outcome} onChange={(v) => updateNarrative('outcome', v)} rows={3} />
          </div>

          {editData.previewImage && (
            <div className="mt-4">
              <p className="text-[11px] font-mono uppercase text-[#888] mb-2">Preview</p>
              <img src={editData.previewImage} alt="Preview" className="w-full h-40 object-cover rounded-lg border border-white/10" />
            </div>
          )}
        </div>
      )}

      {/* Project List */}
      {loading ? (
        <div className="py-12 flex justify-center">
          <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      ) : (
      <div className="space-y-2">
        {projects.map((project, i) => (
          <div
            key={project.id}
            className="glass-dark p-4 flex items-center gap-4 hover:bg-white/[0.03] transition-colors"
          >
            <GripVertical className="w-4 h-4 text-[#444] shrink-0" />
            <span className="text-xs font-mono text-[#555] w-6 shrink-0">{project.number}</span>
            {project.previewImage && (
              <img src={project.previewImage} alt="" className="w-12 h-8 object-cover rounded border border-white/10 shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-display font-bold text-white truncate">{project.title || 'Untitled'}</p>
              <p className="text-xs font-mono text-[#666] truncate">{project.tagline}</p>
            </div>
            <span className="text-[10px] font-mono text-[#555] bg-white/5 px-2 py-1 rounded hidden sm:inline">
              {project.techStack.length} tech
            </span>
            <span className="text-[10px] font-mono text-[#555] bg-white/5 px-2 py-1 rounded hidden sm:inline">
              {project.category}
            </span>
            <div className="flex items-center gap-2 shrink-0" title={project.showOnHome !== false ? 'Shown on home screen' : 'Hidden from home screen'}>
              <Toggle checked={project.showOnHome !== false} onChange={() => toggleShowOnHome(project.id)} />
              <span className={`text-[10px] font-mono select-none ${project.showOnHome !== false ? 'text-emerald-400' : 'text-[#555]'}`}>
                {project.showOnHome !== false ? 'Home' : 'Hide'}
              </span>
            </div>
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-[#555] hover:text-white transition-colors shrink-0"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={() => startEdit(project)}
              className="px-3 py-1.5 text-[10px] font-mono uppercase text-[#888] hover:text-white bg-white/5 rounded-lg hover:bg-white/10 transition-colors shrink-0"
            >
              Edit
            </button>
            <button
              onClick={() => deleteProject(project.id)}
              className="p-2 text-[#555] hover:text-red-400 transition-colors shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
        {projects.length === 0 && (
          <p className="text-xs font-mono text-[#555] text-center py-12">No projects yet. Click "Add Project" to get started.</p>
        )}
      </div>
      )}
    </div>
  );
};

const Field: React.FC<{ label: string; value: string; onChange: (v: string) => void }> = ({ label, value, onChange }) => (
  <div className="space-y-1.5">
    <label className="text-[11px] font-mono uppercase text-[#888] block">{label}</label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-white/25 transition-colors"
    />
  </div>
);

const TextArea: React.FC<{ label: string; value: string; onChange: (v: string) => void; rows?: number }> = ({
  label, value, onChange, rows = 4,
}) => (
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

const TagEditor: React.FC<{
  label: string;
  tags: string[];
  field: 'techStack' | 'metrics';
  onAdd: (field: 'techStack' | 'metrics') => void;
  onUpdate: (field: 'techStack' | 'metrics', index: number, value: string) => void;
  onRemove: (field: 'techStack' | 'metrics', index: number) => void;
}> = ({ label, tags, field, onAdd, onUpdate, onRemove }) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <p className="text-[11px] font-mono uppercase text-[#888]">{label}</p>
      <button
        onClick={() => onAdd(field)}
        className="text-[10px] font-mono text-[#666] hover:text-white flex items-center gap-1 transition-colors"
      >
        <Plus className="w-3 h-3" /> Add
      </button>
    </div>
    <div className="flex flex-wrap gap-2">
      {tags.map((tag, i) => (
        <div key={i} className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-lg">
          <input
            type="text"
            value={tag}
            onChange={(e) => onUpdate(field, i, e.target.value)}
            className="bg-transparent px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none w-28"
          />
          <button onClick={() => onRemove(field, i)} className="pr-2 text-[#555] hover:text-red-400 transition-colors">
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
      {tags.length === 0 && (
        <span className="text-[10px] font-mono text-[#555]">No tags</span>
      )}
    </div>
  </div>
);

const Toggle: React.FC<{ checked: boolean; onChange: (v: boolean) => void }> = ({ checked, onChange }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className={`relative w-10 h-5 rounded-full border transition-colors shrink-0 ${
      checked ? 'bg-emerald-500/30 border-emerald-500/50' : 'bg-black/40 border-white/15 hover:border-white/30'
    }`}
  >
    <span
      className={`absolute top-0.5 w-4 h-4 rounded-full transition-all ${
        checked ? 'left-5 bg-emerald-400' : 'left-0.5 bg-[#555]'
      }`}
    />
  </button>
);
