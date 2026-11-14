import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Command, Search, Navigation, Zap, Settings, Terminal, X, ChevronRight } from 'lucide-react';
import Fuse from 'fuse.js';
import { searchIndex, SearchItem } from '../src/searchIndex';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
  onAction: (actionId: string) => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onNavigate, onAction }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const fuse = useMemo(() => new Fuse(searchIndex, {
    keys: ['title', 'description', 'keywords'],
    threshold: 0.3,
  }), []);

  const results = useMemo(() => {
    if (!query) return searchIndex.slice(0, 8);
    return fuse.search(query).map(r => r.item).slice(0, 8);
  }, [query, fuse]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % results.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleSelect(results[selectedIndex]);
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose]);

  const handleSelect = (item: SearchItem) => {
    if (item.type === 'navigation') {
      onNavigate(item.path);
    } else if (item.type === 'action') {
      onAction(item.id);
    }
    onClose();
  };

  const getIcon = (category: string) => {
    switch (category) {
      case 'Page': return <Navigation className="w-4 h-4" />;
      case 'Feature': return <Zap className="w-4 h-4" />;
      case 'Documentation': return <Search className="w-4 h-4" />;
      case 'System': return <Terminal className="w-4 h-4" />;
      default: return <Command className="w-4 h-4" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="w-full max-w-2xl bg-slate-900/90 border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-2xl relative z-10"
          >
            <div className="flex items-center px-4 py-4 border-b border-white/5">
              <Search className="w-5 h-5 text-slate-400 mr-3" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Type a command or search..."
                className="flex-grow bg-transparent border-none outline-none text-white placeholder-slate-500 text-lg font-medium"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[10px] text-slate-400 font-mono">ESC</kbd>
                <button onClick={onClose} className="p-1 hover:bg-white/5 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-2 custom-scrollbar">
              {results.length > 0 ? (
                <div className="space-y-1">
                  {results.map((item, index) => (
                    <button
                      key={item.id}
                      className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all text-left group ${
                        index === selectedIndex ? 'bg-indigo-500/20 border border-indigo-500/30' : 'hover:bg-white/5 border border-transparent'
                      }`}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setSelectedIndex(index)}
                    >
                      <div className={`p-2 rounded-lg ${
                        index === selectedIndex ? 'bg-indigo-500 text-white' : 'bg-white/5 text-slate-400 group-hover:text-white'
                      }`}>
                        {getIcon(item.category)}
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white tracking-tight">{item.title}</span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-black uppercase tracking-widest ${
                            item.category === 'System' ? 'bg-amber-500/20 text-amber-400' :
                            item.category === 'Feature' ? 'bg-indigo-500/20 text-indigo-400' :
                            'bg-white/10 text-slate-400'
                          }`}>
                            {item.category}
                          </span>
                          {item.id === 'cmd_toggle_neurocontext' && (
                            <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${
                              // This is a bit hacky since we don't have the state here, but we can pass it as a prop if needed
                              'bg-white/5 text-slate-500'
                            }`}>
                              BCI
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{item.description}</p>
                      </div>
                      <ChevronRight className={`w-4 h-4 transition-transform ${
                        index === selectedIndex ? 'text-indigo-400 translate-x-1' : 'text-slate-600 opacity-0'
                      }`} />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <Terminal className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                  <p className="text-slate-500 font-medium">No sovereign commands found for "{query}"</p>
                </div>
              )}
            </div>

            <div className="px-4 py-3 bg-black/20 border-t border-white/5 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5"><Navigation className="w-3 h-3" /> Select</span>
                <span className="flex items-center gap-1.5"><Zap className="w-3 h-3" /> Execute</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-indigo-500/60">Nimbus IQ UltraVert OS</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
