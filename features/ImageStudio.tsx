import React, { useState, useRef, useEffect } from 'react';
import { PageTitle, ActionButton, LoadingState, ErrorState, TabGroup, Tab } from '../components/shared';
import { MaterialSymbol } from '../components/icons';
import { GoogleGenAI } from '@google/genai';
import { fileToBase64 } from '../utils/media';

type AspectRatio = '1:1' | '2:3' | '3:2' | '3:4' | '4:3' | '9:16' | '16:9' | '21:9';
type ImageSize = '1K' | '2K' | '4K';
type StudioMode = 'generate' | 'edit';

const AISignature = () => (
    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between opacity-50 select-none pointer-events-none">
        <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-indigo-300">Sovereign Visual Engine</span>
        </div>
        <div className="flex items-center gap-1.5 grayscale">
            <img src="https://storage.googleapis.com/aistudio-ux-team-data/demos/nimbus-logo.png" className="h-3 w-3" alt="IQ" />
            <span className="text-[7px] font-mono tracking-tighter">NI_IMG_{Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
        </div>
    </div>
);

const ImageStudio: React.FC = () => {
    const [apiKeySelected, setApiKeySelected] = useState(false);
    const [isCheckingKey, setIsCheckingKey] = useState(true);
    const [mode, setMode] = useState<StudioMode>('generate');
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // Config
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
    const [imageSize, setImageSize] = useState<ImageSize>('1K');
    
    // Ingress
    const [foundationImage, setFoundationImage] = useState<string | null>(null);
    const [foundationMime, setFoundationMime] = useState<string>('image/png');
    
    // Results
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const checkKey = async () => {
            const hasKey = await window.aistudio.hasSelectedApiKey();
            setApiKeySelected(hasKey);
            setIsCheckingKey(false);
        };
        checkKey();
    }, []);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFoundationImage(reader.result as string);
                setFoundationMime(file.type);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleExecute = async () => {
        if (!prompt.trim() && mode === 'generate') return;
        setIsLoading(true);
        setError(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
            
            if (mode === 'generate') {
                // Nano Banana Pro Generation
                const response = await ai.models.generateContent({
                    model: 'gemini-3-pro-image-preview',
                    contents: { parts: [{ text: prompt }] },
                    config: {
                        imageConfig: { aspectRatio, imageSize },
                        tools: [{ googleSearch: {} }] // Real-time grounding for accuracy
                    }
                });

                for (const part of response.candidates[0].content.parts) {
                    if (part.inlineData) {
                        setGeneratedImage(`data:image/png;base64,${part.inlineData.data}`);
                    }
                }
            } else {
                // Gemini 2.5 Flash Image Editing
                if (!foundationImage) throw new Error("Editing foundation image required.");
                
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash-image',
                    contents: {
                        parts: [
                            { inlineData: { data: foundationImage.split(',')[1], mimeType: foundationMime } },
                            { text: prompt || "Refine and improve image quality." }
                        ]
                    }
                });

                for (const part of response.candidates[0].content.parts) {
                    if (part.inlineData) {
                        setGeneratedImage(`data:image/png;base64,${part.inlineData.data}`);
                    }
                }
            }
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Visual synthesis failure.';
            if (msg.includes("Requested entity was not found")) {
                setApiKeySelected(false);
                setError("API key reset. Please re-authorize.");
            } else {
                setError(msg);
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (isCheckingKey) return <LoadingState message="Scanning Neural Credentials..." />;

    if (!apiKeySelected) {
        return (
            <div className="flex flex-col items-center justify-center py-32 text-center max-w-2xl mx-auto space-y-12 animate-fade-in relative z-20">
                <div className="p-10 bg-indigo-500/10 rounded-[4rem] border border-indigo-500/20 shadow-2xl relative">
                    <MaterialSymbol icon="image_lock" className="text-8xl text-indigo-400" />
                </div>
                <div className="space-y-4">
                    <h2 className="text-5xl font-black text-white tracking-tighter uppercase liquid-chrome">Authorize Nano Banana Pro</h2>
                    <p className="text-slate-400 text-lg">High-fidelity 4K visual synthesis requires a paid GCP project.</p>
                </div>
                <ActionButton onClick={() => window.aistudio.openSelectKey()} variant="primary" className="px-16 py-7 text-xl" icon={<MaterialSymbol icon="vpn_key" />}>
                    Connect Visual Pipeline
                </ActionButton>
                <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="text-[10px] font-black uppercase text-slate-500 hover:text-indigo-400 tracking-widest transition-colors">Billing Documentation</a>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full animate-fade-in space-y-8 relative z-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <PageTitle title="Sovereign Visual Studio" subtitle="Generate 4K assets or perform forensic image editing." />
                
                <div className="flex items-center gap-4 bg-slate-900/60 p-2 rounded-2xl border border-white/10 backdrop-blur-xl mb-10">
                    <div className="flex items-center gap-2 px-3 border-r border-white/10">
                        <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">RES</span>
                        <select value={imageSize} onChange={e => setImageSize(e.target.value as ImageSize)} className="bg-transparent text-[10px] font-black uppercase text-indigo-400 outline-none cursor-pointer">
                            <option value="1K" className="bg-slate-900">1K Standard</option>
                            <option value="2K" className="bg-slate-900">2K Precision</option>
                            <option value="4K" className="bg-slate-900">4K Sovereign</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2 px-3">
                        <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Ratio</span>
                        <select value={aspectRatio} onChange={e => setAspectRatio(e.target.value as AspectRatio)} className="bg-transparent text-[10px] font-black uppercase text-indigo-400 outline-none cursor-pointer">
                            {['1:1', '2:3', '3:2', '3:4', '4:3', '9:16', '16:9', '21:9'].map(r => <option key={r} value={r} className="bg-slate-900">{r}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            <TabGroup>
                <Tab label="Generate" icon="add_photo_alternate" isActive={mode === 'generate'} onClick={() => setMode('generate')} />
                <Tab label="Edit Foundation" icon="image_edit" isActive={mode === 'edit'} onClick={() => setMode('edit')} />
            </TabGroup>

            <div className="flex flex-col lg:flex-row gap-10 flex-grow">
                <div className="lg:w-[450px] shrink-0 space-y-8">
                    <div className="glass-panel rounded-[3rem] p-10 space-y-10 shadow-2xl relative overflow-hidden">
                        {mode === 'edit' && (
                            <div className="space-y-6">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Foundation Buffer</label>
                                <div 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="relative h-56 bg-slate-950/50 border-2 border-dashed border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500/50 transition-all group overflow-hidden"
                                >
                                    {foundationImage ? (
                                        <img src={foundationImage} className="w-full h-full object-cover animate-fade-in" />
                                    ) : (
                                        <>
                                            <MaterialSymbol icon="upload_file" className="text-5xl text-slate-700 group-hover:text-indigo-400 mb-4" />
                                            <span className="text-[9px] font-black uppercase text-slate-600 tracking-[0.3em]">Ingest Ingress</span>
                                        </>
                                    )}
                                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
                                </div>
                            </div>
                        )}

                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Linguistic Vector</label>
                            <textarea 
                                value={prompt} 
                                onChange={e => setPrompt(e.target.value)} 
                                placeholder={mode === 'generate' ? "Define visual manifestation..." : "Define modifications (e.g., 'Add filter', 'Remove debris')..."}
                                className="w-full bg-slate-950/50 border border-white/10 rounded-3xl p-6 text-sm text-white outline-none focus:border-indigo-500/50 min-h-[120px] resize-none"
                            />
                        </div>

                        <ActionButton 
                            onClick={handleExecute} 
                            isLoading={isLoading} 
                            className="w-full py-8 text-xl uppercase tracking-widest shadow-indigo-600/20"
                            icon={<MaterialSymbol icon={mode === 'generate' ? 'bolt' : 'auto_fix_high'} />}
                        >
                            {mode === 'generate' ? 'Manifest' : 'Transform'}
                        </ActionButton>
                    </div>
                </div>

                <div className="flex-grow">
                    <div className="h-full glass-panel rounded-[4rem] p-12 flex flex-col shadow-inner relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.03)_0%,transparent_70%)]"></div>
                        <div className="flex-grow flex flex-col items-center justify-center bg-black/40 rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl relative">
                            {isLoading ? (
                                <LoadingState message="Visual Synthesis" details="Utilizing Sovereign Cloud cluster nodes for 4K neural rendering." />
                            ) : error ? (
                                <ErrorState error={error} />
                            ) : generatedImage ? (
                                <div className="w-full h-full flex flex-col items-center justify-center p-12 animate-pop-in">
                                    <img src={generatedImage} className="max-h-full max-w-full rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-white/10 object-contain" />
                                    <div className="mt-12 flex gap-8">
                                        <ActionButton variant="secondary" className="px-10 h-16 text-xs uppercase tracking-widest" icon={<MaterialSymbol icon="download" />} onClick={() => window.open(generatedImage)}>Export Asset</ActionButton>
                                        <ActionButton variant="secondary" className="px-10 h-16 text-xs uppercase tracking-widest" icon={<MaterialSymbol icon="cloud_done" />} onClick={() => setFoundationImage(generatedImage)}>Set as Foundation</ActionButton>
                                    </div>
                                    <div className="w-full max-w-4xl"><AISignature /></div>
                                </div>
                            ) : (
                                <div className="text-center space-y-6 opacity-10 grayscale group-hover:opacity-20 transition-opacity">
                                    <MaterialSymbol icon="palette" className="text-[160px]" />
                                    <p className="text-sm font-black uppercase tracking-[1em]">Awaiting Manifestation</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageStudio;