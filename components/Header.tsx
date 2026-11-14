import React, { useState, useMemo, useRef, useEffect } from 'react';
import { MaterialSymbol } from './icons';
import Fuse from 'fuse.js';
import { searchIndex, SearchItem } from '../src/searchIndex';
import { useShaman } from '../src/context/ShamanContext';

interface HeaderProps {
  onLogoClick: () => void;
  onNavigate: (page: string) => void;
  activePage: string;
  showBackArrow: boolean;
  onCommandPaletteOpen: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogoClick, onNavigate, activePage, showBackArrow, onCommandPaletteOpen }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const shaman = useShaman();

  const fuse = useMemo(() => new Fuse(searchIndex, {
    keys: ['title', 'description', 'keywords'],
    threshold: 0.4,
    includeMatches: true
  }), []);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return fuse.search(searchQuery).slice(0, 6) as any[];
  }, [searchQuery, fuse]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === '/' && !isSearchFocused && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        event.preventDefault();
        setIsSearchFocused(true);
        // Focus the input element
        const input = searchRef.current?.querySelector('input');
        input?.focus();
      }
      if (event.key === 'Escape' && isSearchFocused) {
        setIsSearchFocused(false);
        const input = searchRef.current?.querySelector('input');
        input?.blur();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isSearchFocused]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResultClick = (item: SearchItem) => {
    if (item.type === 'navigation') {
      onNavigate(item.path);
    } else if (item.type === 'action') {
      shaman.executeAction(item.id);
    }
    setSearchQuery('');
    setIsSearchFocused(false);
  };

  const navItems = [
    { id: 'landing', label: 'Home' },
    { id: 'claims_dashboard', label: 'Nexus Portal' },
    { id: 'fde_blueprint', label: 'FDE Blueprint' },
    { id: 'mission_control', label: 'Iron Dome' },
    { id: 'the_brain', label: 'Sovereign Core' },
    { id: 'investor_codex', label: 'Investor Codex' },
  ];

  return (
    <header className="bg-slate-950/30 backdrop-blur-3xl border-b border-white/10 sticky top-0 z-[100]">
      <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        <div onClick={onLogoClick} className="flex items-center cursor-pointer group">
            <div className="flex items-center transition-transform duration-300 hover:scale-[1.02]">
                {showBackArrow && (
                    <div className="mr-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5">
                        <MaterialSymbol icon="arrow_back" className="text-slate-400 group-hover:text-indigo-400" />
                    </div>
                )}
                <div className="relative">
                    <img src="https://storage.googleapis.com/aistudio-ux-team-data/demos/nimbus-logo.png" alt="Nimbus IQ Logo" className="h-10 w-10 mr-4 drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
                    <div className="absolute -top-1 -right-1 h-3 w-3 bg-emerald-500 border-2 border-slate-950 rounded-full animate-pulse"></div>
                </div>
                <div className="hidden xs:block">
                    <h1 className="text-xl font-black text-white tracking-tighter uppercase">NIMBUS <span className="text-indigo-500">IQ</span></h1>
                    <p className="text-[8px] uppercase tracking-[0.3em] font-black text-slate-500 mt-0.5">Sovereign AI OS</p>
                </div>
            </div>
        </div>

        <nav className="hidden xl:flex items-center bg-slate-900/50 p-1.5 rounded-2xl border border-white/5 shadow-inner">
            {navItems.map(item => (
                <button key={item.id} onClick={() => onNavigate(item.id)} className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activePage === item.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>{item.label}</button>
            ))}
        </nav>

        {/* Global Search Bar */}
        <div className="hidden lg:flex flex-1 max-w-md mx-8 relative" ref={searchRef}>
            <div className={`w-full flex items-center bg-slate-900/50 border rounded-2xl transition-all duration-300 ${isSearchFocused ? 'border-indigo-500/50 ring-4 ring-indigo-500/10' : 'border-white/5'}`}>
                <MaterialSymbol icon="search" className={`ml-4 text-lg ${isSearchFocused ? 'text-indigo-400' : 'text-slate-500'}`} />
                <input 
                    type="text" 
                    placeholder="Search features, docs, agents..." 
                    className="w-full bg-transparent border-none focus:ring-0 text-xs font-bold text-white placeholder:text-slate-600 px-3 py-2.5"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                />
                {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="mr-3 text-slate-500 hover:text-white">
                        <MaterialSymbol icon="close" className="text-sm" />
                    </button>
                )}
            </div>

            {/* Search Results Dropdown */}
            {isSearchFocused && searchQuery.trim() !== '' && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    {searchResults.length > 0 ? (
                        <div className="p-2">
                            {searchResults.map(({ item }) => (
                                <button 
                                    key={item.id} 
                                    onClick={() => handleResultClick(item)}
                                    className="w-full flex items-start gap-4 p-3 rounded-xl hover:bg-white/5 text-left transition-colors group"
                                >
                                    <div className="mt-1 p-2 rounded-lg bg-slate-800 group-hover:bg-indigo-500/20 text-slate-400 group-hover:text-indigo-400 transition-colors">
                                        <MaterialSymbol icon={item.category === 'Feature' ? 'extension' : item.category === 'Documentation' ? 'menu_book' : 'layers'} className="text-lg" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-0.5">
                                            <span className="text-xs font-black text-white uppercase tracking-tight truncate">{item.title}</span>
                                            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-600 bg-slate-800 px-1.5 py-0.5 rounded">{item.category}</span>
                                        </div>
                                        <p className="text-[10px] text-slate-500 line-clamp-1 font-medium">{item.description}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center">
                            <MaterialSymbol icon="search_off" className="text-4xl text-slate-700 mb-3" />
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">No results found for "{searchQuery}"</p>
                        </div>
                    )}
                    <div className="bg-slate-800/50 p-3 border-t border-slate-800 flex justify-between items-center">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600">Sovereign Search v1.0</span>
                        <div className="flex gap-2">
                            <span className="text-[9px] font-mono text-slate-600 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700">ESC to close</span>
                        </div>
                    </div>
                </div>
            )}
        </div>

        <div className="flex items-center gap-2 md:gap-4">
            <button 
                onClick={onCommandPaletteOpen} 
                className="p-3 bg-white/5 text-slate-400 hover:text-white rounded-xl border border-white/5 hover:border-white/10 transition-all group"
                title="Command Palette (CMD+K)"
            >
                <MaterialSymbol icon="terminal" className="text-xl group-hover:scale-110 transition-transform" />
            </button>
            <button onClick={() => setIsDark(!isDark)} className="p-3 text-slate-500 hover:text-indigo-400 transition-colors hidden sm:block">
                <MaterialSymbol icon={isDark ? "dark_mode" : "light_mode"} className="text-xl" />
            </button>
            <button onClick={() => onNavigate('chatbot')} className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-all shadow-lg active:scale-95 group border border-indigo-400/30">
                <MaterialSymbol icon="smart_toy" className="text-xl group-hover:rotate-12 transition-transform" />
            </button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="xl:hidden p-3 text-slate-400 hover:text-white transition-colors">
                <MaterialSymbol icon={isMenuOpen ? "close" : "menu"} className="text-2xl" />
            </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="xl:hidden bg-slate-950 border-b border-white/10 animate-slide-in-bottom">
            <div className="flex flex-col p-4 gap-2">
                {navItems.map(item => (
                    <button key={item.id} onClick={() => { onNavigate(item.id); setIsMenuOpen(false); }} className={`p-4 text-left text-xs font-black uppercase tracking-widest rounded-xl ${activePage === item.id ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' : 'text-slate-500'}`}>{item.label}</button>
                ))}
            </div>
        </div>
      )}
    </header>
  );
};

export default Header;