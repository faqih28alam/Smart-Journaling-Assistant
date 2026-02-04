// Dashborad.tsx
// src/pages/Dashboard.tsx
// This Page shows Stats: Number of entry, streaks count, etc.

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
    Trash2
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

const Dashboard = () => {
    const [entries, setEntries] = useState<Entry[]>([]);
    const [stats, setStats] = useState({ count: 0, streak: 0 });

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
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">📝 All Entries</h2>
                    <Button variant="ghost" size="sm" className="text-xs text-gray-400 hover:text-gray-500 cursor-pointer">View All</Button>
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
                        </Card>
                    ))}
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
                    <p className="text-lg font-medium leading-relaxed">
                        "You focused on work-life balance and made progress on your personal goals despite a busy week."
                    </p>
                    <Button variant="secondary" className="w-full bg-white/10 hover:bg-white/20 border-none text-white backdrop-blur-md">
                        See Details <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default Dashboard;
