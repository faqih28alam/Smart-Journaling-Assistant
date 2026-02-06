// Entry.tsx
// src/pages/Entry.tsx

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "sonner"
import { supabase } from "@/lib/supabaseClient";
import { Calendar, Mic, MicOff, Sparkles, Save } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

interface Entry {
    id: string;
    rawContent: string;
    tidyContent?: string;
    mood?: string;
    category?: string;
    isTidied?: boolean;
    createdAt: string;
}

const Entry = () => {
    const navigate = useNavigate();
    const [content, setContent] = useState<string>('');
    const [isSaving, setIsSaving] = useState(false);
    const [entries, setEntries] = useState<Entry[]>([]);
    const [isListening, setIsListening] = useState(false);
    const [aiSuggestion, setAiSuggestion] = useState<{
        tidyContent: string;
        mood: string;
        category: string;
    } | null>(null);

    const fetchEntries = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
            .from('Entry')
            .select('id, rawContent, tidyContent, mood, category, createdAt, isTidied')
            .eq('userId', user.id)
            .order('createdAt', { ascending: false })
            .limit(2);

        if (error) console.error("Error fetching:", error.message);
        else setEntries(data || []);
    };

    useEffect(() => {
        fetchEntries();
    }, []);

    const handleTidyUp = async () => {
        if (!content.trim()) return;
        setIsSaving(true);
        const toastId = toast.loading("AI is analyzing and tidying...");

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/tidy`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: content })
            });

            if (!response.ok) throw new Error("AI service unavailable");

            const data = await response.json();
            setAiSuggestion(data);
            toast.success("AI version ready!", { id: toastId });
        } catch (error: any) {
            toast.error(error.message || "AI processing failed", { id: toastId });
        } finally {
            setIsSaving(false);
        }
    };

    const handleFinalSave = async (useAiVersion: boolean) => {
        if (!content.trim()) return;
        setIsSaving(true);
        const toastId = toast.loading("Saving your thoughts...");

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Authentication required.");

            const payload = {
                userId: user.id,
                email: user.email,
                rawContent: content,
                tidyContent: useAiVersion ? aiSuggestion?.tidyContent : null,
                mood: useAiVersion ? aiSuggestion?.mood : 'NEUTRAL',
                category: useAiVersion ? aiSuggestion?.category : 'PERSONAL',
                isTidied: useAiVersion
            };

            const response = await fetch(`${import.meta.env.VITE_API_URL}/save-entry`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Database save failed");
            }

            toast.success("Saved to your journal!", { id: toastId });
            setAiSuggestion(null);
            setContent('');
            fetchEntries();
        } catch (error: any) {
            toast.error(error.message || "Failed to save", { id: toastId });
        } finally {
            setIsSaving(false);
        }
    };

    const handleVoiceInput = () => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

        if (!SpeechRecognition) {
            toast.error("Your browser does not support voice input.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'id-ID';

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setContent(prev => prev ? `${prev} ${transcript}` : transcript);
        };

        recognition.onerror = (event: any) => {
            setIsListening(false);
            toast.error("Speech error: " + event.error);
        };

        recognition.start();
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6 pt-10 px-4 min-h-screen bg-background text-foreground transition-colors duration-300">
            <header className="space-y-2">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold tracking-tight">Daily Entry</h2>
                    <Button variant="ghost" asChild>
                        <Link to="/dashboard">View Dashboard</Link>
                    </Button>
                </div>
                <p className="text-muted-foreground">
                    Don't worry about grammar—just write. AI will organize it later.
                </p>
            </header>

            <div className="relative group">
                {/* text area */}
                <Textarea
                    className="min-h-[300px] p-5 text-lg rounded-2xl shadow-sm border-2 focus-visible:ring-indigo-500 transition-all"
                    placeholder="What's on your mind today?"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    disabled={isSaving}
                />
                {/* voice input */}
                <div className="absolute bottom-4 left-4 flex items-center gap-3">
                    <Button
                        type="button"
                        variant={isListening ? "destructive" : "secondary"}
                        size="icon"
                        onClick={handleVoiceInput}
                        className={`rounded-full shadow-md ${isListening ? 'animate-pulse' : ''}`}
                    >
                        {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </Button>
                    {isListening && (
                        <span className="text-xs font-semibold text-red-500 animate-pulse">
                            Listening...
                        </span>
                    )}
                </div>
                {/* character count */}
                <div className="absolute bottom-4 right-4 text-[10px] text-muted-foreground font-mono bg-background/90 px-2 py-1 rounded border">
                    {content.length} characters
                </div>
            </div>
            {/* AI Suggestion Section */}
            {aiSuggestion && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                    <Card className="border-indigo-500 bg-indigo-50/30 dark:bg-indigo-950/20 shadow-md">
                        <CardContent className="pt-4 space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="font-bold text-indigo-600 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4" /> AI Suggestion
                                </h4>
                                <div className="flex gap-2">
                                    <span className="text-[10px] font-bold bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded uppercase">
                                        {aiSuggestion.mood}
                                    </span>
                                    <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded uppercase">
                                        {aiSuggestion.category}
                                    </span>
                                </div>
                            </div>

                            <p className="text-sm leading-relaxed italic border-l-4 border-indigo-200 pl-4 py-1">
                                "{aiSuggestion.tidyContent}"
                            </p>

                            <div className="flex gap-3">
                                <Button className="flex-1 bg-indigo-600" onClick={() => handleFinalSave(true)}>
                                    Accept AI Version
                                </Button>
                                <Button variant="outline" className="flex-1" onClick={() => handleFinalSave(false)}>
                                    Keep My Raw Version
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
            {/* Button Group Section */}
            {!aiSuggestion && (
                // Buttons to trigger AI tidy or save raw
                <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                        onClick={handleTidyUp}
                        disabled={!content.trim() || isSaving}
                        className="flex-1 py-6 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                        variant="default"
                    >
                        <Sparkles className="mr-2 w-5 h-5" />
                        {isSaving ? 'Thinking...' : 'Tidy Up with AI'}
                    </Button>
                    <Button
                        onClick={() => handleFinalSave(false)}
                        disabled={!content.trim() || isSaving}
                        className="flex-1 py-6 rounded-xl font-bold text-white bg-black/100 hover:bg-black/70 dark:bg-white/10 dark:hover:bg-white/20"
                        variant="secondary"
                    >
                        <Save className="mr-2 w-5 h-5" />
                        Save Raw
                    </Button>
                </div>
            )}

            {/* Recent Activity Section */}
            <div className="pt-10 border-t border-border space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-[0.2em]">
                        📝 Recent Entries
                    </h3>

                    {/* Details button */}
                    <Button
                        variant="outline"
                        size="sm"
                        className="text-xs text-gray-400 hover:text-gray-500 cursor-pointer"
                        onClick={() => navigate("/dashboard")}
                    >
                        View All
                    </Button>
                </div>

                <div className="space-y-4">
                    {entries.length === 0 ? (
                        <Card className="border-dashed bg-muted/50">
                            <CardContent className="py-10 text-center text-gray-400 italic text-sm">
                                You haven&apos;t made any entries yet.
                            </CardContent>
                        </Card>
                    ) : (
                        entries.map((entry) => (
                            <Card key={entry.id} className="group hover:border-indigo-200 transition-colors relative">
                                <CardHeader className="p-4 pb-0 flex flex-row items-center justify-between">
                                    <div className="flex items-center text-xs text-muted-foreground gap-2">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(entry.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                        {entry.mood && (
                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-600 uppercase">
                                                {entry.mood}
                                            </span>
                                        )}
                                        {entry.category && (
                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 uppercase">
                                                {entry.category}
                                            </span>
                                        )}
                                    </div>
                                </CardHeader>
                                {/* Content */}
                                <CardContent className="p-4 pt-2">
                                    <p className="text-sm text-card-foreground line-clamp-1 leading-relaxed">
                                        {entry.isTidied ? entry.tidyContent : entry.rawContent}
                                    </p>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>

            </div>
        </div>
    );
};

export default Entry;