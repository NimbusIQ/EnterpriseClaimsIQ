import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type ShamanMode = 'Assistant' | 'Core' | 'Symbiotic';
export type CognitiveState = 'Engaged' | 'Exhausted' | 'Overwhelmed' | 'Idle';

interface NeuroContext {
  isEnabled: boolean;
  cognitiveState: CognitiveState;
  engagementScore: number;
  firewallActive: boolean;
}

interface ShamanContextType {
  mode: ShamanMode;
  intent: string;
  isProcessing: boolean;
  activeAgents: string[];
  neuroContext: NeuroContext;
  setMode: (mode: ShamanMode) => void;
  setIntent: (intent: string) => void;
  spawnAgent: (agentId: string) => void;
  terminateAgent: (agentId: string) => void;
  toggleNeuroContext: () => void;
  toggleFirewall: () => void;
  setCognitiveState: (state: CognitiveState) => void;
  executeAction: (actionId: string) => Promise<void>;
}

const ShamanContext = createContext<ShamanContextType | undefined>(undefined);

export const ShamanProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ShamanMode>('Assistant');
  const [intent, setIntent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeAgents, setActiveAgents] = useState<string[]>([]);
  const [neuroContext, setNeuroContext] = useState<NeuroContext>({
    isEnabled: false,
    cognitiveState: 'Idle',
    engagementScore: 0,
    firewallActive: true,
  });

  const spawnAgent = useCallback((agentId: string) => {
    setActiveAgents(prev => prev.includes(agentId) ? prev : [...prev, agentId]);
  }, []);

  const terminateAgent = useCallback((agentId: string) => {
    setActiveAgents(prev => prev.filter(id => id !== agentId));
  }, []);

  const toggleNeuroContext = useCallback(() => {
    setNeuroContext(prev => ({
      ...prev,
      isEnabled: !prev.isEnabled,
      cognitiveState: !prev.isEnabled ? 'Engaged' : 'Idle',
      engagementScore: !prev.isEnabled ? 75 : 0,
    }));
  }, []);

  const toggleFirewall = useCallback(() => {
    setNeuroContext(prev => ({ ...prev, firewallActive: !prev.firewallActive }));
  }, []);

  const setCognitiveState = useCallback((state: CognitiveState) => {
    setNeuroContext(prev => ({ ...prev, cognitiveState: state }));
  }, []);

  const executeAction = useCallback(async (actionId: string) => {
    setIsProcessing(true);
    console.log(`[SHAMAN] Executing: ${actionId}`);
    
    // Simulate Vision-Action Loop
    // 1. Capture (Context)
    // 2. Reason (Logic)
    // 3. Validate (Firewall)
    
    if (neuroContext.firewallActive && actionId.includes('bypass')) {
      console.error('[FIREWALL] Action blocked: Unauthorized bypass attempt.');
      setIsProcessing(false);
      return;
    }

    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate processing
    
    switch (actionId) {
      case 'cmd_shaman_assistant': setMode('Assistant'); break;
      case 'cmd_shaman_core': setMode('Core'); break;
      case 'cmd_shaman_symbiotic': setMode('Symbiotic'); break;
      case 'cmd_toggle_neurocontext': toggleNeuroContext(); break;
      case 'cmd_toggle_firewall': toggleFirewall(); break;
      default: break;
    }
    
    setIsProcessing(false);
  }, [neuroContext.firewallActive, toggleNeuroContext, toggleFirewall]);

  return (
    <ShamanContext.Provider value={{
      mode, intent, isProcessing, activeAgents, neuroContext,
      setMode, setIntent, spawnAgent, terminateAgent,
      toggleNeuroContext, toggleFirewall, setCognitiveState, executeAction
    }}>
      {children}
    </ShamanContext.Provider>
  );
};

export const useShaman = () => {
  const context = useContext(ShamanContext);
  if (!context) throw new Error('useShaman must be used within a ShamanProvider');
  return context;
};
