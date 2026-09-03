import React, { useState } from 'react';
import {
  LayoutDashboard, FolderKanban, Link2, User, Wrench,
  FileText, LogOut, ChevronLeft, ChevronRight, Shield
} from 'lucide-react';
import { logout } from '../lib/storage';
import { ProjectsManager } from './ProjectsManager';
import { LinksManager } from './LinksManager';
import { PersonalInfoManager } from './PersonalInfoManager';
import { SkillsManager } from './SkillsManager';
import { CVManager } from './CVManager';

type AdminPage = 'dashboard' | 'projects' | 'links' | 'personal' | 'skills' | 'cv';

const NAV_ITEMS: { id: AdminPage; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: 'projects', label: 'Projects', icon: <FolderKanban className="w-4 h-4" /> },
  { id: 'links', label: 'Links & Socials', icon: <Link2 className="w-4 h-4" /> },
  { id: 'personal', label: 'Personal Info', icon: <User className="w-4 h-4" /> },
  { id: 'skills', label: 'Skills', icon: <Wrench className="w-4 h-4" /> },
  { id: 'cv', label: 'CV / Resume', icon: <FileText className="w-4 h-4" /> },
];

interface AdminDashboardProps {
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [page, setPage] = useState<AdminPage>('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleLogout = async () => {
    await logout();
    onLogout();
  };

  const triggerRefresh = () => setRefreshKey((k) => k + 1);

  const renderPage = () => {
    switch (page) {
      case 'projects': return <ProjectsManager key={refreshKey} />;
      case 'links': return <LinksManager key={refreshKey} />;
      case 'personal': return <PersonalInfoManager key={refreshKey} />;
      case 'skills': return <SkillsManager key={refreshKey} />;
      case 'cv': return <CVManager key={refreshKey} />;
      default: return <DashboardHome onNavigate={setPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex">
      {/* Sidebar */}
      <aside
        className={`flex flex-col border-r border-white/8 bg-[#0D0D0D] transition-all duration-300 ${
          collapsed ? 'w-16' : 'w-56'
        }`}
      >
        {/* Logo */}
        <div className={`flex items-center border-b border-white/8 h-14 ${collapsed ? 'justify-center px-2' : 'px-4'}`}>
          {!collapsed && (
            <div className="flex items-center gap-2 min-w-0">
              <Shield className="w-4 h-4 text-white/70 shrink-0" />
              <span className="text-xs font-mono font-bold text-white uppercase truncate">Admin</span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`${collapsed ? '' : 'ml-auto'} text-[#555] hover:text-white transition-colors p-1`}
          >
            {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-3 space-y-0.5 px-2">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={`w-full flex items-center gap-2.5 rounded-lg text-xs font-mono transition-colors ${
                collapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5'
              } ${
                page === item.id
                  ? 'bg-white/10 text-white'
                  : 'text-[#666] hover:text-white hover:bg-white/5'
              }`}
              title={collapsed ? item.label : undefined}
            >
              {item.icon}
              {!collapsed && <span className="truncate">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-2 border-t border-white/8">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-xs font-mono text-[#666] hover:text-red-400 hover:bg-white/5 transition-colors ${
              collapsed ? 'justify-center px-2' : ''
            }`}
            title={collapsed ? 'Logout' : undefined}
          >
            <LogOut className="w-4 h-4" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6 md:p-8">
          {renderPage()}
        </div>
      </main>
    </div>
  );
};

const DashboardHome: React.FC<{ onNavigate: (page: AdminPage) => void }> = ({ onNavigate }) => {
  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-white mb-2">Dashboard</h1>
      <p className="text-sm font-mono text-[#888] mb-8">Manage your portfolio content</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {NAV_ITEMS.filter((n) => n.id !== 'dashboard').map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className="glass-dark p-5 text-left hover:bg-white/[0.04] transition-colors group"
          >
            <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-3 group-hover:bg-white/10 transition-colors">
              {item.icon}
            </div>
            <h3 className="text-sm font-display font-bold text-white">{item.label}</h3>
            <p className="text-xs font-mono text-[#666] mt-1">
              {item.id === 'projects' && 'Add, edit or remove portfolio projects'}
              {item.id === 'links' && 'Manage navigation and social links'}
              {item.id === 'personal' && 'Update name, role, bio and contact info'}
              {item.id === 'skills' && 'Edit technical skills categories'}
              {item.id === 'cv' && 'Upload or link your CV/Resume'}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};
