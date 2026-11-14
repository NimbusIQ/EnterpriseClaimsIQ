import React, { useState } from 'react';
import { PageTitle, ActionButton } from '../components/shared';
import { MaterialSymbol } from '../components/icons';
import { embedMultimodalContent } from '../services/geminiService';

const NeuralMemory: React.FC = () => {
    const [text, setText] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [audio, setAudio] = useState<string | null>(null);
    const [embeddings, setEmbeddings] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAudio(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const generateEmbeddings = async () => {
        setLoading(true);
        setError(null);
        try {
            const contents: any[] = [];
            
            if (text) {
                contents.push(text);
            }
            
            if (image) {
                const base64Data = image.split(',')[1];
                const mimeType = image.split(';')[0].split(':')[1];
                contents.push({
                    inlineData: {
                        data: base64Data,
                        mimeType: mimeType
                    }
                });
            }
            
            if (audio) {
                const base64Data = audio.split(',')[1];
                const mimeType = audio.split(';')[0].split(':')[1];
                contents.push({
                    inlineData: {
                        data: base64Data,
                        mimeType: mimeType
                    }
                });
            }

            if (contents.length === 0) {
                throw new Error('Please provide at least one input (text, image, or audio).');
            }

            const result = await embedMultimodalContent(contents);
            setEmbeddings(result);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to generate embeddings');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col space-y-12 py-10 animate-fade-in">
            <PageTitle 
                title="Neural Memory Engine" 
                subtitle="Multimodal embedding generation for text, vision, and acoustic data." 
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-8">
                    <div className="bg-slate-900/40 border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-xl shadow-2xl">
                        <h3 className="text-sm font-black uppercase tracking-[0.3em] text-indigo-400 mb-8 flex items-center gap-3">
                            <MaterialSymbol icon="input" />
                            Multimodal Input
                        </h3>

                        <div className="space-y-6">
                            {/* Text Input */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Contextual Text</label>
                                <textarea 
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    placeholder="Enter descriptive text for the neural vector..."
                                    className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 text-sm focus:border-indigo-500/50 outline-none transition-all h-32 resize-none"
                                />
                            </div>

                            {/* Image Upload */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Visual Data (PNG/JPG)</label>
                                <div className="relative group">
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                    />
                                    <div className="bg-slate-950 border border-dashed border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 group-hover:border-indigo-500/30 transition-all">
                                        {image ? (
                                            <img src={image} alt="Preview" className="h-32 w-full object-cover rounded-xl" />
                                        ) : (
                                            <>
                                                <MaterialSymbol icon="add_a_photo" className="text-3xl text-slate-700" />
                                                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Drop image or click</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Audio Upload */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Acoustic Data (MP3/WAV)</label>
                                <div className="relative group">
                                    <input 
                                        type="file" 
                                        accept="audio/*"
                                        onChange={handleAudioUpload}
                                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                    />
                                    <div className="bg-slate-950 border border-dashed border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 group-hover:border-indigo-500/30 transition-all">
                                        {audio ? (
                                            <div className="flex items-center gap-4 w-full">
                                                <MaterialSymbol icon="audiotrack" className="text-2xl text-indigo-500" />
                                                <span className="text-[10px] font-bold text-slate-400 uppercase truncate">Audio File Loaded</span>
                                            </div>
                                        ) : (
                                            <>
                                                <MaterialSymbol icon="mic" className="text-3xl text-slate-700" />
                                                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Drop audio or click</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <ActionButton 
                                onClick={generateEmbeddings}
                                isLoading={loading}
                                className="w-full py-6 bg-indigo-600 text-white font-black uppercase tracking-[0.3em] shadow-2xl shadow-indigo-600/20"
                                icon={<MaterialSymbol icon="memory" />}
                            >
                                Generate Neural Vector
                            </ActionButton>

                            {error && (
                                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-[10px] font-bold uppercase tracking-widest text-center">
                                    {error}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-slate-900/40 border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-xl shadow-2xl h-full flex flex-col">
                        <h3 className="text-sm font-black uppercase tracking-[0.3em] text-emerald-400 mb-8 flex items-center gap-3">
                            <MaterialSymbol icon="analytics" />
                            Embedding Output
                        </h3>

                        {embeddings ? (
                            <div className="flex-grow space-y-6">
                                <div className="bg-slate-950 border border-white/5 rounded-2xl p-6 font-mono text-[10px] text-emerald-400/70 overflow-y-auto max-h-[500px] custom-scrollbar">
                                    <div className="grid grid-cols-4 gap-2">
                                        {embeddings.map((emb: any, idx: number) => (
                                            <div key={idx} className="flex flex-col gap-1">
                                                <span className="text-[8px] text-slate-700">V_{idx}</span>
                                                <span className="truncate">{emb.values.slice(0, 5).join(', ')}...</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Vector Dimensions</span>
                                        <span className="text-lg font-black text-white">768 x {embeddings.length}</span>
                                    </div>
                                    <div className="flex flex-col text-right">
                                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Model</span>
                                        <span className="text-xs font-bold text-indigo-400">gemini-embedding-2-preview</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-grow flex flex-col items-center justify-center text-center space-y-4 opacity-30">
                                <MaterialSymbol icon="data_exploration" className="text-6xl text-slate-700" />
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">Awaiting Neural Inference</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NeuralMemory;
