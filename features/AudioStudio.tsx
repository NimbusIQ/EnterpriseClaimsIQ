import React, { useState, useRef, useEffect } from 'react';
import { PageTitle, Tab, TabGroup, ActionButton, ErrorState, LoadingState } from '../components/shared';
import { MaterialSymbol } from '../components/icons';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { encode, decode, decodeAudioData } from '../utils/media';

type ActiveTab = 'live-intelligence' | 'transcription' | 'neural-tts';

interface MediaBlob {
  data: string;
  mimeType: string;
}

const AISignature = () => (
    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between opacity-50 select-none pointer-events-none">
        <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-indigo-300">Aural Matrix Verified</span>
        </div>
        <div className="flex items-center gap-1.5 grayscale">
            <img src="https://storage.googleapis.com/aistudio-ux-team-data/demos/nimbus-logo.png" className="h-3 w-3" alt="IQ" />
            <span className="text-[7px] font-mono tracking-tighter">NI_AUD_{Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
        </div>
    </div>
);

const AudioStudio: React.FC = () => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('live-intelligence');

    return (
        <div className="flex flex-col h-full space-y-10 animate-fade-in">
            <PageTitle title="Sub-Modal Aural Studio" subtitle="Real-time conversational intelligence and forensic vocal synthesis." />
            <TabGroup>
                <Tab label="Live Intelligence" icon="record_voice_over" isActive={activeTab === 'live-intelligence'} onClick={() => setActiveTab('live-intelligence')} />
                <Tab label="Transcription" icon="speech_to_text" isActive={activeTab === 'transcription'} onClick={() => setActiveTab('transcription')} />
                <Tab label="Neural TTS" icon="graphic_eq" isActive={activeTab === 'neural-tts'} onClick={() => setActiveTab('neural-tts')} />
            </TabGroup>
            <div className="flex-grow">
                {activeTab === 'live-intelligence' && <LiveIntelligence />}
                {activeTab === 'transcription' && <TranscriptionModule />}
                {activeTab === 'neural-tts' && <NeuralTTS />}
            </div>
        </div>
    );
};

const TranscriptionModule: React.FC = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState<string | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<BlobPart[]>([]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            mediaRecorderRef.current.ondataavailable = (e) => chunksRef.current.push(e.data);
            mediaRecorderRef.current.onstop = async () => {
                const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
                chunksRef.current = [];
                processTranscription(audioBlob);
            };
            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (e) { setError("Microphone ingress denied."); }
    };

    const stopRecording = () => {
        mediaRecorderRef.current?.stop();
        mediaRecorderRef.current?.stream.getTracks().forEach(t => t.stop());
        setIsRecording(false);
    };

    const processTranscription = async (audioBlob: Blob) => {
        setIsLoading(true);
        try {
            const reader = new FileReader();
            reader.readAsDataURL(audioBlob);
            reader.onloadend = async () => {
                const base64Data = (reader.result as string).split(',')[1];
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
                const response = await ai.models.generateContent({
                    model: 'gemini-3-flash-preview',
                    contents: [
                        { parts: [{ inlineData: { data: base64Data, mimeType: 'audio/webm' } }, { text: "Transcribe this audio precisely. Output formatted text." }] }
                    ]
                });
                setTranscript(response.text || "Transcription yielded null result.");
                setIsLoading(false);
            };
        } catch (e) { setError("Transcription synthesis failed."); setIsLoading(false); }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-fade-in">
            <div className="bg-slate-900 border border-white/5 rounded-[3.5rem] p-12 flex flex-col items-center justify-center space-y-10 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-indigo-500/5"></div>
                <div className={`p-16 rounded-full border-4 transition-all duration-700 ${isRecording ? 'border-indigo-500 animate-pulse bg-indigo-500/10' : 'border-white/10 bg-white/5'}`}>
                    <MaterialSymbol icon={isRecording ? "hearing" : "mic"} className={`text-8xl ${isRecording ? 'text-indigo-400' : 'text-slate-700'}`} />
                </div>
                <ActionButton 
                    onClick={isRecording ? stopRecording : startRecording} 
                    className={`w-full py-7 text-xl uppercase tracking-widest ${isRecording ? 'bg-rose-600 text-white' : ''}`}
                    icon={<MaterialSymbol icon={isRecording ? "stop" : "record_voice_over"} />}
                >
                    {isRecording ? 'Stop Recording' : 'Start Recording'}
                </ActionButton>
            </div>
            <div className="bg-slate-950 border border-white/5 rounded-[3.5rem] p-12 overflow-y-auto custom-scrollbar shadow-inner relative">
                {isLoading ? <LoadingState message="Transcribing Stream" details="Utilizing Gemini 3 Flash for low-latency linguistic decoding." /> : transcript ? (
                    <div className="space-y-8 animate-slide-in-bottom">
                         <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Sovereign Transcript Ledger</h3>
                         <div className="text-slate-300 text-lg leading-relaxed font-medium">{transcript}</div>
                         <AISignature />
                    </div>
                ) : <div className="h-full flex items-center justify-center opacity-10 grayscale"><MaterialSymbol icon="description" className="text-[140px]" /></div>}
            </div>
        </div>
    );
};

const LiveIntelligence: React.FC = () => {
    const [isConnecting, setIsConnecting] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [transcription, setTranscription] = useState<{user: string, model: string}[]>([]);
    const [currentTurn, setCurrentTurn] = useState({user: '', model: ''});
    
    const sessionRef = useRef<any | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    const nextStartTimeRef = useRef(0);

    const stopSession = () => {
        if (sessionRef.current) { try { sessionRef.current.close(); } catch(e){} sessionRef.current = null; }
        if (mediaStreamRef.current) { mediaStreamRef.current.getTracks().forEach(t => t.stop()); mediaStreamRef.current = null; }
        if (audioContextRef.current) { try { audioContextRef.current.close(); } catch(e){} audioContextRef.current = null; }
        if (outputAudioContextRef.current) { try { outputAudioContextRef.current.close(); } catch(e){} outputAudioContextRef.current = null; }
        setIsActive(false);
        setIsConnecting(false);
    };

    const startSession = async () => {
        if (isActive || isConnecting) return;
        setIsConnecting(true);
        setError(null);

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStreamRef.current = stream;

            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
            const sessionPromise = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-12-2025',
                callbacks: {
                    onopen: () => {
                        setIsConnecting(false);
                        setIsActive(true);
                        
                        const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
                        audioContextRef.current = inputCtx;
                        const source = inputCtx.createMediaStreamSource(stream);
                        const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
                        scriptProcessor.onaudioprocess = (e) => {
                            const inputData = e.inputBuffer.getChannelData(0);
                            const pcmBlob: MediaBlob = {
                                data: encode(new Uint8Array(new Int16Array(inputData.map(x => x * 32768)).buffer)),
                                mimeType: 'audio/pcm;rate=16000',
                            };
                            sessionPromise.then((session) => {
                                if (session) session.sendRealtimeInput({ media: pcmBlob });
                            });
                        };
                        source.connect(scriptProcessor);
                        scriptProcessor.connect(inputCtx.destination);

                        outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        if (message.serverContent?.inputTranscription) {
                            setCurrentTurn(prev => ({ ...prev, user: prev.user + message.serverContent!.inputTranscription!.text }));
                        }
                        if (message.serverContent?.outputTranscription) {
                            setCurrentTurn(prev => ({ ...prev, model: prev.model + message.serverContent!.outputTranscription!.text }));
                        }
                        if (message.serverContent?.turnComplete) {
                            setTranscription(prev => [...prev, currentTurn]);
                            setCurrentTurn({user: '', model: ''});
                        }

                        const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
                        if (base64Audio && outputAudioContextRef.current) {
                            const outputCtx = outputAudioContextRef.current;
                            const nextStartTime = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
                            const audioBuffer = await decodeAudioData(decode(base64Audio), outputCtx, 24000, 1);
                            const source = outputCtx.createBufferSource();
                            source.buffer = audioBuffer;
                            source.connect(outputCtx.destination);
                            source.start(nextStartTime);
                            nextStartTimeRef.current = nextStartTime + audioBuffer.duration;
                        }
                    },
                    onerror: (e) => { setError(`Live Protocol failure: ${e}`); stopSession(); },
                    onclose: () => stopSession(),
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    inputAudioTranscription: {},
                    outputAudioTranscription: {},
                    systemInstruction: "You are the Nimbus IQ Vocal Core. Sophisticated, factual, authoritative. Speak naturally and assist in real-time."
                },
            });
            sessionRef.current = await sessionPromise;
        } catch (err) { setError(err instanceof Error ? err.message : 'Environment capture failed.'); setIsConnecting(false); }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-fade-in">
            <div className="bg-slate-900 border border-white/5 rounded-[3.5rem] p-12 flex flex-col items-center justify-center space-y-12 shadow-2xl relative overflow-hidden">
                {!isActive ? (
                    <div className="text-center space-y-8 max-w-sm">
                        <div className="p-16 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                            <MaterialSymbol icon="graphic_eq" className="text-8xl animate-pulse" />
                        </div>
                        <h3 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">Initialize Link</h3>
                        <p className="text-slate-500 font-medium">Connect to the Gemini Native Audio pipeline for conversational intelligence.</p>
                        <ActionButton onClick={startSession} isLoading={isConnecting} className="w-full py-6 text-xl" icon={<MaterialSymbol icon="bolt" />}>
                            Initialize Protocol
                        </ActionButton>
                    </div>
                ) : (
                    <div className="w-full space-y-12 flex flex-col items-center">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-indigo-500 blur-[100px] opacity-20 animate-pulse"></div>
                            <div className="h-48 w-48 rounded-full border-4 border-indigo-500 flex items-center justify-center relative z-10 shadow-[0_0_80px_rgba(99,102,241,0.3)]">
                                <MaterialSymbol icon="mic" className="text-7xl text-indigo-400 animate-bounce" />
                            </div>
                        </div>
                        <div className="text-center">
                            <h3 className="text-2xl font-black uppercase text-white tracking-tight">Active Ingress</h3>
                            <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.4em] mt-2">Streaming Sub-Modal Telemetry</p>
                        </div>
                        <ActionButton variant="danger" className="w-full py-5 text-lg" onClick={stopSession} icon={<MaterialSymbol icon="link_off" />}>
                            Terminate Uplink
                        </ActionButton>
                    </div>
                )}
            </div>
            <div className="bg-slate-950 border border-white/5 rounded-[3.5rem] p-10 h-[650px] flex flex-col shadow-inner overflow-hidden">
                <div className="flex-grow overflow-y-auto custom-scrollbar space-y-8 pr-4">
                    {transcription.map((t, i) => (
                        <div key={i} className="space-y-4 animate-slide-in-bottom">
                            <div className="flex flex-col gap-1">
                                <span className="text-[8px] font-black uppercase tracking-widest text-indigo-400">Subject</span>
                                <div className="text-slate-200 text-sm font-medium leading-relaxed bg-white/5 p-5 rounded-3xl border border-white/5">{t.user}</div>
                            </div>
                            <div className="flex flex-col gap-1 items-start">
                                <span className="text-[8px] font-black uppercase tracking-widest text-slate-600">Nimbus IQ</span>
                                <div className="text-white text-sm font-black leading-relaxed bg-indigo-500/10 p-5 rounded-3xl border border-indigo-500/20 shadow-lg">{t.model}<AISignature /></div>
                            </div>
                        </div>
                    ))}
                    {(currentTurn.user || currentTurn.model) && <div className="animate-pulse opacity-50 space-y-4">
                        {currentTurn.user && <div className="text-xs text-slate-500 italic">User: {currentTurn.user}</div>}
                        {currentTurn.model && <div className="text-xs text-indigo-400 italic">Nimbus: {currentTurn.model}</div>}
                    </div>}
                </div>
            </div>
        </div>
    );
};

const NeuralTTS: React.FC = () => {
    const [text, setText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);

    const handleGenerateSpeech = async () => {
        if (!text.trim()) return;
        setIsLoading(true);
        setError(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash-preview-tts",
                contents: [{ parts: [{ text }] }],
                config: { responseModalities: [Modality.AUDIO] },
            });
            const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
            if (base64Audio) {
                if (!audioContextRef.current) audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
                const audioBuffer = await decodeAudioData(decode(base64Audio), audioContextRef.current, 24000, 1);
                const source = audioContextRef.current.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(audioContextRef.current.destination);
                source.start();
            }
        } catch (err) { setError(err instanceof Error ? err.message : 'Vocal synthesis failure.'); } finally { setIsLoading(false); }
    };
    
    return (
        <div className="flex flex-col items-center justify-center py-10 max-w-3xl mx-auto space-y-12">
             <div className="w-full bg-slate-900 border border-white/10 p-12 rounded-[3.5rem] space-y-10 shadow-2xl relative overflow-hidden">
                 <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Linguistic Input Buffer</label>
                    <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter instructions or documentation for vocal synthesis..." className="w-full bg-slate-950 border border-white/5 rounded-3xl p-8 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all resize-none min-h-[250px]" />
                 </div>
                 <ActionButton onClick={handleGenerateSpeech} isLoading={isLoading} className="w-full py-6 text-xl uppercase tracking-widest" icon={<MaterialSymbol icon="graphic_eq" />}>Generate Vocalization</ActionButton>
                 <AISignature />
            </div>
        </div>
    );
};

export default AudioStudio;