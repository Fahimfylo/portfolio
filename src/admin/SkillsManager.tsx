import React, { useState, useEffect } from 'react';
import { Plus, X, Save, Wrench } from 'lucide-react';
import { getPortfolioData, savePortfolioData } from '../lib/storage';

type SkillCategory = 'languagesAndTools' | 'frameworksAndLibraries' | 'coreCS';

const CATEGORY_LABELS: Record<SkillCategory, string> = {
  languagesAndTools: 'Languages & Tools',
  frameworksAndLibraries: 'Frameworks & Libraries',
  coreCS: 'Core CS',
};

export const SkillsManager: React.FC = () => {
  const [skills, setSkills] = useState<Record<SkillCategory, string[]>>({
    languagesAndTools: [],
    frameworksAndLibraries: [],
    coreCS: [],
  });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    getPortfolioData().then((data) => {
      if (alive) {
        setSkills(data.skills);
        setLoading(false);
      }
    });
    return () => { alive = false; };
  }, []);

  const save = async () => {
    const data = await getPortfolioData();
    data.skills = skills;
    await savePortfolioData(data);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addSkill = (category: SkillCategory) => {
    setSkills({ ...skills, [category]: [...skills[category], ''] });
  };

  const updateSkill = (category: SkillCategory, index: number, value: string) => {
    const updated = [...skills[category]];
    updated[index] = value;
    setSkills({ ...skills, [category]: updated });
  };

  const removeSkill = (category: SkillCategory, index: number) => {
    setSkills({ ...skills, [category]: skills[category].filter((_, i) => i !== index) });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Skills</h1>
          <p className="text-xs font-mono text-[#888] mt-1">Manage your technical skill categories</p>
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

      {loading ? (
        <div className="py-16 flex justify-center">
          <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      ) : (
      <div className="space-y-6">
        {(Object.keys(CATEGORY_LABELS) as SkillCategory[]).map((category) => (
          <div key={category} className="glass-dark p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-white/60" />
                <h3 className="text-sm font-display font-bold text-white">
                  {CATEGORY_LABELS[category]}
                </h3>
                <span className="text-[10px] font-mono text-[#555] bg-white/5 px-2 py-0.5 rounded">
                  {skills[category].length}
                </span>
              </div>
              <button
                onClick={() => addSkill(category)}
                className="text-[10px] font-mono text-[#666] hover:text-white flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3 h-3" /> Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills[category].map((skill, i) => (
                <div key={i} className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-lg">
                  <input
                    type="text"
                    value={skill}
                    onChange={(e) => updateSkill(category, i, e.target.value)}
                    className="bg-transparent px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none w-32"
                  />
                  <button
                    onClick={() => removeSkill(category, i)}
                    className="pr-2 text-[#555] hover:text-red-400 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {skills[category].length === 0 && (
                <p className="text-xs font-mono text-[#555]">No skills in this category</p>
              )}
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
};
