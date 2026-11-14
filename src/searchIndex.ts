export interface SearchItem {
  id: string;
  title: string;
  description: string;
  category: 'Feature' | 'Documentation' | 'Page' | 'System';
  path: string;
  keywords: string[];
  type?: 'navigation' | 'action';
}

export const searchIndex: SearchItem[] = [
  // Pages
  { id: 'landing', title: 'Home', description: 'The main landing page of Sovereign AI Tools.', category: 'Page', path: 'landing', keywords: ['home', 'start', 'nimbus'], type: 'navigation' },
  { id: 'about', title: 'About Us', description: 'Learn about Nimbus IQ and our mission.', category: 'Page', path: 'about', keywords: ['about', 'mission', 'company', 'team'], type: 'navigation' },
  { id: 'mission_control', title: 'Mission Control', description: 'Access all AI agents and developer tools.', category: 'Page', path: 'mission_control', keywords: ['dashboard', 'grid', 'tools', 'agents'], type: 'navigation' },
  { id: 'the_brain', title: 'The Brain', description: 'The central cognitive hub of the ecosystem.', category: 'Page', path: 'the_brain', keywords: ['brain', 'core', 'intelligence'], type: 'navigation' },
  { id: 'fde_blueprint', title: 'FDE Blueprint', description: 'Conceptual framework for Forward Deployed Engineering models.', category: 'Page', path: 'fde_blueprint', keywords: ['fde', 'blueprint', 'data', 'pipeline', 'engineering', 'forward'], type: 'navigation' },
  { id: 'investor_codex', title: 'Investor Codex', description: 'Financial data and investor relations.', category: 'Page', path: 'investor_codex', keywords: ['investor', 'finance', 'stocks', 'equity'], type: 'navigation' },
  { id: 'contact', title: 'Contact', description: 'Get in touch with the Nimbus IQ team.', category: 'Page', path: 'contact', keywords: ['contact', 'support', 'email', 'help'], type: 'navigation' },

  // Features
  { id: 'claim_core', title: 'ClaimCore Agent', description: 'Aggressive insurance supplement specialist with code citation.', category: 'Feature', path: 'claim_core', keywords: ['insurance', 'claim', 'legal', 'audit'], type: 'navigation' },
  { id: 'image_studio', title: '4K Forensic Lab', description: '2K/4K visual damage classification and forensic heatmap labels.', category: 'Feature', path: 'image_studio', keywords: ['image', 'photo', 'forensic', 'vision', 'damage'], type: 'navigation' },
  { id: 'icon_factory', title: 'Icon Factory', description: 'Generate custom sovereign-styled icons and UI assets.', category: 'Feature', path: 'icon_factory', keywords: ['icon', 'logo', 'design', 'assets'], type: 'navigation' },
  { id: 'nancye_assistant', title: 'AI Admin Nancye', description: 'Sovereign voice assistant for dispatch, billing, and scheduling.', category: 'Feature', path: 'nancye_assistant', keywords: ['admin', 'assistant', 'voice', 'scheduling', 'billing'], type: 'navigation' },
  { id: 'video_studio', title: 'Motion Lab', description: 'Cinematic temporal synthesis via Veo 3 engine.', category: 'Feature', path: 'video_studio', keywords: ['video', 'movie', 'motion', 'veo'], type: 'navigation' },
  { id: 'audio_studio', title: 'Vocal Studio', description: 'Ultra-low latency live sensory interaction.', category: 'Feature', path: 'audio_studio', keywords: ['audio', 'voice', 'sound', 'music'], type: 'navigation' },
  { id: 'architecture_studio', title: 'AAMA Architect', description: 'Brainstorm infrastructure via voice and render 4K blueprints.', category: 'Feature', path: 'architecture_studio', keywords: ['architecture', 'blueprint', 'design', 'build'], type: 'navigation' },
  { id: 'neural_memory', title: 'Neural Memory', description: 'Multimodal embedding generation for text, vision, and acoustic data.', category: 'Feature', path: 'neural_memory', keywords: ['memory', 'embeddings', 'neural', 'data'], type: 'navigation' },
  { id: 'knowledge_base', title: 'Neural Library', description: 'Technical documentation and system logic specs.', category: 'Feature', path: 'knowledge_base', keywords: ['docs', 'documentation', 'help', 'library'], type: 'navigation' },
  { id: 'chatbot', title: 'Prime Chatbot', description: 'Direct interface with the Sovereign Prime AI.', category: 'Feature', path: 'chatbot', keywords: ['chat', 'ai', 'prime', 'assistant'], type: 'navigation' },
  { id: 'agent_marketplace', title: 'Agent Marketplace', description: 'Browse and deploy specialized AI agents.', category: 'Feature', path: 'agent_marketplace', keywords: ['marketplace', 'store', 'agents', 'deploy'], type: 'navigation' },
  { id: 'agent_canvas', title: 'Live Agent Canvas', description: 'Real-time orchestration and visualization of multi-agent swarms.', category: 'Feature', path: 'agent_canvas', keywords: ['canvas', 'swarm', 'orchestration', 'live'], type: 'navigation' },

  // System Commands
  { id: 'cmd_shaman_assistant', title: 'Activate Assistant Mode', description: 'Switch Shaman Kernel to reactive Assistant mode.', category: 'System', path: 'shaman:assistant', keywords: ['shaman', 'mode', 'assistant'], type: 'action' },
  { id: 'cmd_shaman_core', title: 'Activate Core Mode', description: 'Switch Shaman Kernel to proactive Core mode.', category: 'System', path: 'shaman:core', keywords: ['shaman', 'mode', 'core'], type: 'action' },
  { id: 'cmd_shaman_symbiotic', title: 'Activate Symbiotic Mode', description: 'Switch Shaman Kernel to autonomous Symbiotic mode.', category: 'System', path: 'shaman:symbiotic', keywords: ['shaman', 'mode', 'symbiotic'], type: 'action' },
  { id: 'cmd_toggle_neurocontext', title: 'Toggle NeuroContext BCI', description: 'Enable/Disable brain-driven cognitive state interpretation.', category: 'System', path: 'shaman:neurocontext', keywords: ['neuro', 'context', 'bci', 'brain'], type: 'action' },
  { id: 'cmd_toggle_firewall', title: 'Toggle System Firewall', description: 'Enable/Disable the security guardrails and firewall.', category: 'System', path: 'shaman:firewall', keywords: ['firewall', 'security', 'guardrails'], type: 'action' },
  { id: 'cmd_clear_cache', title: 'Clear Neural Cache', description: 'Flush local embedding cache and refresh state.', category: 'System', path: 'system:clear_cache', keywords: ['clear', 'cache', 'reset'], type: 'action' },
  { id: 'cmd_toggle_theme', title: 'Toggle UltraVert Theme', description: 'Switch between Light and Dark sovereign aesthetics.', category: 'System', path: 'system:toggle_theme', keywords: ['theme', 'dark', 'light'], type: 'action' },

  // Documentation Sections
  { id: 'os-curriculum', title: 'OS Curriculum', description: 'Pedagogical framework for PropTech administrative intelligence.', category: 'Documentation', path: 'knowledge_base', keywords: ['curriculum', 'learning', 'training', 'os'], type: 'navigation' },
  { id: 'agentic-pedagogy', title: 'Agentic Pedagogy', description: 'AG2AG logic and self-refining pedagogical loops.', category: 'Documentation', path: 'knowledge_base', keywords: ['pedagogy', 'teaching', 'logic', 'ag2ag', 'training'], type: 'navigation' },
  { id: 'agent-training-manual', title: 'Agent Training Manual', description: 'Instructional guide for forging sovereign agents via the Photonic-Void methodology.', category: 'Documentation', path: 'knowledge_base', keywords: ['train', 'agent', 'methodology', 'instruction', 'curriculum', 'how-to'], type: 'navigation' },
  { id: 'safety-foundation', title: 'Safety Foundation', description: 'Security pillars and cryptographic verification signatures.', category: 'Documentation', path: 'knowledge_base', keywords: ['safety', 'security', 'hardening', 'verification'], type: 'navigation' },
  { id: 'python-quantum-logic', title: 'Quantum Logic', description: 'Python-centric backend stack and quantum state machines.', category: 'Documentation', path: 'knowledge_base', keywords: ['python', 'quantum', 'backend', 'logic'], type: 'navigation' },
];
