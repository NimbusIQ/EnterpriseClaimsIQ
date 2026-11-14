import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Folder, 
  FileText, 
  Users, 
  Briefcase, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  Share2, 
  Trash2, 
  Eye,
  ArrowUpRight,
  ShieldCheck,
  Truck,
  DollarSign,
  Layers,
  Sparkles
} from 'lucide-react';
import { PageTitle, ActionButton } from '../components/shared';
import { JOB_LEDGER_DATA, ABC_SUPPLY_ORDERS, JobRecord, ABCSupplyOrder } from '../src/data/jobLedger';

interface Claim {
  id: string;
  clientName: string;
  status: 'open' | 'pending' | 'closed';
  dateOpened: string;
  type: string;
  amount?: string;
  priority: 'low' | 'medium' | 'high';
}

interface Client {
  id: string;
  name: string;
  email: string;
  claimsCount: number;
  status: 'active' | 'inactive';
}

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  dateUploaded: string;
  category: 'policy' | 'inspection' | 'legal' | 'other';
}

const ClaimsDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'claims' | 'ledger' | 'abc_orders' | 'clients' | 'folders' | 'documents' | 'feed'>('ledger');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPm, setSelectedPm] = useState<string>('all');
  const [selectedCrew, setSelectedCrew] = useState<string>('all');

  // Job Ledger filtering
  const filteredJobs = useMemo(() => {
    return JOB_LEDGER_DATA.filter(job => {
      const matchesSearch = 
        job.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.po.includes(searchQuery);
      const matchesPm = selectedPm === 'all' || job.pm === selectedPm;
      const matchesCrew = selectedCrew === 'all' || job.roofCrew.includes(selectedCrew);
      return matchesSearch && matchesPm && matchesCrew;
    });
  }, [searchQuery, selectedPm, selectedCrew]);

  // ABC Supply orders filtering
  const filteredOrders = useMemo(() => {
    return ABC_SUPPLY_ORDERS.filter(order => {
      return (
        order.orderNumber.includes(searchQuery) ||
        order.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.deliveryAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.shippingBranch.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [searchQuery]);

  // Summary Ledger Metrics
  const ledgerMetrics = useMemo(() => {
    const totalLabor = filteredJobs.reduce((sum, j) => sum + j.roofLabor, 0);
    const totalMaterial = filteredJobs.reduce((sum, j) => sum + j.roofMaterial, 0);
    const totalGutters = filteredJobs.reduce((sum, j) => sum + j.gutters, 0);
    const totalFence = filteredJobs.reduce((sum, j) => sum + j.fence, 0);
    const totalCombined = totalLabor + totalMaterial + totalGutters + totalFence;
    return { totalLabor, totalMaterial, totalGutters, totalFence, totalCombined, count: filteredJobs.length };
  }, [filteredJobs]);

  // Mock Data
  const [claims] = useState<Claim[]>([
    { id: 'CLM-001', clientName: 'John Smith', status: 'open', dateOpened: '2025-04-01', type: 'Roof Damage', amount: '$12,500', priority: 'high' },
    { id: 'CLM-002', clientName: 'Sarah Johnson', status: 'pending', dateOpened: '2025-03-28', type: 'Hail Strike', amount: '$8,200', priority: 'medium' },
    { id: 'CLM-003', clientName: 'Robert Davis', status: 'open', dateOpened: '2025-04-05', type: 'Wind Damage', amount: '$15,000', priority: 'high' },
    { id: 'CLM-004', clientName: 'Emily Wilson', status: 'closed', dateOpened: '2025-02-15', type: 'Storm Surge', amount: '$22,000', priority: 'low' },
  ]);

  const [clients, setClients] = useState<Client[]>([
    { id: 'CLI-001', name: 'John Smith', email: 'john.smith@email.com', claimsCount: 1, status: 'active' },
    { id: 'CLI-002', name: 'Sarah Johnson', email: 'sarah.j@email.com', claimsCount: 2, status: 'active' },
    { id: 'CLI-003', name: 'Robert Davis', email: 'robert.d@email.com', claimsCount: 1, status: 'active' },
    { id: 'CLI-004', name: 'Emily Wilson', email: 'emily.w@email.com', claimsCount: 3, status: 'inactive' },
  ]);

  const toggleClientStatus = (clientId: string) => {
    setClients(prev => prev.map(c => 
      c.id === clientId ? { ...c, status: c.status === 'active' ? 'inactive' : 'active' } : c
    ));
  };

  const [documents] = useState<Document[]>([
    { id: 'DOC-001', name: 'Policy_Declaration_Smith.pdf', type: 'PDF', size: '2.4 MB', dateUploaded: '2025-04-01', category: 'policy' },
    { id: 'DOC-002', name: 'Roof_Inspection_Photos.zip', type: 'ZIP', size: '45.8 MB', dateUploaded: '2025-04-02', category: 'inspection' },
    { id: 'DOC-003', name: 'Xactimate_Scope_Final.pdf', type: 'PDF', size: '1.1 MB', dateUploaded: '2025-04-03', category: 'legal' },
  ]);

  const filteredClaims = useMemo(() => 
    claims.filter(c => c.clientName.toLowerCase().includes(searchQuery.toLowerCase()) || c.id.toLowerCase().includes(searchQuery.toLowerCase())),
    [claims, searchQuery]
  );

  const filteredClients = useMemo(() => 
    clients.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.email.toLowerCase().includes(searchQuery.toLowerCase())),
    [clients, searchQuery]
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'pending': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'closed': return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
      case 'active': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'inactive': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-rose-400';
      case 'medium': return 'text-amber-400';
      case 'low': return 'text-emerald-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="flex flex-col h-full gap-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <PageTitle title="Nexus Portal" subtitle="Client Infrastructure & Claims Production Command Center." />
        </div>
        <div className="flex gap-4">
          <ActionButton onClick={() => {}} icon={<Plus className="w-4 h-4" />}>
            New Claim
          </ActionButton>
          <ActionButton variant="secondary" onClick={() => {}} icon={<Users className="w-4 h-4" />}>
            Add Client
          </ActionButton>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-900/50 border border-white/5 rounded-2xl w-fit">
        {[
          { id: 'ledger', label: 'Job Production Ledger', icon: Layers },
          { id: 'abc_orders', label: 'ABC Supply Orders', icon: Truck },
          { id: 'claims', label: 'Open Claims', icon: Briefcase },
          { id: 'clients', label: 'Clients', icon: Users },
          { id: 'folders', label: 'Shared Folders', icon: Folder },
          { id: 'documents', label: 'Documents', icon: FileText },
          { id: 'feed', label: 'Data Feed', icon: ArrowUpRight },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === tab.id 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                : 'text-slate-500 hover:text-white hover:bg-white/5'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col lg:flex-row gap-4 bg-slate-900/40 backdrop-blur-xl border border-white/10 p-4 rounded-3xl">
        <div className="flex-grow relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text"
            placeholder={`Search ${activeTab === 'ledger' ? 'by Job #, Customer, Address, or Crew' : activeTab}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/5 focus:border-indigo-500/50 rounded-2xl py-3 pl-12 pr-4 text-sm text-white placeholder:text-slate-600 outline-none transition-all"
          />
        </div>

        {activeTab === 'ledger' && (
          <div className="flex items-center gap-3">
            <select 
              value={selectedPm}
              onChange={(e) => setSelectedPm(e.target.value)}
              className="bg-slate-950 text-xs font-bold text-slate-300 border border-white/10 rounded-2xl px-4 py-2.5 outline-none"
            >
              <option value="all">All PMs</option>
              <option value="DM">PM: Dustin Moore (DM)</option>
              <option value="CS">PM: Chris Stedman (CS)</option>
              <option value="LJ">PM: Lauren Jacks (LJ)</option>
            </select>

            <select 
              value={selectedCrew}
              onChange={(e) => setSelectedCrew(e.target.value)}
              className="bg-slate-950 text-xs font-bold text-slate-300 border border-white/10 rounded-2xl px-4 py-2.5 outline-none"
            >
              <option value="all">All Roof Crews</option>
              <option value="MIGUEL HERRERA">Miguel Herrera</option>
              <option value="JOSE ACOSTA">Jose Acosta</option>
              <option value="JONATHAN ZEMPOALTECA">Jonathan Zempoalteca</option>
              <option value="MICKEY CRUZ">Mickey Cruz</option>
              <option value="OMAR RAMIREZ">Omar Ramirez</option>
            </select>
          </div>
        )}

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
            <Clock className="w-3.5 h-3.5" />
            Active Sync
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-grow">
        <AnimatePresence mode="wait">
          {activeTab === 'ledger' && (
            <motion.div
              key="ledger"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Financial Metrics Strip */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-4">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Total Roof Labor</span>
                  <span className="text-xl font-black text-white">${ledgerMetrics.totalLabor.toLocaleString()}</span>
                </div>
                <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-4">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Total Roof Materials</span>
                  <span className="text-xl font-black text-indigo-400">${ledgerMetrics.totalMaterial.toLocaleString()}</span>
                </div>
                <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-4">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Gutters Payout</span>
                  <span className="text-xl font-black text-white">${ledgerMetrics.totalGutters.toLocaleString()}</span>
                </div>
                <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-4">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Fence Payout</span>
                  <span className="text-xl font-black text-white">${ledgerMetrics.totalFence.toLocaleString()}</span>
                </div>
                <div className="bg-slate-900/60 border border-emerald-500/20 bg-emerald-500/5 rounded-2xl p-4">
                  <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest block mb-1">Combined Production</span>
                  <span className="text-xl font-black text-emerald-400">${ledgerMetrics.totalCombined.toLocaleString()}</span>
                </div>
              </div>

              {/* Table */}
              <div className="bg-slate-900/40 border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-white/5 border-b border-white/5 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        <th className="px-5 py-4">PO #</th>
                        <th className="px-5 py-4">PM</th>
                        <th className="px-5 py-4">Customer & Address</th>
                        <th className="px-5 py-4">Roof Crew</th>
                        <th className="px-5 py-4 text-right">Roof Labor</th>
                        <th className="px-5 py-4 text-right">Roof Material</th>
                        <th className="px-5 py-4 text-right">Trades (Gutter/Fence)</th>
                        <th className="px-5 py-4 text-center">Warranty</th>
                        <th className="px-5 py-4 text-right">Commission Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-medium">
                      {filteredJobs.map((job) => (
                        <tr key={job.po} className="hover:bg-white/[0.02] transition-colors group">
                          <td className="px-5 py-4 font-mono font-bold text-indigo-400">
                            PO-{job.po}
                          </td>
                          <td className="px-5 py-4 font-bold text-white">
                            <span className="px-2 py-1 bg-white/5 rounded-md border border-white/10">{job.pm}</span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="font-bold text-white uppercase">{job.lastName}, {job.firstName}</div>
                            <div className="text-[10px] text-slate-500 font-mono">{job.address}</div>
                          </td>
                          <td className="px-5 py-4 text-slate-300">
                            {job.roofCrew}
                          </td>
                          <td className="px-5 py-4 text-right font-mono text-emerald-400">
                            ${job.roofLabor.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="px-5 py-4 text-right font-mono text-indigo-300">
                            ${job.roofMaterial.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="px-5 py-4 text-right font-mono text-slate-400">
                            ${(job.gutters + job.fence).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="px-5 py-4 text-center">
                            <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-wider text-slate-300">
                              {job.warranty}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-right font-mono text-slate-500 text-[10px]">
                            {job.finalDate}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'abc_orders' && (
            <motion.div
              key="abc_orders"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="bg-slate-900/40 border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Truck className="w-5 h-5 text-indigo-400" />
                    <div>
                      <h3 className="text-sm font-black text-white uppercase tracking-wider">ABC Supply Live Procurement Invoices</h3>
                      <p className="text-[10px] font-bold text-slate-500 uppercase">Synchronized with Denton (#203) & Melissa (#459) Branches</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-xl border border-indigo-500/20">
                    {filteredOrders.length} Invoices Found
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-white/5 border-b border-white/5 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        <th className="px-6 py-4">Order #</th>
                        <th className="px-6 py-4">Order Type</th>
                        <th className="px-6 py-4">PO Reference</th>
                        <th className="px-6 py-4">Date Ordered</th>
                        <th className="px-6 py-4">Delivery Address</th>
                        <th className="px-6 py-4">Fulfillment Branch</th>
                        <th className="px-6 py-4 text-right">Invoice Total</th>
                        <th className="px-6 py-4 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-medium">
                      {filteredOrders.map((order) => (
                        <tr key={order.orderNumber} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-6 py-4 font-mono font-bold text-indigo-400">{order.orderNumber}</td>
                          <td className="px-6 py-4 font-bold text-white">{order.orderType}</td>
                          <td className="px-6 py-4 text-slate-300 font-mono text-[11px]">{order.poNumber}</td>
                          <td className="px-6 py-4 text-slate-400 font-mono">{order.dateOrdered}</td>
                          <td className="px-6 py-4 text-slate-300 text-xs">{order.deliveryAddress}</td>
                          <td className="px-6 py-4 text-slate-400 text-[11px]">{order.shippingBranch}</td>
                          <td className="px-6 py-4 text-right font-mono font-bold text-white">
                            ${order.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                              order.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-300'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
          {activeTab === 'claims' && (
            <motion.div
              key="claims"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 gap-4"
            >
              {filteredClaims.map((claim) => (
                <div key={claim.id} className="bg-slate-900/40 border border-white/5 hover:border-indigo-500/30 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 group transition-all">
                  <div className="flex items-center gap-6 w-full md:w-auto">
                    <div className={`p-4 rounded-2xl bg-white/5 border border-white/5 text-slate-400 group-hover:text-indigo-400 group-hover:border-indigo-500/20 transition-all`}>
                      <Briefcase className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-black text-white uppercase tracking-tight">{claim.clientName}</h3>
                        <span className="text-[10px] font-mono text-slate-500">{claim.id}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{claim.type}</span>
                        <div className="h-1 w-1 rounded-full bg-slate-700"></div>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${getPriorityColor(claim.priority)}`}>
                          {claim.priority} Priority
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                    <div className="text-right">
                      <span className="block text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Claim Value</span>
                      <span className="text-lg font-black text-white">{claim.amount || 'N/A'}</span>
                    </div>
                    <div className="text-right">
                      <span className="block text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Status</span>
                      <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${getStatusColor(claim.status)}`}>
                        {claim.status}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-slate-400 hover:text-white transition-all">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-slate-400 hover:text-white transition-all">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'clients' && (
            <motion.div
              key="clients"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredClients.map((client) => (
                <div key={client.id} className="bg-slate-900/40 border border-white/5 hover:border-indigo-500/30 rounded-3xl p-8 group transition-all relative overflow-hidden">
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-slate-400 group-hover:text-indigo-400 transition-all">
                      <Users className="w-6 h-6" />
                    </div>
                    <div className={`px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest border ${getStatusColor(client.status)}`}>
                      {client.status}
                    </div>
                  </div>
                  <h3 className="text-xl font-black text-white uppercase tracking-tight mb-1">{client.name}</h3>
                  <p className="text-xs font-medium text-slate-500 mb-6">{client.email}</p>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <div>
                      <span className="block text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Active Claims</span>
                      <span className="text-lg font-black text-white">{client.claimsCount}</span>
                    </div>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => toggleClientStatus(client.id)}
                        className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${
                          client.status === 'active' 
                            ? 'text-rose-400 border-rose-500/20 hover:bg-rose-500/10' 
                            : 'text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/10'
                        }`}
                      >
                        {client.status === 'active' ? 'Close Client' : 'Reactivate'}
                      </button>
                      <button className="flex items-center gap-2 text-[10px] font-black text-indigo-400 hover:text-white uppercase tracking-widest transition-all">
                        View Profile <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <button className="border-2 border-dashed border-white/5 hover:border-indigo-500/30 rounded-3xl p-8 flex flex-col items-center justify-center gap-4 group transition-all duration-500 bg-white/[0.02] hover:bg-white/[0.05]">
                <div className="p-4 rounded-2xl bg-white/5 text-slate-600 group-hover:text-indigo-400 group-hover:bg-indigo-500/10 transition-all">
                  <Plus className="w-8 h-8" />
                </div>
                <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-white">Add New Client</span>
              </button>
            </motion.div>
          )}

          {activeTab === 'folders' && (
            <motion.div
              key="folders"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {[
                { name: 'Active Claims', items: 12, color: 'text-indigo-400' },
                { name: 'Legal Documents', items: 45, color: 'text-rose-400' },
                { name: 'Inspection Photos', items: 128, color: 'text-amber-400' },
                { name: 'Policy Archives', items: 89, color: 'text-emerald-400' },
              ].map((folder, i) => (
                <div key={i} className="bg-slate-900/40 border border-white/5 hover:border-indigo-500/30 rounded-3xl p-8 group cursor-pointer transition-all">
                  <div className={`mb-6 ${folder.color}`}>
                    <Folder className="w-10 h-10 fill-current opacity-20 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h3 className="text-lg font-black text-white uppercase tracking-tight mb-1">{folder.name}</h3>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{folder.items} Items</span>
                </div>
              ))}
              <div className="border-2 border-dashed border-white/5 rounded-3xl p-8 flex items-center justify-center group cursor-pointer hover:border-white/10 transition-all">
                <Plus className="w-6 h-6 text-slate-700 group-hover:text-white transition-colors" />
              </div>
            </motion.div>
          )}

          {activeTab === 'documents' && (
            <motion.div
              key="documents"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-slate-900/40 border border-white/5 rounded-3xl overflow-hidden"
            >
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 border-b border-white/5">
                    <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Document Name</th>
                    <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Category</th>
                    <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Size</th>
                    <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Date</th>
                    <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc) => (
                    <tr key={doc.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="p-2 rounded-lg bg-white/5 text-slate-400 group-hover:text-indigo-400 transition-colors">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="block text-xs font-bold text-white mb-0.5">{doc.name}</span>
                            <span className="text-[9px] font-mono text-slate-600 uppercase">{doc.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="px-2 py-1 rounded bg-white/5 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                          {doc.category}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-xs font-mono text-slate-500">{doc.size}</td>
                      <td className="px-8 py-6 text-xs font-mono text-slate-500">{doc.dateUploaded}</td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-all">
                            <Download className="w-4 h-4" />
                          </button>
                          <button className="p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-all">
                            <Share2 className="w-4 h-4" />
                          </button>
                          <button className="p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-rose-400 transition-all">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}

          {activeTab === 'feed' && (
            <motion.div
              key="feed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-10 space-y-8">
                <div className="flex items-center gap-4 mb-2">
                  <div className="p-4 rounded-2xl bg-indigo-500/10 text-indigo-400">
                    <ArrowUpRight className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tight">Ingest Raw Data</h3>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Feed the Nimbus IQ neural engine</p>
                  </div>
                </div>
                
                <div className="border-2 border-dashed border-white/5 rounded-3xl p-12 flex flex-col items-center justify-center gap-4 hover:border-indigo-500/30 transition-all cursor-pointer bg-white/[0.02]">
                  <Download className="w-10 h-10 text-slate-700" />
                  <div className="text-center">
                    <p className="text-sm font-black text-white uppercase tracking-widest mb-1">Drop files here</p>
                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">PDF, CSV, JSON, or Images</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Recent Ingestions</span>
                  <div className="space-y-3">
                    {[
                      { name: 'Adjuster_Scope_Dallas.pdf', status: 'Processed', time: '2h ago' },
                      { name: 'Inspection_Batch_04.zip', status: 'Analyzing', time: 'Just now' },
                      { name: 'Market_Rates_Q2.csv', status: 'Processed', time: '1d ago' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                        <div className="flex items-center gap-3">
                          <FileText className="w-4 h-4 text-slate-500" />
                          <span className="text-xs font-bold text-slate-300">{item.name}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`text-[9px] font-black uppercase tracking-widest ${item.status === 'Analyzing' ? 'text-amber-400 animate-pulse' : 'text-emerald-400'}`}>
                            {item.status}
                          </span>
                          <span className="text-[9px] font-mono text-slate-600">{item.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-indigo-600/5 border border-indigo-500/10 rounded-[2.5rem] p-10 flex flex-col justify-between">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="p-4 rounded-2xl bg-indigo-500/10 text-indigo-400">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white uppercase tracking-tight">Processing Status</h3>
                      <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Neural synthesis in progress</p>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
                        <span>OCR Accuracy</span>
                        <span>98.4%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 w-[98.4%]" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
                        <span>Code Compliance Match</span>
                        <span>92.1%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 w-[92.1%]" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                  <p className="text-[10px] font-bold text-slate-400 leading-relaxed italic">
                    "Nimbus IQ is currently processing 1,242 line items across 14 jurisdictions. Average supplement lift: +18.4%."
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Quick Stats Overlay */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Open Claims', value: '142', icon: Briefcase, color: 'text-indigo-400' },
          { label: 'Pending Approval', value: '28', icon: Clock, color: 'text-amber-400' },
          { label: 'Settled (MTD)', value: '$1.2M', icon: ShieldCheck, color: 'text-emerald-400' },
          { label: 'Active Clients', value: '842', icon: Users, color: 'text-indigo-400' },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900/60 border border-white/5 rounded-3xl p-6 flex items-center gap-6">
            <div className={`p-4 rounded-2xl bg-white/5 ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">{stat.label}</span>
              <span className="text-2xl font-black text-white">{stat.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClaimsDashboard;
