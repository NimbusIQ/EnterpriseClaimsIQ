import React from 'react';
import { motion } from 'motion/react';
import { 
  Database, 
  ArrowRight, 
  Layers, 
  PieChart, 
  User, 
  Users, 
  Activity, 
  Zap,
  Globe,
  Settings,
  Cpu,
  Layout
} from 'lucide-react';
import { PageTitle } from '../components/shared';

const FDEBlueprint: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 p-8 font-sans selection:bg-indigo-500/30">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="flex justify-between items-end">
          <PageTitle 
            title="FDE Blueprint" 
            subtitle="Forward Deployed Engineering Model & Data Pipeline" 
          />
          <div className="px-4 py-2 bg-indigo-500/10 rounded-full border border-indigo-500/20 mb-10">
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Strategic Alignment v1.0</span>
          </div>
        </div>

        {/* Conceptual Diagram Stage */}
        <div className="bg-slate-900/40 border border-white/5 rounded-[3rem] p-12 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <Zap size={200} className="text-indigo-500" />
          </div>

          <div className="relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Data Ingestion (Sources) */}
              <div className="lg:col-span-3 space-y-6">
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                    <Database size={32} />
                  </div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-white">Data Ingestion</h3>
                </div>
                
                <div className="space-y-4">
                  {[
                    { label: "Internal CRM/ERP", icon: Globe },
                    { label: "API Integrations", icon: Zap },
                    { label: "Flat Files (CSV/JSON)", icon: Settings }
                  ].map((source, i) => (
                    <motion.div 
                      key={source.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-white/5 border border-white/5 p-4 rounded-2xl flex items-center gap-4 hover:border-emerald-500/30 transition-all group"
                    >
                      <source.icon size={18} className="text-emerald-500/50 group-hover:text-emerald-500" />
                      <span className="text-[11px] font-bold text-slate-400 group-hover:text-white">{source.label}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* The Stack (The Engine) */}
              <div className="lg:col-span-1 flex justify-center text-slate-700">
                <ArrowRight size={32} className="hidden lg:block" />
              </div>

              <div className="lg:col-span-4 space-y-6">
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500">
                    <Layers size={32} />
                  </div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-white">The Software Stack</h3>
                </div>

                <div className="p-8 bg-indigo-500/5 border border-indigo-500/20 rounded-[2.5rem] space-y-8 relative shadow-2xl">
                  {[
                    { label: "ETL/ELT Layer", desc: "Extraction & Cleaning" },
                    { label: "Data Warehouse", desc: "Storage (Snowflake/S3)" },
                    { label: "Gemma Engine", desc: "AI Processing Control" }
                  ].map((layer, i) => (
                    <motion.div 
                      key={layer.label}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + (i * 0.1) }}
                      className="bg-slate-900 border border-white/5 p-5 rounded-3xl relative"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">{layer.label}</p>
                          <p className="text-[9px] font-bold text-slate-500 mt-1">{layer.desc}</p>
                        </div>
                        <Cpu size={16} className="text-slate-800" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Outputs (Client Visuals) */}
              <div className="lg:col-span-1 flex justify-center text-slate-700">
                <ArrowRight size={32} className="hidden lg:block" />
              </div>

              <div className="lg:col-span-3 space-y-6">
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                    <PieChart size={32} />
                  </div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-white">Client Outputs</h3>
                </div>

                <div className="space-y-4">
                  {[
                    { label: "Interactive Dashboards", icon: Layout },
                    { label: "Concept Mind Maps", icon: Activity },
                    { label: "Predictive Visuals", icon: Zap }
                  ].map((output, i) => (
                    <motion.div 
                      key={output.label}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + (i * 0.1) }}
                      className="bg-amber-500/5 border border-amber-500/10 p-4 rounded-2xl flex items-center gap-4 hover:border-amber-500/30 transition-all group"
                    >
                      <output.icon size={18} className="text-amber-500/50 group-hover:text-amber-500" />
                      <span className="text-[11px] font-bold text-slate-400 group-hover:text-white">{output.label}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* FDE & Client Interaction Overlay */}
            <div className="mt-16 flex flex-col md:flex-row justify-between items-center gap-12 border-t border-white/5 pt-16">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="bg-indigo-600 p-8 rounded-[2rem] flex items-center gap-6 shadow-2xl shadow-indigo-600/20"
              >
                <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
                  <User size={32} className="text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-white uppercase tracking-tighter">Forward Deployed Engineer</h4>
                  <p className="text-[10px] font-bold text-indigo-100 uppercase tracking-widest opacity-70 mt-1">Design • Implement • Manage • Optimize</p>
                </div>
              </motion.div>

              <div className="flex-1 flex justify-center px-12">
                <div className="w-full h-px bg-gradient-to-r from-indigo-500 via-white/20 to-rose-500 relative">
                  <div className="absolute -top-3 left-1/4 px-4 bg-slate-900 border border-white/10 rounded-full py-1 text-[8px] font-black uppercase tracking-widest">Requirements</div>
                  <div className="absolute -bottom-3 right-1/4 px-4 bg-slate-900 border border-white/10 rounded-full py-1 text-[8px] font-black uppercase tracking-widest">Value & Insights</div>
                </div>
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="bg-rose-600/20 border border-rose-500/30 p-8 rounded-[2rem] flex items-center gap-6"
              >
                <div className="w-16 h-16 rounded-2xl bg-rose-500/10 flex items-center justify-center">
                  <Users size={32} className="text-rose-500" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-white uppercase tracking-tighter">Client Stakeholder</h4>
                  <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest opacity-70 mt-1">Needs • Strategy • Decision Making</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Breakdown & Context */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <h2 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-4">
              <span className="w-12 h-1 bg-indigo-500" />
              Role of the FDE
            </h2>
            <div className="p-8 bg-white/5 border border-white/5 rounded-[2.5rem] space-y-6">
              <p className="text-sm leading-relaxed text-slate-400">
                The Forward Deployed Engineer (FDE) is the specialized interface between core engineering and the client's unique environment. They work backward from required visualizations to architect the ingestion stack.
              </p>
              <ul className="grid grid-cols-2 gap-4">
                {[
                  "Contextual Design",
                  "Stack Implementation",
                  "Security Configuration",
                  "Performance Tuning"
                ].map(item => (
                  <li key={item} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white">
                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-8">
            <h2 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-4">
              <span className="w-12 h-1 bg-rose-500" />
              Strategic Revenue Model
            </h2>
            <div className="grid grid-cols-1 gap-6">
              {[
                { label: "Strategic Retainer", desc: "Long-term FDE engagement for Tier-1 Enterprise accounts.", price: "$250k+" },
                { label: "Project Blueprint", desc: "Fixed-outcome data infrastructure deployment.", price: "$50k - $150k" }
              ].map((tier, i) => (
                <div key={i} className="p-6 bg-slate-900 border border-white/5 rounded-3xl flex justify-between items-center group hover:bg-white/5 transition-all">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-white">{tier.label}</h4>
                    <p className="text-[10px] text-slate-500 mt-1">{tier.desc}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-white">{tier.price}</p>
                    <p className="text-[8px] font-bold text-slate-600 uppercase">Target ACV</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Logo Accents */}
        <div className="flex justify-center pt-8 border-t border-white/5">
          <div className="flex items-center gap-3 text-slate-700 select-none">
            <Zap size={24} />
            <span className="text-[10px] font-black tracking-[0.5em] uppercase">Nimbus IQ Blueprint System</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FDEBlueprint;
