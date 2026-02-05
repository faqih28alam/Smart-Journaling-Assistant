// SearchEntryModal.tsx
// src/components/SearchEntryModal.tsx
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Search, X, Clock, Smile, Frown, Meh, Pencil, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

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

interface SearchEntryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onEdit: (entry: Entry) => void;
    onDelete: (id: string) => void;
}

const MOODS = ['HAPPY', 'SAD', 'ANGRY', 'FRUSTRATED', 'ANXIOUS', 'EXCITED', 'CALM', 'TIRED', 'NEUTRAL'];
const CATEGORIES = ['WORK', 'PERSONAL', 'IDEAS', 'GOALS', 'REFLECTION'];

export const SearchEntryModal = ({ isOpen, onClose, onEdit, onDelete }: SearchEntryModalProps) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMood, setSelectedMood] = useState<string>('all');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedDateRange, setSelectedDateRange] = useState<string>('all');

    const [allEntries, setAllEntries] = useState<Entry[]>([]);
    const [filteredEntries, setFilteredEntries] = useState<Entry[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Debounce state
    const [debouncedQuery, setDebouncedQuery] = useState('');

    // Debounce the search query (wait 500ms after user stops typing)
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Fetch entries when debounced query or filters change
    useEffect(() => {
        if (isOpen && (debouncedQuery.trim() || selectedMood !== 'all' || selectedCategory !== 'all' || selectedDateRange !== 'all')) {
            fetchAllEntries();
        }
    }, [isOpen, debouncedQuery, selectedMood, selectedCategory, selectedDateRange]);

    // Apply filters whenever entries or filters change
    useEffect(() => {
        if (allEntries.length > 0) {
            applyFilters();
        }
    }, [searchQuery, selectedMood, selectedCategory, selectedDateRange, allEntries]);

    const fetchAllEntries = async () => {
        setIsLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('Entry')
                .select('*')
                .eq('userId', user.id)
                .order('createdAt', { ascending: false });

            if (!error && data) {
                setAllEntries(data);
            }
        } catch (error) {
            console.error('Fetch error:', error);
            toast.error("Failed to load entries");
        } finally {
            setIsLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...allEntries];

        // Text search
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(entry =>
                entry.rawContent.toLowerCase().includes(query) ||
                entry.tidyContent?.toLowerCase().includes(query) ||
                entry.title?.toLowerCase().includes(query)
            );
        }

        // Mood filter
        if (selectedMood !== 'all') {
            filtered = filtered.filter(entry => entry.mood === selectedMood);
        }

        // Category filter
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(entry => entry.category === selectedCategory);
        }

        // Date range filter
        if (selectedDateRange !== 'all') {
            const now = new Date();
            let daysAgo = 0;

            switch (selectedDateRange) {
                case 'today':
                    daysAgo = 1;
                    break;
                case 'week':
                    daysAgo = 7;
                    break;
                case 'month':
                    daysAgo = 30;
                    break;
            }

            if (daysAgo > 0) {
                const cutoffDate = new Date(now);
                cutoffDate.setDate(cutoffDate.getDate() - daysAgo);
                filtered = filtered.filter(entry =>
                    new Date(entry.createdAt) >= cutoffDate
                );
            }
        }

        setFilteredEntries(filtered);
    };

    const handleClearAll = () => {
        setSearchQuery('');
        setSelectedMood('all');
        setSelectedCategory('all');
        setSelectedDateRange('all');
        setAllEntries([]); // Clear entries when clearing filters
        setFilteredEntries([]);
    };

    const getMoodIcon = (mood?: string) => {
        switch (mood?.toUpperCase()) {
            case 'HAPPY':
            case 'EXCITED':
            case 'CALM':
                return <Smile className="w-4 h-4 text-green-500" />;
            case 'FRUSTRATED':
            case 'ANGRY':
            case 'SAD':
            case 'ANXIOUS':
                return <Frown className="w-4 h-4 text-red-500" />;
            default:
                return <Meh className="w-4 h-4 text-slate-400" />;
        }
    };

    const activeFilterCount = [
        selectedMood !== 'all',
        selectedCategory !== 'all',
        selectedDateRange !== 'all'
    ].filter(Boolean).length;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Search className="w-5 h-5" />
                        Search & Filter Entries
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by content or title..."
                            className="pl-10 pr-10"
                            autoFocus
                        />
                        {searchQuery && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                                onClick={() => setSearchQuery('')}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        )}
                    </div>

                    {/* Filters */}
                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className="text-xs font-medium mb-1 block text-muted-foreground">Mood</label>
                            <Select value={selectedMood} onValueChange={setSelectedMood}>
                                <SelectTrigger className="h-9">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All moods</SelectItem>
                                    {MOODS.map(m => (
                                        <SelectItem key={m} value={m}>
                                            {m.charAt(0) + m.slice(1).toLowerCase()}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="text-xs font-medium mb-1 block text-muted-foreground">Category</label>
                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                <SelectTrigger className="h-9">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All categories</SelectItem>
                                    {CATEGORIES.map(c => (
                                        <SelectItem key={c} value={c}>
                                            {c.charAt(0) + c.slice(1).toLowerCase()}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="text-xs font-medium mb-1 block text-muted-foreground">Date Range</label>
                            <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
                                <SelectTrigger className="h-9">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All time</SelectItem>
                                    <SelectItem value="today">Today</SelectItem>
                                    <SelectItem value="week">Last 7 days</SelectItem>
                                    <SelectItem value="month">Last 30 days</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Active Filters & Clear */}
                    {activeFilterCount > 0 && (
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                                {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} active
                            </span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleClearAll}
                                className="h-7 text-xs"
                            >
                                Clear all
                            </Button>
                        </div>
                    )}

                    {/* Results */}
                    <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                        {isLoading ? (
                            <div className="text-center py-8 text-muted-foreground">
                                Loading entries...
                            </div>
                        ) : allEntries.length === 0 && !searchQuery.trim() && selectedMood === 'all' && selectedCategory === 'all' && selectedDateRange === 'all' ? (
                            <div className="text-center py-12">
                                <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                                <p className="text-muted-foreground font-medium">Start typing to search your entries</p>
                                <p className="text-sm text-muted-foreground/70 mt-1">or use the filters above</p>
                            </div>
                        ) : filteredEntries.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-muted-foreground">No entries match your search.</p>
                            </div>
                        ) : (
                            <>
                                <div className="text-xs text-muted-foreground mb-2">
                                    Found {filteredEntries.length} {filteredEntries.length === 1 ? 'entry' : 'entries'}
                                </div>
                                {filteredEntries.map((entry) => (
                                    <Card key={entry.id} className="relative group hover:border-indigo-200 transition-all">
                                        <CardContent className="p-4">
                                            {/* Date & Category */}
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {new Date(entry.createdAt).toLocaleDateString()} at{' '}
                                                    {new Date(entry.createdAt).toLocaleTimeString([], {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                                <Badge variant="secondary" className="text-[10px] uppercase font-bold px-2 py-0">
                                                    {entry.category || 'General'}
                                                </Badge>
                                            </div>

                                            {/* Title */}
                                            {entry.title && (
                                                <h4 className="font-semibold text-sm mb-1">{entry.title}</h4>
                                            )}

                                            {/* Content */}
                                            <p className="text-sm line-clamp-3 mb-2">
                                                {entry.isTidied ? entry.tidyContent : entry.rawContent}
                                            </p>

                                            {/* Mood */}
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                {getMoodIcon(entry.mood)}
                                                <span className="capitalize">{entry.mood?.toLowerCase() || 'Neutral'}</span>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                                                    onClick={() => {
                                                        onEdit(entry);
                                                        onClose();
                                                    }}
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                                    onClick={() => {
                                                        onDelete(entry.id);
                                                        fetchAllEntries(); // Refresh after delete
                                                    }}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};