import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, 
  Zap, 
  Terminal, 
  CheckCircle, 
  Cpu, 
  Lock,
  Activity,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PageTitle } from '../components/shared';
import { MaterialSymbol } from '../components/icons';
import Markdown from 'react-markdown';

// Mock Data for the Founder's Network
const INVESTOR_CONTACTS = [
  { id: 1, name: "Marc Andreessen", firm: "a16z", status: "Monitor", accuracy: 0.99 },
  { id: 2, name: "Chamath Palihapitiya", firm: "Social Capital", status: "Active", accuracy: 0.95 },
  { id: 3, name: "Dustin Moore", firm: "NimbusIQ", status: "Sovereign", accuracy: 1.0 }
];

interface Log {
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'process' | 'error';
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'error';
}

const IronDomeDashboard: React.FC = () => {
  const [pipelineState, setPipelineState] = useState('idle'); // idle, ingress, reasoning, compliance, egress, success, error
  const [agentLogs, setAgentLogs] = useState<Log[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [brainContent, setBrainContent] = useState<string>('');
  const [isBrainOpen, setIsBrainOpen] = useState(false);
  const [heartbeat, setHeartbeat] = useState<{ status: string; timestamp: string; checks: any[] } | null>(null);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ingestBrain = async () => {
      try {
        const res = await fetch('/api/v1/brain/ingest');
        const data = await res.json();
        if (data.status === 'success') setBrainContent(data.content);
      } catch (e) {
        console.error("Brain ingestion failed");
      }
    };

    const runHeartbeat = async () => {
      try {
        const res = await fetch('/api/v1/brain/heartbeat');
        const data = await res.json();
        setHeartbeat(data);
      } catch (e) {
        console.error("Heartbeat failed");
      }
    };

    ingestBrain();
    runHeartbeat();
    const interval = setInterval(runHeartbeat, 10000);
    return () => clearInterval(interval);
  }, []);

  const addLog = (message: string, type: Log['type'] = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setAgentLogs(prev => [...prev, { timestamp, message, type }]);
  };

  const addNotification = (title: string, message: string, type: Notification['type'] = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [{ id, title, message, type }, ...prev]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  const triggerIronDome = async () => {
    setAgentLogs([]);
    setPipelineState('ingress');
    addLog("PHASE 0: Brain Context Ingestion. Loading Prime Directives from brain.md...", "process");
    await new Promise(r => setTimeout(r, 800));
    addLog("CONTEXT LOADED: Sovereign Operating Model Aligned.", "success");
    addLog("PHASE 1: Ingress Initiated. Scanning Gmail MCP for Adjuster Communications...", "process");
    addNotification("Ingress Started", "Scanning carrier communications...", "info");
    
    try {
      const response = await fetch('/api/v1/trigger-iron-dome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) throw new Error("Compliance Audit Threshold Not Met");
      
      const data = await response.json();
      
      // Simulate UI progression based on backend logs
      for (const log of data.logs) {
        if (log.agent_id === "IngressAgent") {
            await new Promise(r => setTimeout(r, 1000));
            addLog(`Detection: ${log.metadata.carrier} (Claim #${log.metadata.claim_id})`, "success");
            setPipelineState('reasoning');
            addLog("PHASE 2: Reasoning. Initiating Gemini-2.5-Flash Core...", "process");
        } else if (log.agent_id === "ComplianceAgent") {
            await new Promise(r => setTimeout(r, 1500));
            setPipelineState('compliance');
            addLog("PHASE 3: Sovereign Compliance Audit.", "process");
            addLog(`Audit: ${log.action} - ${log.status}`, "success");
        } else if (log.agent_id === "EgressAgent") {
            await new Promise(r => setTimeout(r, 1000));
            setPipelineState('egress');
            addLog("PHASE 4: Egress. Generating Evidence Packet...", "process");
            await new Promise(r => setTimeout(r, 1000));
            addLog(`COMPLETE: Evidence Packet sent to ${log.metadata.recipient}`, "success");
        }
      }
      
      setPipelineState('success');
      addNotification("Sovereign Event", "Claim #8821-X reconciled. QuickBooks sync complete.", "success");
      
    } catch (error: any) {
      setPipelineState('error');
      addLog(`CRITICAL ERROR: ${error.message}`, "error");
      addNotification("Pipeline Failure", error.message, "error");
    }
  };

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [agentLogs]);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans selection:bg-indigo-500/30 p-8">
      {/* Toast System */}
      <div className="fixed top-24 right-6 z-50 flex flex-col gap-3">
        <AnimatePresence>
          {notifications.map(n => (
            <motion.div 
              key={n.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
              className={`p-4 rounded-2xl border shadow-2xl bg-slate-900/90 backdrop-blur-md min-w-[280px] ${
                n.type === 'success' ? 'border-emerald-500/50 text-emerald-400' : 
                n.type === 'error' ? 'border-rose-500/50 text-rose-400' :
                'border-indigo-500/50 text-indigo-400'
              }`}
            >
              <div className="font-bold flex items-center gap-2">
                {n.type === 'success' ? <CheckCircle size={16} /> : <Zap size={16} />}
                {n.title}
              </div>
              <div className="text-xs opacity-80 mt-1">{n.message}</div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Brain Overlay */}
      <AnimatePresence>
        {isBrainOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#020617]/90 backdrop-blur-3xl p-8 overflow-y-auto custom-scrollbar"
          >
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-12">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 text-indigo-400">
                    <Lock size={24} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Prime Directives</h2>
                    <p className="text-xs font-black text-indigo-500 uppercase tracking-widest">Sovereign OS Context Ingestion</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsBrainOpen(false)}
                  className="p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
                >
                  <MaterialSymbol icon="close" />
                </button>
              </div>
              <div className="prose prose-invert prose-slate max-w-none">
                <div className="p-10 bg-slate-900/50 border border-white/5 rounded-[3rem] text-slate-300 font-medium leading-relaxed">
                  <Markdown>{brainContent}</Markdown>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex justify-between items-end">
          <PageTitle 
            title="Iron Dome" 
            subtitle="Autonomous Sovereign Defense & Claims Orchestration" 
          />
          <div className="flex items-center gap-4 mb-10">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/50 rounded-full border border-white/5 backdrop-blur-sm">
              <div className={`w-2 h-2 rounded-full ${pipelineState === 'error' ? 'bg-rose-500' : 'bg-emerald-500'} animate-pulse`} />
              <span className={`text-[10px] uppercase font-black tracking-widest ${pipelineState === 'error' ? 'text-rose-500' : 'text-emerald-500'}`}>
                {pipelineState === 'error' ? 'System Compromised' : 'Sovereign OS Active'}
              </span>
            </div>
          </div>
        </div>

        {/* KPI HUD */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-slate-900/40 border border-white/5 p-6 rounded-[2rem] relative overflow-hidden group backdrop-blur-xl cursor-pointer" onClick={() => setIsBrainOpen(true)}>
            <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity text-white`}>
              <Lock size={64} />
            </div>
            <p className="text-[10px] font-black uppercase text-indigo-400 mb-2 tracking-widest">Sovereign Directives</p>
            <p className="text-xl font-black text-white tracking-tight">brain.md INGESTED</p>
            <div className="flex items-center gap-2 mt-4 text-[9px] font-mono text-slate-500">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
              Gemma Robotics IQ Master Identity Active
            </div>
          </div>
          {[
            { label: "Trust Threshold", value: "99.8%", icon: Shield, color: "emerald" },
            { label: "Time-to-Revenue", value: "4.2h", icon: Activity, color: "amber" },
            { label: "Sovereign Nodes", value: "312", icon: Cpu, color: "purple" }
          ].map((kpi, i) => (
            <div key={i} className="bg-slate-900/40 border border-white/5 p-6 rounded-[2rem] relative overflow-hidden group backdrop-blur-xl">
              <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity text-white`}>
                <kpi.icon size={64} />
              </div>
              <p className="text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">{kpi.label}</p>
              <p className="text-3xl font-black text-white tracking-tight">{kpi.value}</p>
              <div className="h-1 w-full bg-white/5 mt-4 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '70%' }}
                  transition={{ duration: 1, delay: i * 0.1 }}
                  className="h-full bg-indigo-500" 
                />
              </div>
            </div>
          ))}
        </div>

        {/* Core Operation Block */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Agent Log Console */}
          <div className="lg:col-span-2 bg-slate-900/40 border border-white/5 rounded-[2.5rem] flex flex-col h-[600px] shadow-2xl backdrop-blur-xl overflow-hidden">
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-3">
                <Terminal size={20} className="text-indigo-400" />
                <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Autonomous Reasoning Feed</h3>
              </div>
              <div className="flex gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
                <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
                <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-3 font-mono text-[11px] custom-scrollbar">
              {agentLogs.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-50 space-y-4">
                  <Terminal size={48} />
                  <p className="uppercase tracking-[0.3em] text-[10px] font-black">Awaiting Sovereign Instruction...</p>
                </div>
              )}
              {agentLogs.map((log, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-4 rounded-2xl border flex gap-4 ${
                    log.type === 'success' ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' :
                    log.type === 'process' ? 'bg-indigo-500/5 border-indigo-500/20 text-indigo-400' :
                    log.type === 'error' ? 'bg-rose-500/5 border-rose-500/20 text-rose-400' :
                    'bg-slate-800/30 border-white/5 text-slate-400'
                  }`}
                >
                  <span className="opacity-40 shrink-0 font-black">[{log.timestamp}]</span>
                  <span className="font-medium">{log.message}</span>
                </motion.div>
              ))}
              <div ref={logEndRef} />
            </div>
            <div className="p-6 bg-white/5 border-t border-white/5">
              <button 
                onClick={triggerIronDome}
                disabled={['ingress', 'reasoning', 'compliance', 'egress'].includes(pipelineState)}
                className={`w-full py-5 rounded-[1.5rem] font-black uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-3 transition-all active:scale-[0.98] ${
                  !['ingress', 'reasoning', 'compliance', 'egress'].includes(pipelineState)
                    ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-xl shadow-indigo-500/20' 
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                {!['ingress', 'reasoning', 'compliance', 'egress'].includes(pipelineState) ? (
                  <><Zap size={18} /> Deploy Iron Dome Protocol</>
                ) : (
                  <><Activity className="animate-spin" size={18} /> Processing Logic...</>
                )}
              </button>
            </div>
          </div>

          {/* Pipeline Status & Health */}
          <div className="space-y-6">
            <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 space-y-8 backdrop-blur-xl">
              <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-4">Pipeline Health</h3>
              {[
                { label: 'Ingress (Drive/Gmail)', state: 'ingress' },
                { label: 'Reasoning (Vertex AI)', state: 'reasoning' },
                { label: 'Compliance Audit', state: 'compliance' },
                { label: 'Egress (Financials)', state: 'egress' }
              ].map((step, i) => {
                const stepOrder = ['ingress', 'reasoning', 'compliance', 'egress'];
                const currentIndex = stepOrder.indexOf(pipelineState);
                const stepIndex = stepOrder.indexOf(step.state);
                
                const isActive = pipelineState === step.state;
                const isComplete = (currentIndex > stepIndex && pipelineState !== 'error') || pipelineState === 'success';
                const isError = pipelineState === 'error' && currentIndex <= stepIndex;
                
                return (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border transition-all duration-500 ${
                        isComplete ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-500' :
                        isActive ? 'bg-indigo-500/10 border-indigo-500 text-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.3)]' :
                        isError ? 'border-rose-500/50 text-rose-500 bg-rose-500/10' :
                        'bg-slate-800/50 border-white/5 text-slate-600'
                      }`}>
                        {isComplete ? <CheckCircle size={16} /> : <span className="text-xs font-black">{i + 1}</span>}
                      </div>
                      <span className={`text-xs font-black uppercase tracking-widest ${isActive ? 'text-white' : isComplete ? 'text-slate-400' : 'text-slate-600'}`}>{step.label}</span>
                    </div>
                    {isActive && <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity }}><Zap size={14} className="text-indigo-500" /></motion.div>}
                  </div>
                );
              })}
            </div>

            {/* Sovereign Network Widget */}
            <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-xl">
              <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-6 flex items-center justify-between">
                TCM Heartbeat
                <span className={`text-[9px] font-mono animate-pulse ${heartbeat?.status === 'active' ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {heartbeat?.status === 'active' ? 'SPINE_LOCKED' : 'SPINE_ERROR'}
                </span>
              </h3>
              <div className="space-y-3">
                {heartbeat?.checks.map((check, i) => (
                  <div key={i} className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                    <span className="text-[9px] font-black text-slate-500 tracking-widest uppercase">{check.name}</span>
                    <span className={`text-[9px] font-mono ${check.status === 'SECURE' || check.status === 'PASSED' || check.status === 'ALIGNED' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {check.status}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex items-center justify-center gap-2 text-[8px] font-mono text-slate-600">
                <Activity size={10} />
                LAST_BEAT: {heartbeat ? new Date(heartbeat.timestamp).toLocaleTimeString() : '...'}
              </div>
            </div>

            <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-xl">
              <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-6 flex items-center justify-between">
                Sovereign Network
                <span className="text-emerald-500 text-[9px] font-mono animate-pulse">3 NODES_ONLINE</span>
              </h3>
              <div className="space-y-4">
                {INVESTOR_CONTACTS.map(contact => (
                  <div key={contact.id} className="flex items-center justify-between group cursor-pointer p-3 rounded-2xl hover:bg-white/5 transition-all border border-transparent hover:border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 border border-white/5 flex items-center justify-center text-xs font-black text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                        {contact.name[0]}
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-300 group-hover:text-white transition-colors">{contact.name}</p>
                        <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">{contact.firm}</p>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${contact.status === 'Sovereign' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-slate-800 text-slate-600'}`}>
                      {contact.status}
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-8 py-3 border border-white/5 text-slate-500 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] hover:bg-white/5 hover:text-white transition-all">
                Sync Global Network
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.1);
        }
      `}</style>
    </div>
  );
};

export default IronDomeDashboard;
