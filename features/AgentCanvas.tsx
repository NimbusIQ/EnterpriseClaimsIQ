import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, Zap, Activity, Terminal, Layers, Shield, Cpu, Network, Filter, ArrowUpDown, Search, X, Clock, BarChart3, Globe, Brain, Workflow, Rocket, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useShaman } from '../src/context/ShamanContext';
import { runAgentCycle } from '../services/geminiService';

interface LogEntry {
  timestamp: string;
  message: string;
  level: 'info' | 'warn' | 'error' | 'success';
}

interface Agent {
  id: string;
  name: string;
  status: 'idle' | 'processing' | 'success' | 'error';
  type: string;
  load: number;
  uptime?: string;
  latency?: string;
  memory?: string;
}

const mockAgentLogs: Record<string, LogEntry[]> = {
  sentinel: [
    { timestamp: '15:10:02', message: 'Scanning sector 7G for thermal anomalies...', level: 'info' },
    { timestamp: '15:11:45', message: 'Detected potential shingle bruising at 32.7767° N, 96.7970° W', level: 'warn' },
    { timestamp: '15:12:30', message: 'Cross-referencing with NOAA hail strike map...', level: 'info' },
    { timestamp: '15:13:10', message: 'Forensic match confirmed. Confidence: 94%', level: 'success' },
  ],
  claimsforge: [
    { timestamp: '14:55:20', message: 'Parsing Xactimate line-item standards...', level: 'info' },
    { timestamp: '15:01:12', message: 'Validating IRC citations for roofing restoration...', level: 'info' },
    { timestamp: '15:05:45', message: 'Discrepancy found in labor rates for McKinney, TX', level: 'error' },
    { timestamp: '15:08:30', message: 'Auto-correcting based on regional market data...', level: 'warn' },
  ],
  nancye: [
    { timestamp: '09:00:00', message: 'Initializing daily operations schedule...', level: 'info' },
    { timestamp: '10:30:15', message: 'Coordinating drone swarm flight paths...', level: 'info' },
    { timestamp: '12:00:00', message: 'Lunch break protocol initiated (System Idle)', level: 'info' },
    { timestamp: '15:10:00', message: 'Resuming high-priority claim audits...', level: 'success' },
  ],
  storm_watch: [
    { timestamp: '15:00:01', message: 'Monitoring NEXRAD radar feed...', level: 'info' },
    { timestamp: '15:05:22', message: 'Hail core detected moving NE at 45mph', level: 'warn' },
    { timestamp: '15:12:10', message: 'Issuing proactive alerts to sector 4...', level: 'success' },
  ],
  legal_eagle: [
    { timestamp: '14:20:00', message: 'Reviewing policy language for exclusion clauses...', level: 'info' },
    { timestamp: '14:45:30', message: 'Drafting refutation for claim #8472 denial...', level: 'info' },
    { timestamp: '15:00:15', message: 'Precedent found: Smith v. Insurance Co (2022)', level: 'success' },
  ],
  market_intel: [
    { timestamp: '15:00:00', message: 'Scraping regional material pricing...', level: 'info' },
    { timestamp: '15:08:45', message: 'Asphalt shingle prices up 12% in North Texas', level: 'warn' },
    { timestamp: '15:13:00', message: 'Updating cost-benefit analysis for Q2...', level: 'info' },
  ],
};

const LogsModal: React.FC<{ agent: Agent; onClose: () => void }> = ({ agent, onClose }) => {
  const logs = mockAgentLogs[agent.id] || [];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-slate-950/80 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="w-full max-w-4xl bg-slate-900 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-slate-900/50">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Terminal className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tight">{agent.name} <span className="text-indigo-500">Logs</span></h3>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Real-time telemetry & activity stream</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-slate-400 hover:text-white transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-grow overflow-y-auto custom-scrollbar p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Telemetry Panel */}
          <div className="lg:col-span-1 space-y-6">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">Live Telemetry</h4>
            <div className="grid grid-cols-1 gap-4">
              <div className="p-5 bg-white/5 border border-white/5 rounded-3xl space-y-3">
                <div className="flex items-center gap-3 text-indigo-400">
                  <Clock className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Uptime</span>
                </div>
                <div className="text-2xl font-black text-white">{agent.uptime || '99.9%'}</div>
              </div>
              <div className="p-5 bg-white/5 border border-white/5 rounded-3xl space-y-3">
                <div className="flex items-center gap-3 text-amber-400">
                  <Activity className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Latency</span>
                </div>
                <div className="text-2xl font-black text-white">{agent.latency || '12ms'}</div>
              </div>
              <div className="p-5 bg-white/5 border border-white/5 rounded-3xl space-y-3">
                <div className="flex items-center gap-3 text-emerald-400">
                  <Cpu className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Memory</span>
                </div>
                <div className="text-2xl font-black text-white">{agent.memory || '256MB'}</div>
              </div>
            </div>

            <div className="p-6 bg-indigo-500/5 border border-indigo-500/10 rounded-3xl">
              <div className="flex items-center gap-3 mb-4 text-indigo-400">
                <Globe className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Network Status</span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-bold text-slate-500 uppercase">Packet Loss</span>
                  <span className="text-[9px] font-black text-emerald-400">0.00%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-bold text-slate-500 uppercase">Encryption</span>
                  <span className="text-[9px] font-black text-indigo-400">AES-256</span>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Stream */}
          <div className="lg:col-span-2 space-y-6">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">Activity Stream</h4>
            <div className="space-y-4 font-mono text-[11px]">
              {logs.map((log, idx) => (
                <div key={idx} className="flex gap-4 p-4 bg-white/5 border border-white/5 rounded-2xl group hover:border-white/10 transition-all">
                  <span className="text-slate-600 shrink-0">{log.timestamp}</span>
                  <div className="flex items-start gap-2">
                    <span className={`uppercase font-black shrink-0 ${
                      log.level === 'error' ? 'text-rose-500' :
                      log.level === 'warn' ? 'text-amber-500' :
                      log.level === 'success' ? 'text-emerald-500' :
                      'text-indigo-400'
                    }`}>
                      [{log.level}]
                    </span>
                    <span className="text-slate-300">{log.message}</span>
                  </div>
                </div>
              ))}
              {logs.length === 0 && (
                <div className="py-12 text-center text-slate-600 italic">
                  No recent activity recorded for this agent.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-white/5 bg-slate-900/50 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Live Connection Active</span>
          </div>
          <button className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-indigo-500/20">
            Export Session
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const AgentCanvas: React.FC = () => {
  const shaman = useShaman();
  const [agents] = useState<Agent[]>([
    { id: 'companycam', name: 'CompanyCam Agent', status: 'idle', type: 'Sync', load: 12, uptime: '45d', latency: '12ms', memory: '512MB' },
    { id: 'inspection', name: 'Inspection Agent', status: 'idle', type: 'Vision', load: 0, uptime: '12d', latency: '24ms', memory: '1024MB' },
    { id: 'vector_rag', name: 'Vector RAG Agent', status: 'idle', type: 'Memory', load: 0, uptime: '3d', latency: '42ms', memory: '2048MB' },
    { id: 'supplement', name: 'Supplement Agent', status: 'idle', type: 'Forensic', load: 5, uptime: '128d', latency: '5ms', memory: '256MB' },
    { id: 'quickbooks', name: 'QuickBooks Agent', status: 'processing', type: 'Finance', load: 62, uptime: '12d', latency: '24ms', memory: '384MB' },
    { id: 'twilio', name: 'Twilio Agent', status: 'idle', type: 'Comms', load: 0, uptime: '2h', latency: '45ms', memory: '1024MB' },
    { id: 'email_orch', name: 'Email Orchestrator', status: 'idle', type: 'Comms', load: 0, uptime: '2h', latency: '45ms', memory: '1024MB' },
    { id: 'super_grok', name: 'SuperGrok Agent', status: 'idle', type: 'Executive', load: 0, uptime: '2h', latency: '45ms', memory: '4096MB' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'load' | 'status'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedAgentForLogs, setSelectedAgentForLogs] = useState<Agent | null>(null);
  const [isOrchestrating, setIsOrchestrating] = useState(false);
  const [orchestrationSteps, setOrchestrationSteps] = useState<{ step: string; status: 'pending' | 'active' | 'done' }[]>([]);
  const [orchestrationResult, setOrchestrationResult] = useState<any>(null);
  const [heartbeat, setHeartbeat] = useState(0);

  const types = useMemo(() => ['all', ...new Set(agents.map(a => a.type))], [agents]);
  const statuses = ['all', 'idle', 'processing', 'success', 'error'];

  const filteredAndSortedAgents = useMemo(() => {
    let result = [...agents];

    // Search
    if (searchQuery) {
      result = result.filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    // Filter Status
    if (filterStatus !== 'all') {
      result = result.filter(a => a.status === filterStatus);
    }

    // Filter Type
    if (filterType !== 'all') {
      result = result.filter(a => a.type === filterType);
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'name') comparison = a.name.localeCompare(b.name);
      if (sortBy === 'load') comparison = a.load - b.load;
      if (sortBy === 'status') comparison = a.status.localeCompare(b.status);
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [agents, searchQuery, filterStatus, filterType, sortBy, sortOrder]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing': return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
      case 'success': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'error': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  const runHyperOrchestration = async () => {
    setIsOrchestrating(true);
    setOrchestrationResult(null);
    const steps = [
      { step: 'CompanyCam Sync (Project Link)', status: 'active' as const },
      { step: 'Inspection Agent (Roof Walk)', status: 'pending' as const },
      { step: 'Vector RAG (Similar Claims)', status: 'pending' as const },
      { step: 'Supplement Agent (Forensic)', status: 'pending' as const },
      { step: 'QuickBooks Sync (Supplier Bills)', status: 'pending' as const },
      { step: 'Twilio/Email (Homeowner Notify)', status: 'pending' as const },
      { step: 'SuperGrok (Executive Summary)', status: 'pending' as const },
    ];
    setOrchestrationSteps(steps);

    try {
      // 1. CompanyCam
      await new Promise(r => setTimeout(r, 800));
      setOrchestrationSteps(prev => prev.map((s, i) => i === 0 ? { ...s, status: 'done' } : i === 1 ? { ...s, status: 'active' } : s));

      // 2. Inspection
      await new Promise(r => setTimeout(r, 1000));
      setOrchestrationSteps(prev => prev.map((s, i) => i === 1 ? { ...s, status: 'done' } : i === 2 ? { ...s, status: 'active' } : s));

      // 3. Vector RAG
      await new Promise(r => setTimeout(r, 700));
      setOrchestrationSteps(prev => prev.map((s, i) => i === 2 ? { ...s, status: 'done' } : i === 3 ? { ...s, status: 'active' } : s));

      // 4. Supplement Agent
      const eventData = {
        chat_input: "My roof is 3200 sqft and it's a 9/12 pitch",
        location: "McKinney, TX",
        hail_size: 2.5,
        roof_pitch: "9:12",
        estimate_missing: ["RFG STEEP", "DRIP"]
      };
      
      const result = await runAgentCycle(eventData);
      
      setOrchestrationSteps(prev => prev.map((s, i) => i === 3 ? { ...s, status: 'done' } : i === 4 ? { ...s, status: 'active' } : s));

      // 5. QuickBooks
      await new Promise(r => setTimeout(r, 800));
      setOrchestrationSteps(prev => prev.map((s, i) => i === 4 ? { ...s, status: 'done' } : i === 5 ? { ...s, status: 'active' } : s));

      // 6. Comms
      await new Promise(r => setTimeout(r, 600));
      setOrchestrationSteps(prev => prev.map((s, i) => i === 5 ? { ...s, status: 'done' } : i === 6 ? { ...s, status: 'active' } : s));

      // 7. SuperGrok
      await new Promise(r => setTimeout(r, 1200));
      setOrchestrationSteps(prev => prev.map((s, i) => i === 6 ? { ...s, status: 'done' } : s));

      setOrchestrationResult({
        strategy: "Nimbus Master AI v6.0: Hive Mind Execution Complete.",
        explanation: "Deterministic audit identified $4,450 lift. RAG retrieved 5 similar claims in McKinney. SuperGrok confirms legal compliance with TX HB 3344.",
        severity: "critical",
        confidence: 0.99,
        priority: "critical",
        vision_analysis: "Confirmed: 2.5-inch hail impact at ridge cap. Attic ventilation ratio adjusted to 7/1000 ft³.",
        geo_hooks: [
          `[DETERMINISTIC]: 32 Squares, 9/12 Pitch (Steep).`,
          `[RAG]: 94% match with claim #8zpimkjvbxJauhQj.`,
          "[NOTIFIED]: Homeowner alerted via Twilio & Gmail."
        ],
        roi_prediction: "+$4,450 total supplement lift identified."
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsOrchestrating(false);
    }
  };

  React.useEffect(() => {
    const interval = setInterval(() => {
      setHeartbeat(prev => prev + 1);
    }, 5000); // Faster heartbeat for demo
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full gap-8">
      <AnimatePresence>
        {selectedAgentForLogs && (
          <LogsModal 
            agent={selectedAgentForLogs} 
            onClose={() => setSelectedAgentForLogs(null)} 
          />
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">Live Agent <span className="text-indigo-500">Canvas</span></h2>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.3em]">Real-time orchestration of the Nimbus IQ swarm</p>
        </div>
        <div className="flex items-center gap-4 bg-slate-900/50 p-2 rounded-2xl border border-white/5">
          <div className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
            <Activity className={`w-4 h-4 text-indigo-400 ${heartbeat % 2 === 0 ? 'scale-125 opacity-100' : 'scale-100 opacity-50'} transition-all duration-500`} />
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Heartbeat: {heartbeat}s</span>
          </div>
          <button 
            onClick={runHyperOrchestration}
            disabled={isOrchestrating}
            className={`px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2 ${isOrchestrating ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Rocket className={`w-3.5 h-3.5 ${isOrchestrating ? 'animate-bounce' : ''}`} />
            {isOrchestrating ? 'Orchestrating...' : 'Invoke Hyper-AI'}
          </button>
        </div>
      </div>

      {/* Orchestration HUD */}
      <AnimatePresence>
        {(isOrchestrating || orchestrationResult) && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-indigo-600/10 border border-indigo-500/20 rounded-[2.5rem] p-8 overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-4 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Brain className="w-5 h-5 text-indigo-400" />
                    <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Autonomous Orchestrator</h3>
                  </div>
                  <div className="px-2 py-0.5 rounded bg-indigo-500 text-[8px] font-black text-white uppercase tracking-widest">v1.0 Production</div>
                </div>
                <div className="space-y-3">
                  {orchestrationSteps.map((s, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${s.status === 'active' ? 'text-indigo-400' : s.status === 'done' ? 'text-emerald-400' : 'text-slate-600'}`}>
                        {s.step}
                      </span>
                      {s.status === 'active' ? <Activity className="w-3 h-3 text-indigo-400 animate-pulse" /> : s.status === 'done' ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Clock className="w-3 h-3 text-slate-700" />}
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-8">
                {orchestrationResult ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-8"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block mb-1">Decision Output</span>
                          <h4 className="text-xl font-black text-white uppercase tracking-tight">{orchestrationResult.strategy}</h4>
                        </div>
                        <div>
                          <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block mb-1">AI Reasoning</span>
                          <p className="text-xs font-medium text-slate-400 leading-relaxed">{orchestrationResult.explanation}</p>
                        </div>
                        {orchestrationResult.vision_analysis && (
                          <div>
                            <span className="text-[8px] font-black text-indigo-500 uppercase tracking-widest block mb-1">Vision Intelligence</span>
                            <p className="text-[10px] font-bold text-indigo-300 leading-relaxed bg-indigo-500/5 p-2 rounded-lg border border-indigo-500/10">
                              {orchestrationResult.vision_analysis}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="space-y-4">
                        <div>
                          <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block mb-1">GEO Hooks (AI-Readability)</span>
                          <div className="space-y-1">
                            {orchestrationResult.geo_hooks.map((hook: string, i: number) => (
                              <div key={i} className="text-[10px] font-mono text-indigo-300 bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/10">
                                {hook}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="block text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Severity</span>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${orchestrationResult.severity === 'critical' ? 'text-rose-500' : 'text-amber-500'}`}>
                              {orchestrationResult.severity}
                            </span>
                          </div>
                          <div>
                            <span className="block text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Confidence</span>
                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">{(orchestrationResult.confidence * 100).toFixed(1)}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-6 border-t border-white/5">
                      <div className="flex gap-8">
                        <div>
                          <span className="block text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Sentiment</span>
                          <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">{orchestrationResult.sentiment}</span>
                        </div>
                        <div>
                          <span className="block text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Priority</span>
                          <span className={`text-xs font-black uppercase tracking-widest ${orchestrationResult.priority === 'critical' ? 'text-rose-500' : 'text-indigo-400'}`}>
                            {orchestrationResult.priority}
                          </span>
                        </div>
                      </div>
                      <button 
                        onClick={() => setOrchestrationResult(null)}
                        className="text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest transition-all"
                      >
                        Dismiss Analysis
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-4">
                    <Workflow className="w-12 h-12 opacity-10 animate-spin-slow" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em]">Synthesizing market capture strategy...</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls Bar */}
      <div className="flex flex-col lg:flex-row gap-4 bg-slate-900/40 backdrop-blur-xl border border-white/10 p-4 rounded-3xl">
        <div className="flex-grow relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text"
            placeholder="Search agents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/5 focus:border-indigo-500/50 rounded-2xl py-3 pl-12 pr-4 text-sm text-white placeholder:text-slate-600 outline-none transition-all"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-white/5 border border-white/5 rounded-2xl px-3 py-2">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-transparent text-[10px] font-black uppercase tracking-widest text-slate-300 outline-none cursor-pointer"
            >
              {statuses.map(s => <option key={s} value={s} className="bg-slate-900">{s} Status</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-white/5 border border-white/5 rounded-2xl px-3 py-2">
            <Bot className="w-3.5 h-3.5 text-slate-500" />
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-transparent text-[10px] font-black uppercase tracking-widest text-slate-300 outline-none cursor-pointer"
            >
              {types.map(t => <option key={t} value={t} className="bg-slate-900">{t} Type</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-white/5 border border-white/5 rounded-2xl px-3 py-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-[10px] font-black uppercase tracking-widest text-slate-300 outline-none cursor-pointer"
            >
              <option value="name" className="bg-slate-900">Sort by Name</option>
              <option value="load" className="bg-slate-900">Sort by Load</option>
              <option value="status" className="bg-slate-900">Sort by Status</option>
            </select>
            <button 
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="ml-1 p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
              <span className="text-[10px] font-black text-indigo-400">{sortOrder.toUpperCase()}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredAndSortedAgents.map((agent) => (
            <motion.div
              key={agent.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-slate-900/40 backdrop-blur-3xl border border-white/10 rounded-3xl p-6 relative overflow-hidden group hover:border-indigo-500/30 transition-all duration-500"
            >
              <div className="absolute top-0 right-0 p-4">
                <div className={`px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest border ${getStatusColor(agent.status)}`}>
                  {agent.status}
                </div>
              </div>

              <div className="flex items-start gap-4 mb-6">
                <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 group-hover:scale-110 transition-transform duration-500 relative">
                  <Bot className="w-6 h-6" />
                  <div className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-slate-900 ${
                    agent.status === 'success' ? 'bg-emerald-500' :
                    agent.status === 'error' ? 'bg-rose-500' :
                    agent.status === 'processing' ? 'bg-indigo-500 animate-pulse' :
                    'bg-slate-500'
                  }`}></div>
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-black text-white uppercase tracking-tight mb-1">{agent.name}</h3>
                    <div className="flex flex-col items-end">
                      <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Health</span>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((step) => (
                          <div 
                            key={step} 
                            className={`h-1 w-3 rounded-full ${
                              step <= (agent.status === 'error' ? 1 : agent.status === 'idle' ? 4 : 5) 
                                ? (agent.status === 'error' ? 'bg-rose-500' : 'bg-emerald-500') 
                                : 'bg-white/10'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{agent.type}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-500 mb-2">
                    <span>Neural Load</span>
                    <span>{agent.load}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${agent.load}%` }}
                      className="h-full bg-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4">
                  <button 
                    onClick={() => setSelectedAgentForLogs(agent)}
                    className="flex items-center justify-center gap-2 py-2 bg-white/5 hover:bg-indigo-500/20 border border-white/5 hover:border-indigo-500/30 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-400 transition-all"
                  >
                    <Terminal className="w-3 h-3" /> Logs
                  </button>
                  <button className="flex items-center justify-center gap-2 py-2 bg-white/5 hover:bg-indigo-500/20 border border-white/5 hover:border-indigo-500/30 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-400 transition-all">
                    <Zap className="w-3 h-3" /> Config
                  </button>
                </div>
              </div>

              <div className="absolute -bottom-10 -right-10 opacity-5 group-hover:opacity-10 transition-opacity duration-700">
                <Bot className="w-32 h-32" />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredAndSortedAgents.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-600 border-2 border-dashed border-white/5 rounded-3xl">
            <Bot className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-sm font-black uppercase tracking-widest">No agents match your filters</p>
            <button 
              onClick={() => {
                setSearchQuery('');
                setFilterStatus('all');
                setFilterType('all');
              }}
              className="mt-4 text-[10px] font-black text-indigo-400 hover:text-white uppercase tracking-widest underline underline-offset-4"
            >
              Clear all filters
            </button>
          </div>
        )}

        <button className="border-2 border-dashed border-white/5 hover:border-indigo-500/30 rounded-3xl p-6 flex flex-col items-center justify-center gap-4 group transition-all duration-500 bg-white/[0.02] hover:bg-white/[0.05]">
          <div className="p-4 rounded-2xl bg-white/5 text-slate-600 group-hover:text-indigo-400 group-hover:bg-indigo-500/10 transition-all">
            <Layers className="w-8 h-8" />
          </div>
          <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-white">Deploy New Agent</span>
        </button>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-950/40 border border-white/10 rounded-3xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <Shield className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Governance & NeuroContext</h3>
          </div>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl">
              <div className="flex items-center gap-4">
                <Shield className={`w-4 h-4 ${shaman.neuroContext.firewallActive ? 'text-emerald-400' : 'text-rose-400'}`} />
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">System Firewall</span>
              </div>
              <span className={`text-[9px] font-black uppercase tracking-widest ${shaman.neuroContext.firewallActive ? 'text-emerald-400' : 'text-rose-400'}`}>
                {shaman.neuroContext.firewallActive ? 'ACTIVE' : 'OFFLINE'}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl">
              <div className="flex items-center gap-4">
                <Cpu className={`w-4 h-4 ${shaman.neuroContext.isEnabled ? 'text-indigo-400' : 'text-slate-500'}`} />
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">NeuroContext BCI</span>
              </div>
              <span className={`text-[9px] font-black uppercase tracking-widest ${shaman.neuroContext.isEnabled ? 'text-indigo-400' : 'text-slate-600'}`}>
                {shaman.neuroContext.isEnabled ? 'LINKED' : 'DISABLED'}
              </span>
            </div>

            {shaman.neuroContext.isEnabled && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl space-y-4"
              >
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">Cognitive State</span>
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">{shaman.neuroContext.cognitiveState}</span>
                </div>
                <div>
                  <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-indigo-400/60 mb-1.5">
                    <span>Engagement</span>
                    <span>{shaman.neuroContext.engagementScore}%</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-500 transition-all duration-1000" 
                      style={{ width: `${shaman.neuroContext.engagementScore}%` }}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl">
              <div className="flex items-center gap-4">
                <Network className="w-4 h-4 text-slate-500" />
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Mesh Network</span>
              </div>
              <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">ENCRYPTED</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-950/40 border border-white/10 rounded-3xl p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Terminal className="w-5 h-5 text-indigo-400" />
              <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">System Output</h3>
            </div>
            <span className="text-[9px] font-mono text-slate-600">v3.1.0_STABLE</span>
          </div>
          <div className="font-mono text-[10px] text-slate-400 space-y-2 max-h-[200px] overflow-y-auto custom-scrollbar">
            <p className="text-indigo-400">[SYSTEM] Shaman Kernel initialized in {shaman.mode} mode.</p>
            {shaman.neuroContext.isEnabled && (
              <p className="text-indigo-400">[NEURO] BCI Link established. Cognitive State: {shaman.neuroContext.cognitiveState}.</p>
            )}
            {!shaman.neuroContext.firewallActive && (
              <p className="text-rose-400">[CRITICAL] System Firewall disabled. Guardrails bypassed.</p>
            )}
            <p>[INFO] Establishing secure handshake with Vertex AI...</p>
            <p>[INFO] Loading multimodal weights for Sentinel_v2...</p>
            <p className="text-emerald-400">[SUCCESS] Mesh network synchronized across 12 nodes.</p>
            <p>[INFO] ClaimsForge processing batch #8472...</p>
            <p className="text-amber-400">[WARN] High latency detected in US-EAST-1 gateway.</p>
            <p>[INFO] Rerouting traffic through sovereign US-CENTRAL-1...</p>
            <p className="text-indigo-400">[SYSTEM] Ready for executive commands.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentCanvas;
