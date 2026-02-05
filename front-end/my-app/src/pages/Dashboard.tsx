// Dashborad.tsx
// src/pages/Dashboard.tsx
// This Page shows Stats: Number of entry, streaks count, etc.

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EditEntryModal } from '@/components/EditEntryModal';
import { SearchEntryModal } from '@/components/SearchEntryModal';
import { supabase } from "@/lib/supabaseClient";
import {
    Plus,
    BarChart3,
    BookOpen,
    Lightbulb,
    ArrowRight,
    TrendingUp,
    Clock,
    Smile,
    Frown,
    Meh,
    Trash2,
    Pencil,
    Search,
} from "lucide-react";
import { Link } from "react-router-dom"; // Assuming you use react-router
import { toast } from "sonner"


interface Entry {
    id: string;
    rawContent: string;
    tidyContent?: string;
    mood?: string;
    category?: string;
    isTidied?: boolean;
    createdAt: string;
}

interface WeeklyInsight {
    id: string;
    summary: string;
    topThemes: string[];
    moodData: Record<string, number>;
    entriesAnalyzed: number;
    startDate: string;
    endDate: string;
}


const Dashboard = () => {
    const [entries, setEntries] = useState<Entry[]>([]);
    const [stats, setStats] = useState({ count: 0, streak: 0 });
    // for weekly insight
    const [isGenerating, setIsGenerating] = useState(false);
    const [weeklyInsight, setWeeklyInsight] = useState<WeeklyInsight | null>(null);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    // Add state for edit Entry
    const [editingEntry, setEditingEntry] = useState<Entry | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    // Add state for search modal
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

    // --- FETCH LOGIC ---
    const fetchDashboardData = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch User Stats (Streak and Total Count)
        const { data: userData, error: userError } = await supabase
            .from('User')
            .select('streakCount, totalEntries')
            .eq('id', user.id)
            .single();

        // Fetch Recent Entries
        const { data: entriesData, error: entriesError } = await supabase
            .from('Entry')
            .select('*')
            .eq('userId', user.id)
            .order('createdAt', { ascending: false })
            .limit(10); // Show only last 10

        if (!userError && userData) {
            setStats({
                count: userData.totalEntries || 0,
                streak: userData.streakCount || 0
            });
        }
        if (!entriesError && entriesData) {
            setEntries(entriesData);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const getMoodIcon = (mood?: string) => {
        switch (mood?.toUpperCase()) {
            case 'HAPPY': return <Smile className="w-4 h-4 text-green-500" />;
            case 'FRUSTRATED': return <Frown className="w-4 h-4 text-red-500" />;
            default: return <Meh className="w-4 h-4 text-slate-400" />;
        }
    };

    // ---- Handle Delete ----
    const handleDelete = async (id: string) => {
        // Add a quick confirmation
        if (!confirm("Are you sure you want to delete this entry?")) return;


        try {
            const { data: { user } } = await supabase.auth.getUser();
            const { error } = await supabase
                .from('Entry')   // Start here
                .delete()        // Action
                .eq('id', id);   // Filter

            if (!error) {
                // Manually decrement the local count for immediate UI feedback
                setStats(prev => ({ ...prev, count: prev.count - 1 }));
                // Update the local state so the card disappears immediately
                setEntries(prev => prev.filter(e => e.id !== id));

                // Update database totalEntries
                await supabase.rpc('decrement_total_entries', { user_id: user?.id });
            }
            toast.success("Entry deleted");
        } catch (error: any) {
            toast.error(error.message || "Failed to delete");
        }
    };

    // ---- Handle Edit ----
    const handleEdit = (entry: Entry) => {
        setEditingEntry(entry);
        setIsEditModalOpen(true);
    };

    // ---- Generate Weekly Insight ----
    const generateWeeklyInsight = async () => {
        if (!currentUserId) {
            toast.error("User not logged in");
            return;
        }

        setIsGenerating(true);

        try {
            const response = await fetch('http://localhost:3000/api/generate-weekly-insight', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: currentUserId })
            });

            const data = await response.json();

            if (response.ok) {
                setWeeklyInsight(data);
                toast.success("Weekly insight generated!");
            } else {
                toast.error(data.error || 'Failed to generate insight');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to generate insight');
        } finally {
            setIsGenerating(false);
        }
    };
    // Fetch current user
    useEffect(() => {
        const getCurrentUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setCurrentUserId(user.id);
            }
        };
        getCurrentUser();
    }, []);


    // ---- RENDER ----
    return (
        <div className="max-w-2xl mx-auto p-6 space-y-8 pb-20">
            {/* Header */}
            <header className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl">
                        <BookOpen className="w-6 h-6 text-primary" />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight">Smart Journal</h1>
                </div>
                <Link to="/home">
                    <Button className="rounded-full shadow-lg hover:shadow-indigo-500/20 transition-all cursor-pointer">
                        <Plus className="w-4 h-4 mr-2" /> New Entry
                    </Button>
                </Link>
            </header>

            {/* Stats Section */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <BarChart3 className="w-5 h-5" />
                    <h2 className="text-sm font-semibold uppercase tracking-wider">Stats</h2>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <Card className="bg-slate-50/50 border-none shadow-none">
                        <CardContent className="p-4">
                            <p className="text-2xl font-bold">{stats.count}</p>
                            <p className="text-xs text-muted-foreground">Total Entries</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-indigo-50/50 border-none shadow-none">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2">
                                <p className="text-2xl font-bold text-indigo-700">{stats.streak}</p>
                                <TrendingUp className="w-4 h-4 text-indigo-600" />
                            </div>
                            <p className="text-xs text-indigo-600/70 font-medium">Day Streak</p>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Recent Entries */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                        📝 All Entries
                    </h2>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs gap-1"
                        onClick={() => setIsSearchModalOpen(true)}
                    >
                        <Search className="w-3 h-3" />
                        Search & Filter
                    </Button>
                </div>

                <div className="space-y-3">
                    {entries.map((entry) => (
                        <Card key={entry.id} className="relative group hover:border-indigo-200 transition-all cursor-pointer">
                            <CardContent className="p-4">
                                {/* Date & Category */}
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs font-medium text-slate-400">
                                        <Clock className="w-3 h-3" />
                                        {new Date(entry.createdAt).toLocaleDateString()} at {new Date(entry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    <Badge variant="secondary" className="text-[10px] uppercase font-bold px-2 py-0">
                                        {entry.category || 'General'}
                                    </Badge>
                                </div>
                                {/* Content */}
                                <p className="text-sm font-medium line-clamp-3 mb-2">
                                    {entry.isTidied ? entry.tidyContent : entry.rawContent}
                                </p>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    {getMoodIcon(entry.mood)}
                                    <span className="capitalize">{entry.mood?.toLowerCase() || 'Neutral'}</span>
                                </div>
                            </CardContent>
                            {/* Delete Button */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute bottom-2 right-2 h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors" onClick={() => handleDelete(entry.id)}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                            {/* Edit Button */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute bottom-2 right-12 h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                                onClick={() => handleEdit(entry)}
                            >
                                <Pencil className="w-4 h-4" />
                            </Button>
                        </Card>
                    ))}
                    {/* Edit Entry Modal */}
                    <EditEntryModal
                        entry={editingEntry}
                        isOpen={isEditModalOpen}
                        onClose={() => {
                            setIsEditModalOpen(false);
                            setEditingEntry(null);
                        }}
                        onSave={fetchDashboardData}
                    />
                </div>
            </section>

            {/* AI Insights Card */}
            <Card className="bg-gradient-to-br from-indigo-600 to-violet-700 text-white border-none shadow-xl overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Lightbulb className="w-24 h-24 text-white" />
                </div>
                <CardHeader>
                    <CardTitle className="text-indigo-100 flex items-center gap-2 text-sm uppercase tracking-widest font-bold">
                        <Lightbulb className="w-4 h-4" /> Last Week's Insight
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {weeklyInsight ? (
                        <div>
                            <p className="text-lg mb-4 leading-relaxed">"{weeklyInsight.summary}"</p>

                            <div className="mb-4">
                                <h4 className="font-semibold mb-2 text-indigo-100">Top Themes:</h4>
                                <div className="flex flex-wrap gap-2">
                                    {weeklyInsight.topThemes.map((theme: string, idx: number) => (
                                        <span key={idx} className="bg-white/20 px-3 py-1 rounded-full text-sm">
                                            {theme}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <p className="text-xs text-indigo-200 mb-3">
                                Based on {weeklyInsight.entriesAnalyzed} entries
                            </p>

                            <Button
                                variant="secondary"
                                className="bg-white/20 hover:bg-white/30 text-white border-none"
                            >
                                See Details <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    ) : (
                        <div className="text-center">
                            <p className="mb-4 text-indigo-100">
                                Generate AI-powered insights from your journal entries
                            </p>
                            <Button
                                onClick={generateWeeklyInsight}
                                disabled={isGenerating || stats.count === 0}
                                className="bg-white text-indigo-600 hover:bg-white/90"
                            >
                                {isGenerating ? (
                                    <>Generating...</>
                                ) : stats.count === 0 ? (
                                    <>Write entries first</>
                                ) : (
                                    <>✨ Generate Weekly Insight</>
                                )}
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
            {/* Search & Filter Modal */}
            <SearchEntryModal
                isOpen={isSearchModalOpen}
                onClose={() => setIsSearchModalOpen(false)}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </div>
    );
};

export default Dashboard;
