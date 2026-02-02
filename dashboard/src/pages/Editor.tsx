import { useState, useEffect, useCallback, type ReactNode } from 'react'
import { 
  Music, 
  Users, 
  LayoutDashboard, 
  Save, 
  RefreshCw, 
  Zap,
  Type,
  Cpu,
  Volume2,
  Image as ImageIcon,
  Play,
  ExternalLink,
  ChevronRight,
  Plus,
  Trash2,
  Settings2,
  Sparkles
} from 'lucide-react'
import { cn } from '../lib/utils'
import { useParams, useNavigate } from 'react-router-dom'

interface Asset {
  name: string;
  category: string;
  url: string;
  path: string;
}

interface TimelineItem {
    id: number | string;
    label: string;
    start_frame: number;
    end_frame: number;
    text_primary?: string;
    text_secondary?: string;
    text_liner_a?: string;
    text_liner_b?: string;
    effect?: string;
    [key: string]: any;
}

interface RankingItem {
    rank: number;
    nickname?: string;
    username: string;
    image_url: string;
    signature?: string;
}

interface ProjectData {
  templateId?: string;
  name?: string;
  data?: RankingItem[];
  video_config?: {
    fps: number;
    total_duration_seconds: number;
  };
  players?: {
    left: { name: string; color: string; image?: string };
    right: { name: string; color: string; image?: string };
  };
  timeline?: TimelineItem[];
  ai_orchestrator?: {
    use_luma: boolean;
    use_elevenlabs: boolean;
    use_kling: boolean;
    use_minimax: boolean;
  };
  words?: { text: string; start: number; end: number }[];
  [key: string]: any; 
}

interface Template {
    id: string;
    name: string;
    description: string;
}

export function Editor() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [config, setConfig] = useState<ProjectData | null>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [assets, setAssets] = useState<{ images: Asset[], audio: Asset[] }>({ images: [], audio: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("Connected");
  const [showTemplateSwitcher, setShowTemplateSwitcher] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);

  const templateId = config?.templateId || 'JOL-Battle-Kawaii';
  const category = getTemplateCategory(templateId);

  const fetchAssets = useCallback(async () => {
    try {
      const res = await fetch('/api/assets');
      const data = await res.json();
      setAssets(data);
    } catch (e) {
      console.error("Failed to load assets", e);
    }
  }, []);

  const fetchConfig = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${projectId || 'default.json'}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      
      const templatesRes = await fetch('/api/templates');
      const templatesData = await templatesRes.json();
      setTemplates(templatesData);

      if (Array.isArray(data)) {
          setConfig({ 
              templateId: 'JOL-Ranking-Vertical',
              data: data as RankingItem[],
              video_config: { fps: 60, total_duration_seconds: 60 },
              players: { left: {name:'', color:''}, right: {name:'', color:''} },
              timeline: []
          });
      } else {
          setConfig(data as ProjectData);
      }
      setStatus("Connected");
    } catch (e) {
      console.error(e);
      setStatus("Disconnected");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  function getTemplateCategory(tid: string) {
    if (tid.includes('Battle') || tid === 'TikTokBattle') return 'battle';
    if (tid.includes('Ranking') || tid === 'JOL-Ranking-time') return 'ranking';
    if (tid === 'LiverFormatter' || tid === 'TikTokAutoCut') return 'utility';
    if (tid === 'JsonDrivenVideo' || tid === 'CatsAdventure') return 'story';
    return 'general';
  }

  const getTabs = () => {
    const common = [{ id: 'overview', label: 'Overview', icon: <LayoutDashboard size={20} /> }];
    
    if (category === 'battle') {
        return [
            ...common,
            { id: 'players', label: 'Players', icon: <Users size={20} /> },
            { id: 'timeline', label: 'Timeline Text', icon: <Type size={20} /> },
            { id: 'settings', label: 'AI Settings', icon: <Cpu size={20} /> },
            { id: 'audio', label: 'Assets', icon: <Music size={20} /> },
        ];
    }
    if (category === 'ranking') {
        return [
            ...common,
            { id: 'ranking-data', label: 'Ranking Data', icon: <Users size={20} /> },
            { id: 'audio', label: 'Assets', icon: <Music size={20} /> },
        ];
    }
    if (category === 'story') {
        return [
            ...common,
            { id: 'scenes', label: 'Scene Editor', icon: <Type size={20} /> },
            { id: 'audio', label: 'Assets', icon: <Music size={20} /> },
        ];
    }
    if (category === 'utility') {
      return [
          ...common,
          { id: 'subtitles', label: 'Subtitles', icon: <Type size={20} /> },
          { id: 'audio', label: 'Assets', icon: <Music size={20} /> },
      ];
    }
    return [
      ...common,
      { id: 'raw', label: 'Raw Data', icon: <Cpu size={20} /> },
      { id: 'audio', label: 'Assets', icon: <Music size={20} /> },
    ];
  };

  useEffect(() => {
    fetchConfig();
    fetchAssets();
  }, [fetchConfig, fetchAssets]); 

  const handleSave = async () => {
    if (!config) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/projects/${projectId || 'default.json'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      if (res.ok) {
        setPreviewKey(prev => prev + 1);
        setStatus("Changes Saved");
        setTimeout(() => setStatus("Connected"), 2000);
      }
    } catch {
      alert("Save Failed");
    } finally {
      setSaving(false);
    }
  };

  const updatePlayer = (side: 'left' | 'right', field: string, value: string) => {
    if (!config || !config.players) return;
    const newPlayers = { ...config.players };
    (newPlayers as any)[side] = { ...(newPlayers as any)[side], [field]: value };
    setConfig({
      ...config,
      players: newPlayers
    });
  };

  const updateTimelineText = (index: number, field: string, value: string) => {
    if (!config || !config.timeline) return;
    const newTimeline = [...config.timeline];
    newTimeline[index] = { ...newTimeline[index], [field]: value };
    setConfig({ ...config, timeline: newTimeline });
  };

  const toggleAI = (key: string) => {
    if (!config || !config.ai_orchestrator) return;
    setConfig({
      ...config,
      ai_orchestrator: {
        ...config.ai_orchestrator,
        [key]: !((config.ai_orchestrator as any)[key])
      }
    });
  };

  const changeTemplate = (tid: string) => {
      if (!config) return;
      setConfig({ ...config, templateId: tid });
      setShowTemplateSwitcher(false);
  };

  const addRankingItem = () => {
      if (!config) return;
      const newData = [...(config.data || [])];
      newData.push({
          rank: newData.length + 1,
          nickname: 'New Entry',
          username: 'user_' + Math.floor(Math.random()*1000),
          image_url: 'https://via.placeholder.com/150',
          signature: ''
      });
      setConfig({ ...config, data: newData });
  };

  const addTimelineItem = () => {
      if (!config || !config.timeline) return;
      const newTimeline = [...config.timeline];
      const last = newTimeline[newTimeline.length - 1] || { end_frame: 0 };
      newTimeline.push({
          id: newTimeline.length + 1,
          label: 'New Segment',
          start_frame: last.end_frame,
          end_frame: last.end_frame + 60,
          text_primary: 'New Content',
          effect: 'zoom_and_glitch'
      });
      setConfig({ ...config, timeline: newTimeline });
  };

  const previewProps = encodeURIComponent(JSON.stringify(config || {}));
  const previewUrl = `http://localhost:3000/composition/${templateId}?props=${previewProps}&hide-sidebar=true&autoplay=true`;

  return (
    <div className="flex min-h-screen bg-[#0a0a0c] text-white font-sans selection:bg-violet-500/30 overflow-hidden h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-black/40 backdrop-blur-3xl flex flex-col p-6 h-full shrink-0 z-50">
        <div className="flex items-center gap-3 mb-10 px-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate('/')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-400 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <Zap className="text-white w-6 h-6 fill-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight text-white leading-tight uppercase">Orchestra</h1>
            <p className="text-[10px] text-slate-500 font-black tracking-widest uppercase">Video Production</p>
          </div>
        </div>

        <nav className="space-y-1 overflow-y-auto custom-scrollbar flex-1 pr-2">
          {getTabs().map(tab => (
              <SidebarItem 
                key={tab.id}
                icon={tab.icon} 
                label={tab.label} 
                active={activeTab === tab.id} 
                onClick={() => setActiveTab(tab.id)}
              />
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-white/5 px-2 bg-black/40 -mx-6 px-6">
          <div className="flex items-center gap-2 mb-4">
            <div className={cn("w-2 h-2 rounded-full animate-pulse", status.includes("Saved") ? "bg-blue-500" : status === "Connected" ? "bg-green-500" : "bg-red-500")} />
            <span className="text-[10px] font-black tracking-widest uppercase text-slate-500">{status}</span>
          </div>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white rounded-2xl transition-all font-bold text-sm shadow-xl shadow-violet-600/20 active:scale-95 group mb-2"
          >
            {saving ? <RefreshCw className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4 group-hover:rotate-12 transition-transform" />}
            SAVE & SYNC
          </button>
        </div>
      </aside>

      {/* Workspace Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Scrollable Editor */}
        <main className="flex-1 overflow-y-auto px-12 py-10 custom-scrollbar bg-gradient-to-br from-black to-[#050507]">
          {!loading && config ? (
            <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000">
              
              {activeTab === 'overview' && (
                <section>
                  <div className="mb-12">
                    <h2 className="text-5xl font-black text-white mb-4 tracking-tighter italic">Production Hub</h2>
                    <p className="text-slate-400 text-lg">Managing production <span className="text-violet-400 font-mono font-bold bg-violet-400/10 px-2 py-0.5 rounded">{projectId?.replace('.json','')}</span></p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <StatCard label="Engine Refresh" value={config.video_config?.fps || 30} unit="fps" color="from-blue-500 to-cyan-400" />
                    <StatCard label="Playtime" value={config.video_config?.total_duration_seconds || 0} unit="sec" color="from-violet-500 to-fuchsia-400" />
                    <StatCard label="Complexity" value={(config.timeline?.length || 0) + (config.data?.length || 0)} unit="pts" color="from-amber-500 to-orange-400" />
                  </div>

                  <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-12 flex flex-col md:flex-row items-center gap-10 hover:bg-white/[0.04] transition-all relative overflow-hidden group shadow-2xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/5 blur-[100px] rounded-full -mr-32 -mt-32" />
                    <div className="flex-1 relative z-10 text-center md:text-left">
                      <h3 className="text-3xl font-black text-white mb-4 italic tracking-tight uppercase">Composition Blueprint</h3>
                      <div className="inline-flex items-center gap-3 px-6 py-2 bg-violet-500/10 border border-violet-500/20 rounded-full mb-8">
                         <Sparkles size={16} className="text-violet-400 fill-violet-400 animate-pulse" />
                         <span className="text-md font-black text-violet-400 font-mono uppercase tracking-widest">{templateId}</span>
                      </div>
                      <p className="text-slate-400 mb-10 leading-relaxed text-xl font-medium">
                          You are currently working with the <span className="text-white font-black">{category.toUpperCase()}</span> engine. 
                          All parameters are dynamically synced to the preview.
                      </p>
                      <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                        <button className="flex items-center gap-3 px-10 py-5 bg-violet-600 text-white rounded-[1.5rem] font-black hover:bg-violet-500 transition-all shadow-2xl hover:scale-105 active:scale-95 uppercase tracking-widest text-sm" 
                                onClick={() => setActiveTab(getTabs()[1]?.id || 'overview')}>
                          START EDITING <ChevronRight size={18} />
                        </button>
                        <button className="flex items-center gap-3 px-10 py-5 bg-white/5 text-white rounded-[1.5rem] font-black hover:bg-white/10 transition-all border border-white/5 uppercase tracking-widest text-sm"
                                onClick={() => setShowTemplateSwitcher(!showTemplateSwitcher)}>
                          SWITCH TEMPLATE <Settings2 size={18} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="w-64 h-64 bg-gradient-to-br from-violet-600/20 to-fuchsia-500/20 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 flex items-center justify-center p-10 shadow-3xl group-hover:rotate-6 transition-transform relative shrink-0">
                        <LayoutDashboard className="w-full h-full text-violet-400/30" />
                        <div className="absolute inset-0 bg-gradient-to-t from-violet-600/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[2.5rem]" />
                    </div>
                  </div>

                  {/* Template Switcher Dropdown/Modal */}
                  {showTemplateSwitcher && (
                      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-4">
                          {templates.map(t => (
                              <button 
                                key={t.id}
                                onClick={() => changeTemplate(t.id)}
                                className={cn(
                                    "p-6 rounded-[2rem] border transition-all text-left group text-white",
                                    templateId === t.id ? "bg-violet-600 border-violet-500 shadow-xl" : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10"
                                )}
                              >
                                  <h4 className="font-black text-lg mb-1 uppercase tracking-tight">{t.name}</h4>
                                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed opacity-60 group-hover:text-slate-200">{t.description}</p>
                              </button>
                          ))}
                      </div>
                  )}
                </section>
              )}

              {activeTab === 'players' && (
                <section>
                   <div className="mb-12">
                    <h2 className="text-5xl font-black text-white mb-4 italic uppercase tracking-tighter">Participants</h2>
                    <p className="text-slate-400 text-lg font-medium">Configure character identities and aesthetic signatures.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <PlayerEditCard 
                      title="Challenger Alpha" 
                      data={config.players?.left || { name: '', color: '' }} 
                      onChange={(f: string, v: string) => updatePlayer('left', f, v)}
                      assets={assets.images}
                    />
                    <PlayerEditCard 
                      title="Challenger Omega" 
                      data={config.players?.right || { name: '', color: '' }} 
                      onChange={(f: string, v: string) => updatePlayer('right', f, v)}
                      assets={assets.images}
                    />
                  </div>
                </section>
              )}

              {activeTab === 'timeline' && (
                <section>
                  <div className="mb-12 flex items-end justify-between">
                    <div>
                        <h2 className="text-5xl font-black text-white mb-4 italic tracking-tighter uppercase">Script Matrix</h2>
                        <p className="text-slate-400 text-lg font-medium">Choreograph visual text and narrative prompts.</p>
                    </div>
                    <button onClick={addTimelineItem} className="flex items-center gap-2 px-6 py-3 bg-violet-600/20 text-violet-400 border border-violet-600/30 rounded-full font-black text-xs hover:bg-violet-600 transition-all hover:text-white uppercase tracking-widest shadow-lg">
                        <Plus size={16} /> ADD SEGMENT
                    </button>
                  </div>
                  <div className="space-y-6">
                    {config.timeline?.map((item, i) => (
                      <div key={item.id || i} className="bg-white/5 border border-white/5 rounded-[2.5rem] p-10 hover:bg-white/[0.08] transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        <div className="flex items-center justify-between border-b border-white/5 pb-6 mb-8">
                          <div className="flex items-center gap-6">
                             <div className="w-12 h-12 rounded-2xl bg-violet-600 flex items-center justify-center shadow-2xl shadow-violet-600/40 rotate-3 group-hover:rotate-12 transition-transform">
                               <span className="text-white font-black text-lg italic">{i + 1}</span>
                             </div>
                             <div>
                                <h4 className="font-black text-2xl text-white tracking-tight italic uppercase">{item.label}</h4>
                                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em]">Effect: {item.effect || 'Standard Reveal'}</span>
                             </div>
                          </div>
                          <div className="flex items-center gap-3">
                              <span className="text-[10px] text-slate-500 font-black tracking-[0.2em] bg-black/60 px-5 py-2 rounded-full uppercase border border-white/5 italic shadow-inner">FRAMES {item.start_frame}—{item.end_frame}</span>
                              <button 
                                onClick={() => {
                                    const nt = [...(config.timeline || [])];
                                    nt.splice(i, 1);
                                    setConfig({ ...config, timeline: nt });
                                }}
                                className="p-2 text-slate-600 hover:text-red-500 transition-colors"
                              >
                                  <Trash2 size={20} />
                              </button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-10">
                          {item.text_primary !== undefined && (
                            <InputGroup 
                              label="Main Proposition (H1)" 
                              value={item.text_primary} 
                              onChange={(v) => updateTimelineText(i, 'text_primary', v)} 
                            />
                          )}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              {item.text_liner_a !== undefined && (
                                <InputGroup 
                                  label="Left Accent" 
                                  value={item.text_liner_a} 
                                  onChange={(v) => updateTimelineText(i, 'text_liner_a', v)} 
                                />
                              )}
                               {item.text_liner_b !== undefined && (
                                <InputGroup 
                                  label="Right Accent" 
                                  value={item.text_liner_b} 
                                  onChange={(v) => updateTimelineText(i, 'text_liner_b', v)} 
                                />
                              )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {(!config.timeline || config.timeline.length === 0) && (
                        <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[3rem]">
                            <p className="text-slate-600 font-black italic uppercase tracking-widest">No segments initialized</p>
                        </div>
                    )}
                  </div>
                </section>
              )}

              {activeTab === 'ranking-data' && (
                 <section>
                   <div className="mb-12 flex items-end justify-between">
                     <div>
                        <h2 className="text-5xl font-black text-white mb-4 italic uppercase tracking-tighter">Leaderboard</h2>
                        <p className="text-slate-400 text-lg font-medium">Sync real-time data to the ranking visualization engine.</p>
                     </div>
                     <button onClick={addRankingItem} className="flex items-center gap-2 px-6 py-3 bg-violet-600/20 text-violet-400 border border-violet-600/30 rounded-full font-black text-xs hover:bg-violet-600 transition-all hover:text-white uppercase tracking-widest shadow-lg">
                        <Plus size={16} /> ADD ENTRY
                    </button>
                   </div>
                   <div className="space-y-4">
                     {(config.data || []).map((item, i) => (
                       <div key={i} className="bg-white/[0.03] border border-white/5 p-8 rounded-[2.5rem] flex items-center gap-8 group hover:bg-white/[0.05] transition-all relative">
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center font-black text-3xl italic text-white shadow-3xl shadow-violet-600/30 rotate-3">{item.rank}</div>
                          <div 
                              className="w-24 h-24 rounded-3xl bg-black/60 overflow-hidden border border-white/10 shrink-0 shadow-inner group-hover:scale-110 transition-transform cursor-pointer relative"
                              onClick={() => {
                                  // Simplified picker toggle for ranking data
                                  const pickerId = `picker-rank-${i}`;
                                  const el = document.getElementById(pickerId);
                                  if (el) el.classList.toggle('hidden');
                              }}
                          >
                              <img src={item.image_url.startsWith('http') ? item.image_url : `/assets/${item.image_url.replace(/^\/assets\//, '')}`} alt="" className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" />
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                                  <ImageIcon size={24} className="text-white" />
                              </div>
                              
                              <div id={`picker-rank-${i}`} className="hidden absolute inset-0 bg-black/90 p-2 overflow-y-auto custom-scrollbar z-20 grid grid-cols-2 gap-2">
                                  {assets.images.map(a => (
                                      <img 
                                          key={a.name}
                                          src={a.url}
                                          className="w-full aspect-square object-cover rounded-lg hover:ring-2 ring-violet-500"
                                          onClick={(e) => {
                                              e.stopPropagation();
                                              const newData = [...(config.data as RankingItem[])];
                                              newData[i] = { ...newData[i], image_url: a.path };
                                              setConfig({...config, data: newData});
                                              document.getElementById(`picker-rank-${i}`)?.classList.add('hidden');
                                          }}
                                      />
                                  ))}
                              </div>
                          </div>
                          <div className="flex-1">
                            <label className="text-[10px] text-violet-400 font-black tracking-widest uppercase mb-1 block italic px-1">Identity Tag</label>
                            <input 
                              className="bg-transparent border-none text-3xl font-black text-white outline-none w-full placeholder:text-slate-800 tracking-tight"
                              value={item.nickname || item.username}
                              placeholder="Set Name..."
                              onChange={(e) => {
                                const newData = [...(config.data as RankingItem[])];
                                newData[i] = { ...newData[i], nickname: e.target.value };
                                setConfig({...config, data: newData});
                              }}
                            />
                            <p className="text-[10px] text-slate-600 font-black tracking-widest uppercase mt-2">UID: {item.username}</p>
                          </div>
                          <div className="w-96">
                            <label className="text-[10px] text-slate-600 uppercase font-black tracking-widest block mb-1 px-1 italic">Catchphrase / Signature</label>
                            <input 
                              className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-lg text-slate-200 outline-none focus:border-violet-500 focus:ring-4 ring-violet-500/10 transition-all font-bold placeholder:text-slate-800"
                              value={item.signature || ''}
                              placeholder="Enter message..."
                              onChange={(e) => {
                                const newData = [...(config.data as RankingItem[])];
                                newData[i] = { ...newData[i], signature: e.target.value };
                                setConfig({...config, data: newData});
                              }}
                            />
                          </div>
                          <button 
                            onClick={() => {
                                const nd = [...(config.data as RankingItem[])];
                                nd.splice(i, 1);
                                setConfig({ ...config, data: nd });
                            }}
                            className="p-3 text-slate-700 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                          >
                              <Trash2 size={24} />
                          </button>
                       </div>
                     ))}
                   </div>
                 </section>
              )}

              {activeTab === 'scenes' && (
                <section>
                  <div className="mb-12 flex items-end justify-between">
                    <div>
                        <h2 className="text-5xl font-black text-white mb-4 tracking-tighter uppercase italic">Blueprint</h2>
                        <p className="text-slate-400 text-lg font-medium">Design the narrative sequence and key prompts.</p>
                    </div>
                    <button onClick={addTimelineItem} className="flex items-center gap-2 px-6 py-3 bg-violet-600/20 text-violet-400 border border-violet-600/30 rounded-full font-black text-xs hover:bg-violet-600 transition-all hover:text-white uppercase tracking-widest shadow-lg">
                        <Plus size={16} /> NEW SCENE
                    </button>
                  </div>
                  <div className="space-y-8">
                     {(config.timeline || []).map((scene, i) => (
                       <div key={i} className="bg-white/5 border border-white/10 p-12 rounded-[3.5rem] hover:bg-white/[0.08] transition-all relative overflow-hidden group">
                          <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/5 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
                          <div className="flex items-center justify-between mb-10">
                             <div className="flex items-center gap-4">
                               <div className="w-16 h-10 bg-violet-600 text-white rounded-2xl flex items-center justify-center text-sm font-black italic shadow-2xl shadow-violet-600/30">#{i+1}</div>
                               <h4 className="text-2xl font-black uppercase text-white tracking-widest italic">{scene.label || 'Segment'}</h4>
                             </div>
                             <div className="flex items-center gap-4">
                                <span className="px-5 py-2 bg-black/40 border border-white/10 rounded-full text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">{scene.duration_frames} TICKS</span>
                                <button className="p-2 text-slate-600 hover:text-red-500 transition-colors">
                                    <Trash2 size={20} />
                                </button>
                             </div>
                          </div>
                          <div className="grid grid-cols-1 gap-12 relative z-10">
                            <InputGroup 
                              label="Core Narrative Script" 
                              value={scene.text_primary || scene.text || ''} 
                              onChange={(v) => {
                                 const newTimeline = [...(config.timeline || [])];
                                 newTimeline[i] = { ...newTimeline[i], text_primary: v };
                                 setConfig({...config, timeline: newTimeline});
                              }} 
                            />
                             <InputGroup 
                              label="Auxiliary Visual Copy" 
                              value={scene.text_secondary || ''} 
                              onChange={(v) => {
                                 const newTimeline = [...(config.timeline || [])];
                                 newTimeline[i] = { ...newTimeline[i], text_secondary: v };
                                 setConfig({...config, timeline: newTimeline});
                              }} 
                            />
                          </div>
                       </div>
                     ))}
                  </div>
                </section>
              )}

              {activeTab === 'subtitles' && (
                 <section>
                   <div className="mb-12">
                     <h2 className="text-5xl font-black text-white mb-4 tracking-tighter italic uppercase">Transcription Lab</h2>
                     <p className="text-slate-400 text-lg font-medium">Fine-tune the timeline of speech modules.</p>
                   </div>
                   <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-12 max-h-[70vh] overflow-y-auto custom-scrollbar shadow-inner">
                      <div className="grid grid-cols-1 gap-2">
                        {(config.words || []).map((word, i) => (
                          <div key={i} className="flex items-center gap-8 p-6 hover:bg-white/5 rounded-[2rem] transition-all border border-transparent hover:border-white/5 group">
                            <div className="text-right shrink-0 text-white">
                                <p className="text-xs font-black text-violet-500 font-mono tracking-widest">{word.start.toFixed(3)}s</p>
                                <p className="text-[10px] text-slate-700 font-black uppercase tracking-tighter">TIMESTAMP</p>
                            </div>
                            <div className="w-[1px] h-10 bg-white/5" />
                            <input 
                              className="flex-1 bg-transparent border-none text-2xl font-black text-white outline-none focus:text-violet-400 transition-colors tracking-tight"
                              value={word.text}
                              onChange={(e) => {
                                const newWords = [...(config.words || [])];
                                newWords[i] = { ...newWords[i], text: e.target.value };
                                setConfig({...config, words: newWords});
                              }}
                            />
                            <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden group-hover:bg-white/10 transition-all">
                                <div className="h-full bg-violet-600 rounded-full" style={{ width: Math.min(100, (word.end - word.start) * 100) + '%' }} />
                            </div>
                          </div>
                        ))}
                      </div>
                   </div>
                 </section>
              )}

              {activeTab === 'raw' && (
                <section>
                   <div className="mb-12">
                     <h2 className="text-5xl font-black text-white mb-4 uppercase italic">Data Stream</h2>
                     <p className="text-slate-400 text-lg font-medium">Raw manifest explorer for direct memory manipulation.</p>
                   </div>
                   <div className="relative group">
                      <div className="absolute top-6 right-8 text-[10px] font-black text-slate-700 tracking-[0.3em] uppercase italic group-hover:text-violet-500 transition-colors">READ ONLY PERSISTENCE</div>
                      <pre className="bg-[#050507] border border-white/5 p-12 rounded-[3.5rem] overflow-x-auto text-sm text-violet-300/60 font-mono leading-relaxed shadow-3xl shadow-black ring-1 ring-white/5">
                        {JSON.stringify(config, null, 2)}
                      </pre>
                   </div>
                 </section>
              )}

              {activeTab === 'settings' && (
                <section>
                  <div className="mb-12">
                    <h2 className="text-5xl font-black text-white mb-4 uppercase tracking-tighter italic">Orchestrator</h2>
                    <p className="text-slate-400 text-lg font-medium">Route compute tasks to specialized AI node clusters.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <AISettingCard 
                        icon={<Zap className="text-blue-400 fill-blue-400" />}
                        name="Luma Dream Machine" 
                        description="4K Neural Temporal Interpolation"
                        active={config.ai_orchestrator?.use_luma}
                        onClick={() => toggleAI('use_luma')}
                     />
                     <AISettingCard 
                        icon={<Cpu className="text-amber-400 fill-amber-400" />}
                        name="Kling Cinema Engine" 
                        description="Ultra-realistic Motion Synthesis"
                        active={config.ai_orchestrator?.use_kling}
                        onClick={() => toggleAI('use_kling')}
                     />
                     <AISettingCard 
                        icon={<Music className="text-pink-400 fill-pink-400" />}
                        name="ElevenLabs Vox 3" 
                        description="Premium Neural Voice Synthesis"
                        active={config.ai_orchestrator?.use_elevenlabs}
                        onClick={() => toggleAI('use_elevenlabs')}
                     />
                      <AISettingCard 
                        icon={<RefreshCw className="text-green-400" />}
                        name="Minimax Low Latency" 
                        description="H-Fi Neural Streaming Preview"
                        active={config.ai_orchestrator?.use_minimax}
                        onClick={() => toggleAI('use_minimax')}
                     />
                  </div>
                </section>
              )}

              {activeTab === 'audio' && (
                <section>
                  <div className="mb-12">
                    <h2 className="text-5xl font-black text-white mb-4 italic tracking-tighter uppercase">Vault</h2>
                    <p className="text-slate-400 text-lg font-medium">Inventory of compiled assets and generated fragments.</p>
                  </div>
                  
                  <h3 className="text-2xl font-black mb-8 flex items-center gap-4 italic">
                    <div className="w-2 h-10 bg-violet-600 rounded-full shadow-2xl shadow-violet-600/50" />
                    Audio Buffer
                  </h3>
                  <div className="grid grid-cols-1 gap-4 mb-16">
                     {assets.audio.length > 0 ? assets.audio.map(file => (
                       <div key={file.name} className="bg-white/[0.03] border border-white/5 rounded-[2rem] p-6 flex items-center justify-between group hover:bg-white/[0.06] transition-all shadow-xl">
                          <div className="flex items-center gap-6">
                             <div className="w-16 h-16 rounded-2xl bg-violet-600/10 flex items-center justify-center text-violet-400 shadow-inner group-hover:bg-violet-600 group-hover:text-white transition-all group-hover:rotate-12">
                               <Music size={28} className="fill-current/20" />
                             </div>
                             <div>
                               <p className="font-black text-xl text-white tracking-tight italic">{file.name}</p>
                               <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.3em]">{file.category}</p>
                             </div>
                          </div>
                          <div className="flex items-center gap-6">
                              <audio controls className="h-10 max-w-[240px] opacity-40 hover:opacity-100 transition-opacity invert brightness-200 contrast-150">
                                  <source src={file.url} type="audio/mpeg" />
                              </audio>
                              <button className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl text-slate-500 hover:text-white transition-all">
                                  <Plus size={20} />
                              </button>
                          </div>
                       </div>
                     )) : (
                       <div className="p-20 text-center border-2 border-dashed border-white/5 rounded-[3rem]">
                          <p className="text-slate-600 font-black italic uppercase tracking-widest text-sm text-white">Vault Empty - Trigger Synthesis to Begin</p>
                       </div>
                     )}
                  </div>

                  <h3 className="text-2xl font-black mb-8 flex items-center gap-4 italic">
                    <div className="w-2 h-10 bg-pink-600 rounded-full shadow-2xl shadow-pink-600/50" />
                    Visual Modules
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                     {assets.images.map(file => (
                       <div key={file.name} className="bg-white/[0.03] border border-white/5 rounded-[2.5rem] p-4 group overflow-hidden hover:bg-white/[0.06] transition-all shadow-xl">
                          <div className="aspect-square rounded-[2rem] bg-black/40 overflow-hidden mb-5 relative shadow-inner ring-1 ring-white/5">
                             <img src={file.url} alt="" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-125 transition-all duration-1000 ease-out grayscale group-hover:grayscale-0" />
                             <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                             <button className="absolute bottom-4 right-4 p-3 bg-white text-black rounded-xl opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all font-black shadow-2xl">
                                <Plus size={16} />
                             </button>
                          </div>
                          <p className="text-[10px] text-slate-500 font-black truncate px-3 uppercase tracking-widest italic">{file.name}</p>
                       </div>
                     ))}
                  </div>
                </section>
              )}

            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-8">
              <div className="relative">
                  <div className="w-24 h-24 rounded-[2rem] bg-violet-600 flex items-center justify-center animate-spin duration-[3s] shadow-3xl shadow-violet-600/40">
                    <RefreshCw className="text-white w-12 h-12" />
                  </div>
                  <div className="absolute inset-0 bg-violet-600 blur-3xl opacity-20 animate-pulse" />
              </div>
              <div className="text-center">
                <p className="text-white font-black uppercase tracking-[0.5em] text-sm animate-pulse">Syncing Streams</p>
                <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest mt-2">Loading Core Architecture...</p>
              </div>
            </div>
          )}
        </main>

        {/* Live Preview Panel (Right Side) */}
        <aside className="w-[450px] border-l border-white/5 bg-black/40 backdrop-blur-3xl h-full flex flex-col shrink-0 overflow-hidden shadow-2xl relative">
           <div className="p-8 border-b border-white/5 flex items-center justify-between bg-black/20">
              <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-3 h-3 rounded-full bg-red-500 animate-ping absolute" />
                    <div className="w-3 h-3 rounded-full bg-red-500 relative shadow-lg shadow-red-500/50" />
                  </div>
                  <h3 className="font-black text-xs tracking-[0.3em] uppercase text-white italic">
                     Real-time Prev
                  </h3>
              </div>
              <div className="flex gap-3">
                 <button onClick={() => setPreviewKey(k => k + 1)} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 transition-all hover:text-white border border-white/5">
                    <RefreshCw size={16} className={cn(saving && "animate-spin")} />
                 </button>
                 <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 transition-all border border-white/5">
                    <Volume2 size={16} />
                 </button>
              </div>
           </div>

           <div className="flex-1 p-8 flex flex-col gap-8 overflow-y-auto custom-scrollbar bg-gradient-to-b from-transparent to-black/40">
              <div className="flex-1 flex flex-col gap-6">
                 <div className="aspect-[9/16] bg-[#000] rounded-[3rem] border border-white/10 overflow-hidden shadow-3xl relative group ring-2 ring-white/5">
                    {config ? (
                        <iframe 
                            key={`${templateId}-${previewKey}`}
                            src={previewUrl}
                            className="w-full h-full border-none"
                            title="Remotion Preview"
                            loading="lazy"
                            allow="autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        />
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center animate-pulse">
                            <Play size={64} className="text-white/10 mb-4" />
                            <p className="text-slate-800 font-black uppercase tracking-widest text-xs">Awaiting Data Sync</p>
                        </div>
                    )}
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <button 
                        onClick={() => window.open('http://localhost:3000', '_blank')}
                        className="flex items-center justify-center gap-3 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest border border-white/5 group shadow-xl"
                    >
                        <ExternalLink size={14} className="group-hover:rotate-12 transition-transform" />
                        Studio External
                    </button>
                    <button className="flex items-center justify-center gap-3 py-4 bg-violet-600/10 text-violet-400 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest border border-violet-500/20 group shadow-xl hover:bg-violet-600 hover:text-white">
                        <Play size={14} fill="currentColor" />
                        Full Playback
                    </button>
                 </div>

                 <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] shadow-inner">
                    <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-2 italic">
                        <Sparkles size={12} className="text-violet-500" /> Session Metadata
                    </h5>
                    <div className="space-y-4">
                       <div className="flex justify-between items-center border-b border-white/5 pb-3">
                          <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest text-white">Active Template</span>
                          <span className="text-[10px] text-violet-400 font-mono font-bold uppercase">{templateId}</span>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </aside>
      </div>
    </div>
  )
}

function SidebarItem({ icon, label, active, onClick }: { icon: ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-4 px-6 py-5 rounded-[1.5rem] transition-all font-black text-[11px] uppercase tracking-[0.2em] relative group overflow-hidden text-white",
        active 
          ? "bg-violet-600 text-white shadow-3xl shadow-violet-600/20 ring-1 ring-white/10 italic" 
          : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
      )}
    >
      <div className={cn("transition-all duration-500", active ? "scale-110 rotate-3 text-white" : "group-hover:translate-x-1 group-hover:text-slate-300")}>
        {icon}
      </div>
      <span className="relative z-10">{label}</span>
      {active && (
        <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-white/20 blur-[1px]" />
      )}
    </button>
  )
}

function StatCard({ label, value, unit, color }: { label: string, value: number | string, unit: string, color: string }) {
  return (
    <div className="bg-white/[0.03] border border-white/5 rounded-[2.5rem] p-10 hover:bg-white/[0.06] transition-all group overflow-hidden relative shadow-inner ring-1 ring-white/5">
      <div className={cn("absolute -right-8 -top-8 w-40 h-40 bg-gradient-to-br opacity-10 blur-[60px]", color)} />
      <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] mb-3 group-hover:text-violet-400 transition-colors italic">{label}</p>
      <div className="flex items-baseline gap-2 relative">
        <span className="text-6xl font-black text-white tracking-tighter italic">{value}</span>
        <span className="text-[10px] text-slate-600 font-black uppercase tracking-widest text-white">{unit}</span>
      </div>
    </div>
  )
}

function PlayerEditCard({ title, data, onChange, assets }: { title: string, data: { name: string, color: string, image?: string }, onChange: (f: string, v: string) => void, assets: Asset[] }) {
  const [showImagePicker, setShowImagePicker] = useState(false);

  return (
    <div className="bg-white/[0.03] border border-white/5 rounded-[3.5rem] p-12 hover:bg-white/[0.06] transition-all group shadow-3xl relative overflow-hidden">
      <h3 className="text-3xl font-black mb-12 text-white flex items-center gap-6 italic tracking-tight uppercase">
        <div className="w-2 h-12 bg-violet-600 rounded-full shadow-2xl shadow-violet-600/40 group-hover:scale-y-110 transition-transform origin-bottom" />
        {title}
      </h3>
      <div className="space-y-12">
        <div className="flex items-center gap-8">
            <div 
                className="w-32 h-32 rounded-3xl bg-black/60 border-2 border-dashed border-white/10 flex items-center justify-center cursor-pointer hover:border-violet-500/50 transition-all relative group/img overflow-hidden shrink-0"
                onClick={() => setShowImagePicker(!showImagePicker)}
            >
                {data.image ? (
                    <img 
                        src={data.image.startsWith('http') ? data.image : `/assets/${data.image.replace(/^\/assets\//, '')}`} 
                        className="w-full h-full object-cover group-hover/img:scale-110 transition-transform" 
                        alt="" 
                    />
                ) : (
                    <ImageIcon size={32} className="text-slate-700" />
                )}
            </div>
            
            <div className="flex-1">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] px-1 mb-3 block italic">Real-world Identity</label>
                <input 
                    className="w-full bg-black/60 border border-white/5 rounded-[1.5rem] px-8 py-6 focus:ring-4 ring-violet-500/10 outline-none transition-all placeholder:text-slate-800 font-black text-2xl text-white focus:border-violet-500/50 shadow-inner tracking-tight"
                    value={data.name}
                    placeholder="Set Handle..."
                    onChange={(e) => onChange('name', e.target.value)}
                />
            </div>
        </div>

        {showImagePicker && (
            <div className="grid grid-cols-4 gap-4 p-4 bg-black/40 rounded-[2rem] border border-white/5">
                {assets.map(a => (
                    <img 
                        key={a.name}
                        src={a.url} 
                        className="w-full aspect-square object-cover rounded-xl cursor-pointer hover:scale-105 transition-transform" 
                        onClick={() => {
                            onChange('image', a.path);
                            setShowImagePicker(false);
                        }}
                    />
                ))}
            </div>
        )}

        <div>
          <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] px-1 mb-3 block italic">Chroma Signature</label>
          <div className="flex gap-4">
            <input 
              type="color"
              className="w-24 h-24 bg-transparent border-none outline-none cursor-pointer rounded-[1.5rem]"
              value={data.color}
              onChange={(e) => onChange('color', e.target.value)}
            />
            <input 
              className="flex-1 bg-black/60 border border-white/5 rounded-[1.5rem] px-8 py-6 font-mono text-sm text-center text-violet-400 font-black select-all tracking-[0.3em] uppercase focus:border-violet-500/50 outline-none shadow-inner"
              value={data.color}
              onChange={(e) => onChange('color', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function InputGroup({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-4 group">
      <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] px-2 block italic group-focus-within:text-violet-500 transition-colors uppercase">{label}</label>
      <textarea 
        className="bg-black/60 border border-white/10 rounded-[2rem] px-10 py-8 focus:ring-8 ring-violet-500/5 outline-none transition-all text-slate-200 font-bold text-2xl leading-relaxed focus:border-violet-500/50 shadow-inner min-h-[160px] resize-none text-white"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}

function AISettingCard({ icon, name, description, active, onClick }: { icon: ReactNode, name: string, description: string, active: boolean | undefined, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex items-center gap-8 p-10 rounded-[3.5rem] border transition-all text-left group relative h-full",
        active 
          ? "bg-violet-600/10 border-violet-500/40" 
          : "bg-white/[0.02] border-white/10 hover:bg-white/[0.04]"
      )}
    >
      <div className={cn(
        "w-20 h-20 rounded-3xl flex items-center justify-center shadow-3xl transition-all duration-700",
        active ? "bg-violet-600 text-white shadow-violet-600/50" : "bg-black/60 text-slate-700"
      )}>
        {icon}
      </div>
      <div className="flex-1 shrink-0 pb-1">
        <h4 className="font-black text-white text-xl leading-tight mb-1 uppercase tracking-tighter italic">{name}</h4>
        <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">{description}</p>
      </div>
      <div className={cn(
        "w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all shrink-0",
        active ? "bg-violet-600 border-violet-500" : "border-white/10"
      )}>
        {active && <div className="w-3 h-3 rounded-full bg-white animate-pulse" />}
      </div>
    </button>
  )
}
