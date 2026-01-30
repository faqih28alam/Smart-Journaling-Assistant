// Home.tsx
// src/pages/Home.tsx

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner"
import { supabase } from "@/lib/supabaseClient";

const Home = () => {
    const [content, setContent] = useState<string>('');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (!content.trim()) return;
        setIsSaving(true);

        try {
            // 1. Get current authenticated user
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError || !user) throw new Error("Please log in again.");

            // 2. Insert into "Entry" (matching your exact SQL Table name)
            const { error } = await supabase.from('Entry').insert([
                { 
                    rawContent: content,  // Matching your schema's camelCase
                    userId: user.id      // Matching your schema's camelCase
                }
            ]);

            if (error) throw error;

            // Success feedback
            toast?.("Entry saved!, Your thoughts are locked in." );
            setContent('');
            
        } catch (error: any) {
            console.error(error);
            alert(error.message || "An error occurred");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        
        <div className="max-w-2xl mx-auto space-y-6 pt-10 px-4">
            {/* Header */}
            <header className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">Daily Entry</h2>
                <p className="text-muted-foreground">
                    Don't worry about grammar—just write. AI will organize it later.
                </p>
            </header>

            {/* Main Input Area */}
            <div className="relative group">
                <Textarea 
                    className="min-h-[300px] p-5 text-lg rounded-2xl shadow-sm border-2 transition-all focus-visible:ring-indigo-500"
                    placeholder="What's on your mind today?"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    disabled={isSaving}
                />
                
                <div className="absolute bottom-4 right-4 text-xs text-muted-foreground font-mono bg-white/80 px-2 py-1 rounded">
                    {content.length} characters
                </div>
            </div>

            {/* Save Button */}
            <Button 
                onClick={handleSave}
                disabled={!content.trim() || isSaving}
                className="w-full py-7 rounded-xl font-bold text-lg shadow-indigo-200 shadow-lg"
                size="lg"
            >
                {isSaving ? 'Locking it in...' : 'Lock in Entry'}
            </Button>

            {/* Recent Activity Section */}
            <div className="pt-10 border-t border-gray-100">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-[0.2em]">
                    Recent Activity
                </h3>
                <Card className="mt-4 border-dashed bg-gray-50/50">
                    <CardContent className="flex items-center justify-center py-10">
                        <p className="text-gray-400 italic text-sm text-center">
                            Your previous entries will appear here <br /> 
                            once you've written a few...
                        </p>
                    </CardContent>
                </Card>
            </div>  
        </div>
    );
};

export default Home;