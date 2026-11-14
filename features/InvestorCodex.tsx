import React, { useState } from 'react';
import { PageTitle, ActionButton } from '../components/shared';
import { MaterialSymbol } from '../components/icons';

interface GrantPartner {
  id: string;
  name: string;
  category: string;
  fundingRange: string;
  icon: string;
  partnershipNature: string;
  resourcesProvided: string[];
  stackLeverage: string;
  enhancementVector: string;
}

const GRANT_PARTNERS: GrantPartner[] = [
  {
    id: 'google-for-startups-cloud',
    name: 'Google for Startups Cloud Program (AI First Tier) & Vertex AI Grants',
    category: 'Hyperscaler AI Infrastructure & Go-To-Market',
    fundingRange: 'Up to $350,000 in Cloud & Vertex AI Credits + Co-Sell Access',
    icon: 'cloud_done',
    partnershipNature:
      'Foundational hyperscaler partnership positioning Nimb (Nimbus IQ) inside Google’s AI-First startup cohort, bridging direct engineering mentorship from Google DeepMind/Cloud teams with Google Cloud Marketplace co-selling.',
    resourcesProvided: [
      'Up to $350,000 in Google Cloud & Vertex AI compute credits over 2 years',
      'Dedicated Google Cloud Customer Engineers and AI/ML architectural reviews',
      'Direct access to Gemini 2.5 Pro, Veo, and Imagen 3 high-quota enterprise endpoints',
      'Google Cloud Marketplace listing fee waivers and enterprise co-sell incentives'
    ],
    stackLeverage:
      'Directly subsidizes and scales Nimb’s core multi-agent sovereign mesh running on Cloud Run, Vertex AI (Gemini 2.5 Pro / Flash), AlloyDB, and BigQuery GIS without burning seed equity.',
    enhancementVector:
      'Unlocks high-throughput batch multimodal inference for ClaimCore v2.4 (automated Xactimate PDF + drone imagery synthesis) and fine-tuned regional building code embeddings on Vertex AI Vector Search.'
  },
  {
    id: 'nsf-sbir',
    name: 'National Science Foundation (NSF) SBIR/STTR — America’s Seed Fund',
    category: 'Federal R&D Non-Dilutive Grant (Environmental & Structural AI)',
    fundingRange: '$305,000 (Phase I) to $1,250,000+ (Phase II) Non-Dilutive',
    icon: 'science',
    partnershipNature:
      'Federal deep-tech research partnership focused on automated post-disaster structural damage assessment, climate resilience, and deterministic neuro-symbolic AI verification for residential and municipal infrastructure.',
    resourcesProvided: [
      '$305,000 Phase I feasibility grant + $1.25M Phase II commercialization award (0% equity dilution)',
      'NSF Beat-the-Odds Boot Camp & I-Corps customer discovery mentorship across municipal & insurance buyers',
      'Technical validation badge for GovTech procurement and federal/state disaster recovery contracts',
      'Supplemental matching funds (Phase IIB) up to $500,000 with institutional partners'
    ],
    stackLeverage:
      'Leverages Nimb’s SatCalc v2.4 engine, StormWatch NOAA/NEXRAD hail swaths, and ForensicSupplement computer vision pipelines to prove automated, sub-inch roof and envelope pathology detection.',
    enhancementVector:
      'Funds proprietary research into hallucination-free regulatory reasoning (combining Gemini multimodal vision with deterministic municipal IRC/IBC code graphs in AlloyDB) to achieve 99.8% audit compliance.'
  },
  {
    id: 'fema-bric-nist',
    name: 'FEMA Building Resilient Infrastructure and Communities (BRIC) & NIST Disaster Resilience',
    category: 'GovTech & Municipal Climate Resilience Sub-Grant',
    fundingRange: '$250,000 – $2,000,000 (Municipal Technology Sub-Award)',
    icon: 'shield_moon',
    partnershipNature:
      'Public-private GovTech partnership with Texas and Midwest municipalities (e.g., Collin County / North Texas regional councils) deploying Nimb as an automated code-enforcement, hail-mitigation, and resilient re-roofing verification system.',
    resourcesProvided: [
      'Non-dilutive technology implementation grants via state/local hazard mitigation budgets',
      'Direct municipal GIS parcel data feeds, historical permit archives, and LiDAR elevation maps',
      'Fast-tracked Authority Having Jurisdiction (AHJ) automated permitting sandbox integration',
      'Public endorsement for Class-4 impact-resistant roofing verification standards'
    ],
    stackLeverage:
      'Integrates directly with Nimb’s `TX_COLLIN_ANNA_GIS_01` jurisdiction vector engine, automated HB 2102 statutory compliance validator, and BigQuery geospatial parcel datasets.',
    enhancementVector:
      'Transforms Nimb from a contractor-side supplement platform into the dual-sided municipal compliance standard—automating permit issuance, ice & water shield verification, and Class-4 impact discount certification for insurers.'
  },
  {
    id: 'google-org-climate',
    name: 'Google.org Impact Challenge: Climate & Community Resilience',
    category: 'Philanthropic AI for Social & Climate Adaptation Grant',
    fundingRange: '$500,000 – $2,500,000 Grant + Google.org Fellowship',
    icon: 'eco',
    partnershipNature:
      'Strategic impact collaboration within Google’s ecosystem focused on accelerating severe-weather recovery for vulnerable homeowners, preventing insurance underpayment/blight, and optimizing sustainable building material supply chains.',
    resourcesProvided: [
      'Up to $2.5M in non-dilutive philanthropic grant funding plus additional Google Cloud credits',
      'Pro-bono Google.org Fellows (senior Google software engineers, UX researchers, and data scientists embedded for 6 months)',
      'Integration with Google Earth Engine, Google Solar API, and FloodHub/WeatherNext models',
      'Global visibility across Google’s sustainability and urban resilience summits'
    ],
    stackLeverage:
      'Combines Nimb’s ClaimCore Supplement Engine and ABC Supply live procurement ledger with Google’s Solar API (3D roof geometry/DSM) and WeatherNext neural meteorological forecasting.',
    enhancementVector:
      'Replaces costly third-party aerial measurement reports (EagleView/Hover) with native Google Solar API 3D mesh extraction—cutting per-claim geometry costs by 85% while predicting material waste and cool-roof energy savings.'
  },
  {
    id: 'tx-oedit-tief',
    name: 'Texas Enterprise & Innovation Funds / Capital Factory Defense & GovTech Accelerator',
    category: 'Regional Sovereign AI & InsurTech Commercialization Grant',
    fundingRange: '$100,000 – $500,000 R&D Tax Credit / Grant + Pilot Contracts',
    icon: 'verified_user',
    partnershipNature:
      'Regional statutory and commercialization partnership anchored in North Texas (DFW corridor), aligning Nimb with Texas TRAIGA (Texas Responsible AI Governance Act) standards, regional property carriers, and large supply distributors.',
    resourcesProvided: [
      'State R&D innovation grants, workforce training subsidies, and non-dilutive pilot stipends',
      'Regulatory sandbox participation for TRAIGA-compliant explainable AI in property insurance claims',
      'Direct enterprise introductions to tier-1 regional carriers, adjusters, and building suppliers (ABC Supply / SRS)',
      'Joint university research credits (UT Austin / UT Dallas AI Labs) for computer vision benchmarking'
    ],
    stackLeverage:
      'Utilizes Nimb’s IronDome security architecture, Texas HB 2102 statutory audit trails, and real-time ERP/supplier sync (`ABC_SUPPLY_ORDERS` & `JOB_LEDGER_DATA` pipelines).',
    enhancementVector:
      'Establishes immutable, cryptographically verifiable audit logs for every AI-generated Xactimate line item and supplier invoice, satisfying strict state insurance commissioner audits and carrier anti-fraud mandates.'
  }
];

const InvestorCodex: React.FC = () => {
  const [selectedPartner, setSelectedPartner] = useState<string>(GRANT_PARTNERS[0].id);

  const activePartner = GRANT_PARTNERS.find(p => p.id === selectedPartner) || GRANT_PARTNERS[0];

  return (
    <div className="flex flex-col space-y-20 py-16 animate-fade-in px-6 min-h-screen max-w-7xl mx-auto">
      <div className="text-center max-w-4xl mx-auto space-y-4">
        <PageTitle 
            title="Investor Codex" 
            subtitle="We don’t pitch hype. We present systems, margins, non-dilutive capital, and defensibility." 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
            { title: 'Architecture', icon: 'account_tree', desc: 'Multi-agent sovereign mesh built on Vertex AI, Cloud Run, and AlloyDB.' },
            { title: 'Moat', icon: 'castle', desc: 'Proprietary visual training data, live supplier ledgers, and regional regulatory vectors.' },
            { title: 'Expansion Vectors', icon: 'trending_up', desc: 'Scaling from roofing into total PropTech, InsurTech, and GovTech verticals.' },
            { title: 'Exit Paths', icon: 'exit_to_app', desc: 'Strategic alignment with Google Cloud, ERP platforms, and insurance leaders.' }
        ].map((block, i) => (
            <div key={i} className="bg-slate-900 border border-white/10 rounded-[3rem] p-10 space-y-6 shadow-xl hover:border-indigo-500/30 transition-all group">
                <div className="h-16 w-16 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-lg">
                    <MaterialSymbol icon={block.icon} className="text-3xl" />
                </div>
                <h3 className="text-2xl font-black text-white tracking-tighter uppercase text-left">{block.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed text-left">{block.desc}</p>
            </div>
        ))}
      </div>

      {/* Strategic Grant & Google Startup Ecosystem Partners */}
      <div className="space-y-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/10 pb-8">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 block mb-2">
              Non-Dilutive Capital & Google Ecosystem Alignment
            </span>
            <h2 className="text-4xl font-black text-white tracking-tight uppercase">
              5 Strategic Grant & Ecosystem Partners
            </h2>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl px-5 py-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 block">Total Non-Dilutive Pipeline</span>
            <span className="text-xl font-black text-white">$2.4M – $6.35M+ Potential</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Partner Selector List */}
          <div className="lg:col-span-5 space-y-3">
            {GRANT_PARTNERS.map((partner, idx) => {
              const isSelected = partner.id === selectedPartner;
              return (
                <button
                  key={partner.id}
                  onClick={() => setSelectedPartner(partner.id)}
                  className={`w-full text-left p-6 rounded-3xl border transition-all flex items-start gap-4 ${
                    isSelected
                      ? 'bg-indigo-600/15 border-indigo-500 shadow-lg shadow-indigo-500/10'
                      : 'bg-slate-900/60 border-white/5 hover:border-white/15 hover:bg-slate-900'
                  }`}
                >
                  <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-400'
                  }`}>
                    <MaterialSymbol icon={partner.icon} className="text-2xl" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">
                        0{idx + 1} // {partner.category.split(' ')[0]}
                      </span>
                    </div>
                    <h4 className="text-sm font-black text-white leading-snug">{partner.name}</h4>
                    <p className="text-xs font-mono text-emerald-400">{partner.fundingRange}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Partner Deep Dive Card */}
          <div className="lg:col-span-7 bg-slate-900/90 border border-white/10 rounded-[2.5rem] p-8 md:p-10 space-y-8 shadow-2xl flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 block mb-1">
                    {activePartner.category}
                  </span>
                  <h3 className="text-2xl font-black text-white tracking-tight">{activePartner.name}</h3>
                </div>
                <span className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs font-bold">
                  {activePartner.fundingRange}
                </span>
              </div>

              <div className="space-y-2">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Nature of Partnership
                </h4>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {activePartner.partnershipNature}
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Grant Funding & Ecosystem Resources Provided
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {activePartner.resourcesProvided.map((res, i) => (
                    <div key={i} className="bg-slate-950/80 border border-white/5 rounded-2xl p-4 flex items-start gap-3">
                      <MaterialSymbol icon="check_circle" className="text-indigo-400 text-lg shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-300 leading-relaxed">{res}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="bg-indigo-950/30 border border-indigo-500/20 rounded-2xl p-5 space-y-2">
                  <div className="flex items-center gap-2 text-indigo-400">
                    <MaterialSymbol icon="layers" className="text-lg" />
                    <h5 className="text-[10px] font-black uppercase tracking-widest">How Nimb’s Tech Stack is Leveraged</h5>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {activePartner.stackLeverage}
                  </p>
                </div>

                <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-2xl p-5 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <MaterialSymbol icon="bolt" className="text-lg" />
                    <h5 className="text-[10px] font-black uppercase tracking-widest">Architectural Enhancement</h5>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {activePartner.enhancementVector}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#0f172a] border border-white/5 rounded-[4rem] p-12 md:p-20 flex flex-col lg:flex-row gap-16 items-center shadow-2xl overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(79,70,229,0.1)_0%,transparent_60%)]"></div>
        <div className="lg:w-1/2 space-y-8 relative z-10 text-left">
            <h2 className="text-5xl font-black text-white tracking-tighter leading-none uppercase">Systemic <br /> Defensibility</h2>
            <p className="text-slate-400 text-lg leading-relaxed">
                Nimbus IQ isn't just an application. It's an infrastructure layer for the next era of industrial property management. 
                Our moat is built on deterministic outcomes and sovereign data integrity.
            </p>
            <ActionButton className="px-10 py-5" icon={<MaterialSymbol icon="download" />}>Request Full Pro Forma</ActionButton>
        </div>
        <div className="lg:w-1/2 grid grid-cols-2 gap-6 relative z-10 w-full">
            {[
                { label: 'Project Status', val: 'Solid State' },
                { label: 'Compliance', val: 'TRAIGA TX' },
                { label: 'Inference', val: '84 tok/s' },
                { label: 'Rating', val: '4.98/5' }
            ].map((stat, i) => (
                <div key={i} className="p-10 bg-slate-950 border border-white/5 rounded-[2.5rem] flex flex-col justify-center text-center group hover:border-indigo-500/30 transition-colors">
                    <span className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-600 mb-2">{stat.label}</span>
                    <span className="text-xl font-black text-white tracking-tighter">{stat.val}</span>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default InvestorCodex;