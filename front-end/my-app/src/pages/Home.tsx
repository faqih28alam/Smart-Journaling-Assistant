// Home.tsx
// src/pages/Home.tsx

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "sonner"
import { supabase } from "@/lib/supabaseClient";
import { Calendar, Mic, MicOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Define the shape of an entry based on schema
interface Entry {
    id: string;
    rawContent: string;
    tidyContent?: string;
    mood?: string;
    category?: string;
    isTidied?: boolean;
    createdAt: string;
}

const Home = () => {
    const navigate = useNavigate();
    const [content, setContent] = useState<string>('');
    const [isSaving, setIsSaving] = useState(false);
    const [entries, setEntries] = useState<Entry[]>([]);
    const [isListening, setIsListening] = useState(false);
    const [aiSuggestion, setAiSuggestion] = useState<{
        tidyContent: string;
        mood: any;
        category: any;
    } | null>(null);

    // --- FETCH LOGIC ---
    const fetchEntries = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
            .from('Entry')
            .select('id, rawContent, tidyContent, mood, category, createdAt, isTidied')
            .eq('userId', user.id)
            .order('createdAt', { ascending: false })
            .limit(2); // Show only last 2

        if (error) console.error("Error fetching:", error.message);
        else setEntries(data || []);
    };

    // Fetch entries on component mount
    useEffect(() => {
        fetchEntries();
    }, []);

    // --- Handle Tidy Up ---
    const handleTidyUp = async () => {
        if (!content.trim()) return;
        setIsSaving(true);
        const toastId = toast.loading("AI is analyzing and tidying...");

        try {
            // We call Express backend (Step 2)
            // This endpoint calls AI but DOES NOT save to DB yet
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/tidy`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: content })
            });

            const data = await response.json();

            // Step 3: Show the AI version in the UI
            setAiSuggestion(data);
            toast.success("AI version ready!", { id: toastId });

        } catch (error: any) {
            console.error("FULL ERROR:", error.response?.data || error.message);
            toast.error(error.message || "AI processing failed", { id: toastId });
        } finally {
            setIsSaving(false);
        }
    };

    // ---- Handle Save ----
    const handleFinalSave = async (useAiVersion: boolean) => {
        setIsSaving(true);
        try {
            // Get the current user ID first
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                toast.error("You must be logged in to save.");
                return;
            }
            const payload = {
                userId: user.id,
                email: user.email,
                rawContent: content,
                tidyContent: useAiVersion ? aiSuggestion?.tidyContent : null,
                mood: useAiVersion ? aiSuggestion?.mood : 'NEUTRAL',
                category: useAiVersion ? aiSuggestion?.category : 'PERSONAL',
                isTidied: useAiVersion
            };

            // Send to Express to save via Prisma
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/save-entry`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Database save failed");
            }

            toast.success("Saved to your journal!");
            setAiSuggestion(null);
            setContent('');
            fetchEntries();         // Refresh the list
        } catch (error) {
            toast.error("Failed to save");
        } finally {
            setIsSaving(false);
        }
    };

    // ---- Handle Voice Input ----
    const handleVoiceInput = async () => {
        // Check if browser supports Speech Recognition
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert("Your browser does not support voice input.");
            toast.error("Your browser does not support voice input.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false; // Stop when the user stops talking
        recognition.interimResults = false; // Only final results
        recognition.lang = 'id-ID';      // change this to 'id-ID' or 'en-US' as if needed

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            // Append transcript to existing content
            setContent(prev => prev ? `${prev} ${transcript}` : transcript);
        };

        recognition.onerror = (event: any) => {
            console.error("Speech Recognition Error:", event.error);
            setIsListening(false);
        };

        recognition.start();
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6 pt-10 px-4 min-h-screen bg-background text-foreground transition-colors duration-300">

            {/* Header */}
            <header className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight text-foreground">Daily Entry</h2>
                <p className="text-muted-foreground">
                    Don't worry about grammar—just write. AI will organize it later.
                </p>
            </header>

            {/* Main Input Area */}
            <div className="relative group">
                {/* Text Area */}
                <Textarea
                    className="min-h-[300px] p-5 text-lg rounded-2xl shadow-sm border-2 transition-all focus-visible:ring-indigo-500"
                    placeholder="What's on your mind today?"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    disabled={isSaving}
                />
                {/* Voice Input Button */}
                <div className="absolute bottom-4 left-4 flex gap-2">
                    <Button
                        type="button"
                        variant={isListening ? "destructive" : "secondary"}
                        size="sm"
                        onClick={handleVoiceInput}
                        className="rounded-full h-10 w-10 flex items-center justify-center animate-pulse-slow cursor-pointer"
                    >
                        {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </Button>
                    {isListening && (
                        <span className="text-xs text-red-500 font-medium animate-pulse flex items-center">
                            Listening...
                        </span>
                    )}
                </div>
                <div className="absolute bottom-4 right-4 text-xs text-muted-foreground font-mono bg-background/80 backdrop-blur-sm px-2 py-1 rounded border">
                    {content.length} characters
                </div>
            </div>

            {/* AI Suggestion Card */}
            {aiSuggestion && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                    <Card className="border-indigo-500 bg-indigo-50/50 shadow-md">
                        <CardContent className="pt-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <h4 className="font-bold text-indigo-700 flex items-center gap-2">
                                    ✨ AI Suggestion
                                </h4>
                                <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded uppercase">
                                    {aiSuggestion.mood} | {aiSuggestion.category}
                                </span>
                            </div>

                            <p className="text-sm text-gray-800 leading-relaxed italic">
                                "{aiSuggestion.tidyContent}"
                            </p>

                            <div className="flex gap-3 mt-4">
                                <Button
                                    className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                                    onClick={() => handleFinalSave(true)}
                                >
                                    Accept AI Version
                                </Button>
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => handleFinalSave(false)}
                                >
                                    Keep My Raw Version
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Tidy Up with AI Button */}
            {!aiSuggestion && (
                <Button
                    onClick={handleTidyUp}
                    disabled={!content.trim() || isSaving}
                    className="w-full py-7 rounded-xl font-bold text-lg shadow-lg shadow-indigo-500/20 dark:shadow-indigo-900/40"
                    size="lg"
                >
                    {isSaving ? 'Locking it in...' : '✨ Tidy Up with AI'}
                </Button>
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

export default Home;