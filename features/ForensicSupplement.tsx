import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  FileText, 
  Plus, 
  Trash2, 
  Save, 
  Download, 
  Calculator, 
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Brain,
  Activity,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { PageTitle, ActionButton } from '../components/shared';
import { runForensicAudit } from '../services/geminiService';

interface RoomPart {
  id: string;
  name: string;
  shape: string;
  length: string;
  width: string;
  height: string;
}

interface LineItem {
  id: string;
  category: string;
  selector: string;
  action: string;
  calculation: string;
  description: string;
  depreciation: string;
}

const ForensicSupplement: React.FC = () => {
  const [roomParts, setRoomParts] = useState<RoomPart[]>([
    { id: '1', name: 'Main Roof', shape: 'Gable', length: '40', width: '30', height: '10' },
    { id: '2', name: 'Garage', shape: 'Hip', length: '20', width: '20', height: '8' },
  ]);

  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: '1', category: 'RFG', selector: '300S', action: 'Replace', calculation: '12.5 SQ', description: '3-Tab Shingles - 25 yr. - w/out Felt', depreciation: '20%' },
    { id: '2', category: 'RFG', selector: 'RIDGC', action: 'Replace', calculation: '45 LF', description: 'Ridge cap - composition shingles', depreciation: '15%' },
  ]);

  const [isAuditing, setIsAuditing] = useState(false);
  const [auditReport, setAuditReport] = useState<any>(null);

  const runAudit = async () => {
    setIsAuditing(true);
    setAuditReport(null);
    try {
      const claimData = {
        roomParts,
        lineItems,
        jurisdiction: "Texas",
        compliance_codes: ["HB 3344", "SB 458"]
      };
      const report = await runForensicAudit(claimData);
      setAuditReport(report);
    } catch (error) {
      console.error("Audit failed:", error);
    } finally {
      setIsAuditing(false);
    }
  };

  const addRoomPart = () => {
    const newPart: RoomPart = { id: Date.now().toString(), name: '', shape: '', length: '', width: '', height: '' };
    setRoomParts([...roomParts, newPart]);
  };

  const addLineItem = () => {
    const newItem: LineItem = { id: Date.now().toString(), category: '', selector: '', action: '', calculation: '', description: '', depreciation: '' };
    setLineItems([...lineItems, newItem]);
  };

  return (
    <div className="flex flex-col h-full gap-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <PageTitle title="ClaimsCore Engine v2.1" subtitle="Forensic, deterministic audit of insurance claim estimates for maximum recovery." />
        <div className="flex gap-4">
          <ActionButton 
            onClick={runAudit} 
            disabled={isAuditing}
            icon={isAuditing ? <Activity className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
          >
            {isAuditing ? 'Auditing...' : 'Run Forensic Audit'}
          </ActionButton>
          <ActionButton variant="secondary" onClick={() => {}} icon={<Download className="w-4 h-4" />}>
            Export Supplement
          </ActionButton>
        </div>
      </div>

      {auditReport && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-indigo-600/10 border border-indigo-500/20 rounded-[2.5rem] p-8"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-5 h-5 text-indigo-400" />
              <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Audit Intelligence Report</h3>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Compliance Status</span>
                <span className={`text-[10px] font-black uppercase tracking-widest ${auditReport.compliance_status === 'compliant' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {auditReport.compliance_status}
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Estimated Lift</span>
                <span className="text-lg font-black text-indigo-400 tracking-tight">+${auditReport.estimated_lift}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {auditReport.discrepancies.map((d: any, i: number) => (
              <div key={i} className="p-6 bg-white/5 border border-white/5 rounded-3xl space-y-4">
                <div className="flex justify-between items-start">
                  <div className="px-2 py-1 rounded bg-indigo-500/20 text-[8px] font-black text-indigo-400 uppercase tracking-widest">
                    {d.code}
                  </div>
                  <AlertTriangle className={`w-4 h-4 ${d.severity === 'critical' ? 'text-rose-500' : 'text-amber-500'}`} />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white uppercase tracking-tight mb-1">{d.rule}</h4>
                  <p className="text-[10px] text-slate-400 leading-relaxed">{d.justification}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-white/5 flex justify-between items-center">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Next Action: <span className="text-white">{auditReport.next_action}</span>
            </div>
            <button className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-indigo-500/20">
              Apply All Corrections
            </button>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Room Parts Section */}
        <div className="lg:col-span-12">
          <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400">
                  <Calculator className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-black text-white uppercase tracking-tight">Room Parts & Dimensions</h3>
              </div>
              <button onClick={addRoomPart} className="flex items-center gap-2 text-[10px] font-black text-indigo-400 hover:text-white uppercase tracking-widest transition-all">
                <Plus className="w-3 h-3" /> Add Part
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="px-4 py-3 text-[9px] font-black text-slate-500 uppercase tracking-widest">Part Name</th>
                    <th className="px-4 py-3 text-[9px] font-black text-slate-500 uppercase tracking-widest">Shape</th>
                    <th className="px-4 py-3 text-[9px] font-black text-slate-500 uppercase tracking-widest">Length</th>
                    <th className="px-4 py-3 text-[9px] font-black text-slate-500 uppercase tracking-widest">Width</th>
                    <th className="px-4 py-3 text-[9px] font-black text-slate-500 uppercase tracking-widest">Height</th>
                    <th className="px-4 py-3 text-[9px] font-black text-slate-500 uppercase tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {roomParts.map((part) => (
                    <tr key={part.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-4">
                        <input 
                          type="text" 
                          value={part.name} 
                          placeholder="e.g. Main Roof"
                          className="bg-transparent border-none text-xs font-bold text-white outline-none w-full"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <input 
                          type="text" 
                          value={part.shape} 
                          placeholder="e.g. Gable"
                          className="bg-transparent border-none text-xs font-bold text-white outline-none w-full"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <input 
                          type="text" 
                          value={part.length} 
                          placeholder="0'"
                          className="bg-transparent border-none text-xs font-mono text-indigo-400 outline-none w-full"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <input 
                          type="text" 
                          value={part.width} 
                          placeholder="0'"
                          className="bg-transparent border-none text-xs font-mono text-indigo-400 outline-none w-full"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <input 
                          type="text" 
                          value={part.height} 
                          placeholder="0'"
                          className="bg-transparent border-none text-xs font-mono text-indigo-400 outline-none w-full"
                        />
                      </td>
                      <td className="px-4 py-4 text-right">
                        <button onClick={() => setRoomParts(roomParts.filter(p => p.id !== part.id))} className="text-slate-600 hover:text-rose-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Line Items Section */}
        <div className="lg:col-span-12">
          <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-black text-white uppercase tracking-tight">Supplement Line Items</h3>
              </div>
              <button onClick={addLineItem} className="flex items-center gap-2 text-[10px] font-black text-indigo-400 hover:text-white uppercase tracking-widest transition-all">
                <Plus className="w-3 h-3" /> Add Line Item
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="px-4 py-3 text-[9px] font-black text-slate-500 uppercase tracking-widest">Cat</th>
                    <th className="px-4 py-3 text-[9px] font-black text-slate-500 uppercase tracking-widest">Selector</th>
                    <th className="px-4 py-3 text-[9px] font-black text-slate-500 uppercase tracking-widest">ACT</th>
                    <th className="px-4 py-3 text-[9px] font-black text-slate-500 uppercase tracking-widest">Calculation</th>
                    <th className="px-4 py-3 text-[9px] font-black text-slate-500 uppercase tracking-widest">Description</th>
                    <th className="px-4 py-3 text-[9px] font-black text-slate-500 uppercase tracking-widest">Deprec</th>
                    <th className="px-4 py-3 text-[9px] font-black text-slate-500 uppercase tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {lineItems.map((item) => (
                    <tr key={item.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-4">
                        <input 
                          type="text" 
                          value={item.category} 
                          placeholder="RFG"
                          className="bg-transparent border-none text-[10px] font-black text-white outline-none w-12"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <input 
                          type="text" 
                          value={item.selector} 
                          placeholder="300S"
                          className="bg-transparent border-none text-[10px] font-black text-indigo-400 outline-none w-16"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <input 
                          type="text" 
                          value={item.action} 
                          placeholder="Replace"
                          className="bg-transparent border-none text-[10px] font-bold text-slate-400 outline-none w-20"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <input 
                          type="text" 
                          value={item.calculation} 
                          placeholder="0 SQ"
                          className="bg-transparent border-none text-[10px] font-mono text-white outline-none w-24"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <input 
                          type="text" 
                          value={item.description} 
                          placeholder="Item description..."
                          className="bg-transparent border-none text-xs font-medium text-slate-300 outline-none w-full min-w-[200px]"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <input 
                          type="text" 
                          value={item.depreciation} 
                          placeholder="0%"
                          className="bg-transparent border-none text-[10px] font-black text-rose-400 outline-none w-12"
                        />
                      </td>
                      <td className="px-4 py-4 text-right">
                        <button onClick={() => setLineItems(lineItems.filter(i => i.id !== item.id))} className="text-slate-600 hover:text-rose-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Code Compliance & Justification */}
        <div className="lg:col-span-12">
          <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-[2.5rem] p-8 flex items-start gap-6">
            <div className="p-4 rounded-2xl bg-indigo-500/20 text-indigo-400">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg font-black text-white uppercase tracking-tight mb-2">Building Code Compliance Check</h4>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Nimbus IQ AI has detected 3 potential code violations in the current scope. Supplementing for Ice & Water Shield (IRC R905.1.2) and Drip Edge (IRC R905.2.8.5) is recommended for this jurisdiction.
              </p>
              <button className="text-[10px] font-black text-indigo-400 hover:text-white uppercase tracking-widest transition-all underline underline-offset-4">
                Auto-Generate Justification Text
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForensicSupplement;
