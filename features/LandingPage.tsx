import React from 'react';
import { ActionButton } from '../components/shared';
import { MaterialSymbol } from '../components/icons';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col bg-[#020617] overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[95vh] flex flex-col items-center justify-center text-center px-4 pt-20">
        <div className="absolute inset-0 electric-wireframe opacity-20 pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[600px] bg-indigo-600/5 blur-[150px] rounded-full pointer-events-none"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto space-y-14">
          <div className="inline-flex items-center px-6 py-2 rounded-full bg-slate-950 border border-indigo-500/20 text-indigo-400 text-[10px] font-black tracking-[0.5em] uppercase shadow-2xl animate-fade-in backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-indigo-500 animate-ping mr-4"></span>
            Sovereign Identity Protocol v2.5
          </div>
          
          <div className="space-y-4">
              <h1 className="text-7xl md:text-[10rem] font-black tracking-tighter leading-[0.8] uppercase liquid-chrome">
                Enterprise AI <br />
                for Claims <br />
              </h1>
              <h1 className="text-7xl md:text-[10rem] font-black tracking-tighter leading-[0.8] uppercase text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                Adjudication.
              </h1>
          </div>
          
          <p className="text-slate-400 text-lg md:text-2xl max-w-3xl mx-auto font-medium leading-relaxed tracking-tight">
            Engineering cognitive systems for construction and PropTech. <br className="hidden md:block" />
            Autonomous intelligence for high-concurrency enterprise operations.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-12">
            <ActionButton 
              onClick={() => onNavigate('claims_dashboard')} 
              className="px-16 py-9 text-xl bg-indigo-600 text-white shadow-2xl shadow-indigo-600/30 border-indigo-400/50" 
              icon={<MaterialSymbol icon="dashboard" />}
            >
              Nexus Portal
            </ActionButton>
            <ActionButton 
              variant="secondary"
              onClick={() => onNavigate('contact')} 
              className="px-16 py-9 text-xl border border-white/10 rounded-[2.5rem] bg-white/5 backdrop-blur-md"
              icon={<MaterialSymbol icon="alternate_email" />}
            >
              Contact Us
            </ActionButton>
          </div>
        </div>

        {/* Global Telemetry HUD */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-6xl flex justify-between px-10 opacity-30 hover:opacity-100 transition-opacity duration-1000">
            <div className="text-left space-y-1">
                <span className="block text-[8px] font-black uppercase tracking-[0.5em] text-slate-600">Cognitive Core</span>
                <span className="text-lg font-black text-white font-mono">SOVEREIGN_VX_9</span>
            </div>
            <div className="text-center space-y-1">
                <span className="block text-[8px] font-black uppercase tracking-[0.5em] text-slate-600">Neural Lattice</span>
                <span className="text-lg font-black text-white font-mono">14.2k NODES_LIVE</span>
            </div>
            <div className="text-right space-y-1">
                <span className="block text-[8px] font-black uppercase tracking-[0.5em] text-slate-600">Air Gap Integrity</span>
                <span className="text-lg font-black text-indigo-500 font-mono">100% SECURE</span>
            </div>
        </div>
      </section>

      {/* Doctrine Section */}
      <section className="py-48 border-y border-white/5 bg-[#020617] relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(79,70,229,0.03)_0%,transparent_60%)]"></div>
        <div className="container mx-auto px-8 space-y-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-end">
                <div className="space-y-6">
                    <span className="text-indigo-500 text-[10px] font-black uppercase tracking-[0.6em]">The Sovereign Path</span>
                    <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none uppercase text-left">Enterprise <br /> Claims <br /> Adjudication</h2>
                </div>
                <p className="text-slate-400 text-xl font-medium leading-relaxed max-w-xl pb-2 text-left">
                    Nimbus iQ replaces fragile, human-dependent workflows with autonomous living systems. 
                    Our Nexus infrastructure provides the high-concurrency engine required for modern insurance operations.
                </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10">
                {[
                    { title: 'Agentic SaaS', icon: 'hub', desc: 'Autonomous swarms that navigate operational friction with zero oversight.' },
                    { title: 'RAG Knowledge', icon: 'storage', desc: 'Domain-specific truth vectors grounding your enterprise in technical fact.' },
                    { title: 'MCP Framework', icon: 'settings_input_component', desc: 'The universal connectivity layer for high-concurrency PropTech scale.' },
                    { title: 'Agent Canvas', icon: 'grid_view', desc: 'Real-time orchestration and visualization of multi-agent swarms.', action: 'agent_canvas' }
                ].map((s, i) => (
                    <div 
                        key={i} 
                        onClick={() => s.action && onNavigate(s.action)}
                        className={`bg-slate-900 border border-white/5 rounded-[3.5rem] p-12 space-y-8 hover:border-indigo-500/40 transition-all group relative overflow-hidden ${s.action ? 'cursor-pointer' : ''}`}
                    >
                        <div className="h-16 w-16 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-lg">
                            <MaterialSymbol icon={s.icon} className="text-3xl" />
                        </div>
                        <h3 className="text-3xl font-black text-white tracking-tight uppercase leading-tight text-left">{s.title}</h3>
                        <p className="text-slate-500 text-lg leading-relaxed font-medium text-left">{s.desc}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-60 relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.05)_0%,transparent_80%)]"></div>
        <div className="container mx-auto px-4 text-center relative z-10 space-y-16">
            <h2 className="text-6xl md:text-[9rem] font-black text-white tracking-tighter uppercase max-w-6xl mx-auto leading-none">
                Enterprise <br />
                <span className="text-indigo-500">Adjudication Engine.</span>
            </h2>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-8 pt-8">
                <ActionButton onClick={() => onNavigate('contact')} className="px-16 py-8 text-2xl uppercase border-indigo-500/50" icon={<MaterialSymbol icon="alternate_email" />}>Inquire for Partnership</ActionButton>
                <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.8em] animate-pulse">Or get left behind.</p>
            </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;