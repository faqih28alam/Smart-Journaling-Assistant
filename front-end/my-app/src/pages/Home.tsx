// Home.tsx
// src/pages/Home.tsx

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "sonner"
import { supabase } from "@/lib/supabaseClient";
import { Clock, Trash2, Mic, MicOff } from "lucide-react";

// Define the shape of an entry based on schema
interface Entry {
    id: string;
    rawContent: string;
    createdAt: string;
}

const Home = () => {
    const [content, setContent] = useState<string>('');
    const [isSaving, setIsSaving] = useState(false);
    const [entries, setEntries] = useState<Entry[]>([]);
    const [isListening, setIsListening] = useState(false);

    // --- FETCH LOGIC ---
    const fetchEntries = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
            .from('Entry')
            .select('id, rawContent, createdAt')
            .eq('userId', user.id)
            .order('createdAt', { ascending: false })
            .limit(5); // Show only last 5

        if (error) console.error("Error fetching:", error.message);
        else setEntries(data || []);
    };

    // Fetch entries on component mount
    useEffect(() => {
        fetchEntries();
    }, []);

    // --- SAVE LOGIC ---
    const handleSave = async () => {
        if (!content.trim()) return;
        setIsSaving(true);

        try {
            // Get current authenticated user
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError || !user) throw new Error("Please log in again.");

            // Insert into "Entry" (matching exact SQL Table name)
            const { error } = await supabase.from('Entry').insert([
                {
                    rawContent: content,  // Matching your schema's camelCase
                    userId: user.id      // Matching your schema's camelCase
                }
            ]);

            if (error) throw error;

            // Success feedback
            toast.success("Entry saved!, Your thoughts are locked in.");
            setContent('');
            fetchEntries(); // Refresh list after saving

        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Failed to save");
        } finally {
            setIsSaving(false);
        }
    };

    // ---- Handle Delete ----
    const handleDelete = async (id: string) => {
        // Add a quick confirmation
        if (!confirm("Are you sure you want to delete this entry?")) return;

        try {
            const { error } = await supabase
                .from('Entry')   // Start here
                .delete()        // Action
                .eq('id', id);   // Filter

            if (error) throw error;

            toast.success("Entry deleted");

            // Update the local state so the card disappears immediately
            setEntries(prev => prev.filter(entry => entry.id !== id));
        } catch (error: any) {
            toast.error(error.message || "Failed to delete");
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
        // recognition.lang = 'en-US'; // change this to 'id-ID' if needed
        recognition.lang = 'id-ID';

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

            {/* Save Button */}
            <Button
                onClick={handleSave}
                disabled={!content.trim() || isSaving}
                className="w-full py-7 rounded-xl font-bold text-lg shadow-lg shadow-indigo-500/20 dark:shadow-indigo-900/40"
                size="lg"
            >
                {isSaving ? 'Locking it in...' : '✨ Tidy Up with AI'}
            </Button>

            {/* Recent Activity Section */}
            <div className="pt-10 border-t border-border">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-[0.2em]">
                    Recent Activity
                </h3>

                <div className="space-y-4">
                    {entries.length === 0 ? (
                        <Card className="border-dashed bg-muted/50">
                            <CardContent className="py-10 text-center text-gray-400 italic text-sm">
                                Your previous entries will appear here...
                            </CardContent>
                        </Card>
                    ) : (
                        entries.map((entry) => (
                            <Card key={entry.id} className="group hover:border-indigo-200 transition-colors relative">
                                <CardHeader className="p-4 pb-0 flex flex-row items-center justify-between">
                                    <div className="flex items-center text-xs text-muted-foreground gap-2">
                                        <Clock className="w-3 h-3" />
                                        {new Date(entry.createdAt).toLocaleDateString()} at {new Date(entry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>

                                    {/* Delete Button */}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors" onClick={() => handleDelete(entry.id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </CardHeader>
                                <CardContent className="p-4 pt-2">
                                    <p className="text-sm text-card-foreground line-clamp-3 leading-relaxed">
                                        {entry.rawContent}
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