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
import { getMoodColor, getCategoryColor } from '@/lib/moodCategoryColors';

interface Entry {
    id: string;
    title?: string;
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
        const iconSize = 16;

        switch (mood?.toUpperCase()) {
            case 'HAPPY':
                return <Smile size={iconSize} className="text-yellow-500 animate-pulse" />;
            case 'FRUSTRATED':
                return <Frown size={iconSize} className="text-red-500" />;
            case 'SAD':
                return <Frown size={iconSize} className="text-blue-500" />;
            default:
                return <Meh size={iconSize} className="text-slate-400" />;
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
            const response = await fetch(`${import.meta.env.VITE_API_URL}/generate-weekly-insight`, {
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
                <Link to="/entry">
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
                    <Card className="bg-slate-50/50 dark:bg-zinc-900/50 border-none shadow-none transition-colors">
                        <CardContent className="p-4">
                            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                                {stats.count}
                            </p>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                                Total Entries
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="bg-indigo-50/50 dark:bg-indigo-500/10 border-none shadow-none transition-colors">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2">
                                <p className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">
                                    {stats.streak}
                                </p>
                                <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <p className="text-xs text-indigo-600/70 dark:text-indigo-400/80 font-medium">
                                Day Streak
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Recent Entries */}
            <section className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                        📝 All Entries
                    </h2>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs gap-1 cursor-pointer"
                        onClick={() => setIsSearchModalOpen(true)}
                    >
                        <Search className="w-3 h-3" />
                        Search & Filter
                    </Button>
                </div>
                {/* Entries */}
                <div className="space-y-3">
                    {entries.map((entry) => (
                        <Card key={entry.id} className="relative group hover:border-indigo-200 transition-all">
                            <CardContent className="p-4">
                                {/* Date & Category */}
                                <div className="flex justify-between items-start mb-2">
                                    <span className="flex items-center gap-2 text-xs font-medium text-slate-400">
                                        <Clock className="w-4 h-4" />
                                        {new Date(entry.createdAt).toLocaleDateString()} at {new Date(entry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    <Badge className={`text-[10px] uppercase font-bold px-2 py-0.5 border ${getCategoryColor(entry.category)}`}>
                                        {entry.category || 'General'}
                                    </Badge>
                                </div>
                                {/* Title */}
                                <h3 className="text-md font-semibold mb-1 truncate">{entry.title}</h3>
                                {/* Content */}
                                <p className="text-sm font-medium italic line-clamp-3 mb-2">
                                    {entry.isTidied ? entry.tidyContent : entry.rawContent}
                                </p>
                                {/* Mood Badge */}
                                <div className="flex items-center gap-2">
                                    <Badge className={`flex items-center gap-2 px-2 py-0.5 ${getMoodColor(entry.mood)}`}>
                                        <div className="flex-shrink-0">
                                            {getMoodIcon(entry.mood)}
                                        </div>
                                        <span className="capitalize text-sm font-medium">
                                            {entry.mood?.toLowerCase() || 'Neutral'}
                                        </span>
                                    </Badge>
                                </div>
                            </CardContent>
                            {/* Delete Button */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute bottom-2 right-2 h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer" onClick={() => handleDelete(entry.id)}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                            {/* Edit Button */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute bottom-2 right-12 h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 cursor-pointer"
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
                                className="bg-white text-indigo-600 hover:bg-white/90 cursor-pointer"
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
