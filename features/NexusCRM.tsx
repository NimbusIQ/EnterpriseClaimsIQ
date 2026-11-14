import React, { useState, useEffect } from 'react';
import { PageTitle, ActionButton } from '../components/shared';
import { MaterialSymbol } from '../components/icons';

interface Account {
  id: string;
  name: string;
  type: 'VC' | 'Angel' | 'Partner' | 'Contractor';
  status: string;
  lastInteraction: string;
}

const NexusCRM: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Simulated fetch from "RAG Vault"
    setTimeout(() => {
      setAccounts([
        { id: '1', name: 'Sequoia Capital', type: 'VC', status: 'Due Diligence', lastInteraction: '2025-04-10' },
        { id: '2', name: 'Andreessen Horowitz', type: 'VC', status: 'Initial Outreach', lastInteraction: '2025-04-12' },
        { id: '3', name: 'Naval Ravikant', type: 'Angel', status: 'Follow-up', lastInteraction: '2025-04-14' },
        { id: '4', name: 'Nimbus Roofing', type: 'Contractor', status: 'Active', lastInteraction: '2025-04-15' },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query) return;
    
    setLoading(true);
    const response = await fetch('/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    const data = await response.json();
    setAccounts(data.results);
    setLoading(false);
  };

  const triggerAgent = async (accountId: string, agentType: string) => {
    console.log(`Triggering ${agentType} Agent for account ${accountId}`);
    const response = await fetch('/api/orchestrate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        goal: `Run ${agentType} analysis for account ${accountId}`,
        context: { accountId }
      })
    });
    const data = await response.json();
    alert(`Agent Triggered: ${data.message}`);
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-slate-950 border-r border-white/10 p-8 flex flex-col gap-8">
        <div className="text-xl font-black text-white uppercase tracking-[0.2em]">Nimbus OS</div>
        <nav className="flex flex-col gap-4">
          <button onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'mission_control' }))} className="text-left text-slate-500 font-bold uppercase tracking-widest text-xs hover:text-white">Iron Dome</button>
          <button onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'fde_blueprint' }))} className="text-left text-indigo-400 font-bold uppercase tracking-widest text-xs hover:text-white">FDE Blueprint</button>
          <button className="text-left text-slate-500 font-bold uppercase tracking-widest text-xs hover:text-white">RAG Vault</button>
          <button className="text-left text-slate-500 font-bold uppercase tracking-widest text-xs hover:text-white">Agent Workforce</button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-grow flex flex-col space-y-12 py-12 animate-fade-in px-6">
        <div className="flex justify-between items-end">
          <PageTitle 
            title="Nexus CRM" 
            subtitle="Sovereign Intelligence Interface for 300+ Strategic Accounts" 
          />
          <div className="flex gap-4">
            <input 
              type="text" 
              placeholder="Neural Search..." 
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="bg-slate-900 border border-white/10 rounded-2xl px-6 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <ActionButton icon={<MaterialSymbol icon="sync" />}>Sync RAG Vault</ActionButton>
            <ActionButton icon={<MaterialSymbol icon="add" />} className="bg-indigo-600">Add Account</ActionButton>
          </div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Account Name</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Type</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Last Interaction</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-slate-500 animate-pulse">Loading Sovereign Memory...</td>
                </tr>
              ) : accounts.map((account) => (
                <tr key={account.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                        <MaterialSymbol icon={account.type === 'Contractor' ? 'construction' : 'account_balance'} />
                      </div>
                      <span className="font-bold text-white">{account.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-xs font-black uppercase tracking-widest text-slate-500">{account.type}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                      <span className="text-xs font-medium text-slate-300">{account.status}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-xs font-mono text-slate-500">{account.lastInteraction}</td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => triggerAgent(account.id, 'Analyst')}
                        className="p-2 hover:bg-indigo-500/20 rounded-lg text-indigo-400 transition-colors"
                        title="Trigger Analyst Agent"
                      >
                        <MaterialSymbol icon="analytics" />
                      </button>
                      <button 
                        onClick={() => triggerAgent(account.id, 'ClaimCore')}
                        className="p-2 hover:bg-emerald-500/20 rounded-lg text-emerald-400 transition-colors"
                        title="Trigger ClaimCore Agent"
                      >
                        <MaterialSymbol icon="gavel" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default NexusCRM;
