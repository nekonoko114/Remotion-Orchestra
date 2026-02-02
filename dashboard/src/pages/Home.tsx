import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Video, Clock, ArrowRight, LayoutTemplate } from 'lucide-react'

interface Project {
  id: string;
  name: string;
  templateId?: string;
  updatedAt: string;
}

interface Template {
  id: string;
  name: string;
  description: string;
}

export function Home() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', templateId: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/projects').then(res => res.json()),
  fetch('/api/templates').then(res => res.json())
]).then(([projectsData, templatesData]) => {
  setProjects(projectsData);
  setTemplates(templatesData);
  if (templatesData.length > 0) {
    setNewProject(prev => ({ ...prev, templateId: templatesData[0].id }));
  }
  setLoading(false);
});
}, []);

const handleCreate = async () => {
if (!newProject.name) return;
try {
  const res = await fetch('/api/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newProject),
  });
  const data = await res.json();
  if (data.success) {
    navigate(`/editor/${data.id}`);
  }
} catch {
  alert('Failed to create project');
}
};

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-slate-200 p-12 flex flex-col items-center">
      <div className="w-full max-w-6xl">
        <header className="flex items-end justify-between mb-20">
          <div>
            <h1 className="text-6xl font-black tracking-tighter mb-4 bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              ORCHESTRA
            </h1>
            <p className="text-xl text-slate-400 font-medium">Video Production Platform</p>
          </div>
          <button 
            onClick={() => setIsCreating(true)}
            className="group flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-black text-lg hover:scale-105 transition-all shadow-xl shadow-white/10 active:scale-95"
          >
            <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />
            NEW PROJECT
          </button>
        </header>

        {loading ? (
          <div className="text-center text-slate-500 animate-pulse">Loading workspace...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => {
              const template = templates.find(t => t.id === project.templateId) || templates[0];
              return (
                <button 
                  key={project.id}
                  onClick={() => navigate(`/editor/${project.id}`)}
                  className="group bg-white/5 border border-white/5 p-8 rounded-[2rem] hover:bg-white/[0.08] transition-all text-left relative overflow-hidden flex flex-col h-full"
                >
                  <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-4 group-hover:translate-x-0">
                    <ArrowRight className="text-violet-500 w-8 h-8" />
                  </div>
                  <div className="mb-6 w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center text-violet-300">
                    <Video className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2 truncate w-full">
                    {project.name || project.id}
                  </h3>
                  
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-lg text-xs text-slate-400 font-mono mb-4 w-fit">
                      <LayoutTemplate size={12} />
                      {template?.name || 'Default Template'}
                  </span>

                  <div className="mt-auto flex items-center gap-2 text-slate-500 text-xs font-mono pt-4 border-t border-white/5 w-full">
                    <Clock className="w-3 h-3" />
                    Updated {project.updatedAt ? new Date(project.updatedAt).toLocaleDateString() : 'Just now'}
                  </div>
                </button>
              );
            })}
            
            {projects.length === 0 && (
              <div className="col-span-full py-20 text-center text-slate-600 border-2 border-dashed border-white/5 rounded-[3rem]">
                <p className="text-xl font-bold mb-2">No active productions</p>
                <p>Start a new project to begin.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create Modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a1a1c] border border-white/10 w-full max-w-lg rounded-3xl p-10 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <h2 className="text-3xl font-black text-white mb-8">Initialize Production</h2>
            <div className="space-y-8">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 block">Project Codename</label>
                <input 
                  autoFocus
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-6 py-4 text-white font-bold outline-none focus:border-violet-500 transition-colors text-lg"
                  placeholder="e.g. summer-campaign-2024"
                  value={newProject.name}
                  onChange={e => setNewProject({...newProject, name: e.target.value})}
                />
              </div>

               <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 block">Composition Template</label>
                <div className="relative">
                    <select 
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-6 py-4 text-white font-bold outline-none focus:border-violet-500 transition-colors appearance-none cursor-pointer text-lg"
                        value={newProject.templateId}
                        onChange={e => setNewProject({...newProject, templateId: e.target.value})}
                    >
                        {templates.map(t => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                    </select>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                        <LayoutTemplate size={20} />
                    </div>
                </div>
                <p className="text-sm text-slate-500 mt-3 ml-1">
                    {templates.find(t => t.id === newProject.templateId)?.description}
                </p>
              </div>

              <div className="flex gap-4 pt-6">
                <button 
                  onClick={() => setIsCreating(false)}
                  className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-slate-300 font-bold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCreate}
                  disabled={!newProject.name}
                  className="flex-1 py-4 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-violet-600/20 transition-all hover:scale-[1.02]"
                >
                  Create Project
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
