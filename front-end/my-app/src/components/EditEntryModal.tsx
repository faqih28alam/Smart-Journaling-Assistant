// EditEntryModal.tsx
// src/components/EditEntryModal.tsx
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Sparkles } from "lucide-react";

interface Entry {
    id: string;
    title?: string;
    rawContent: string;
    tidyContent?: string;
    mood?: string;
    category?: string;
    isTidied?: boolean;
}

interface EditEntryModalProps {
    entry: Entry | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
}

const MOODS = ['HAPPY', 'SAD', 'ANGRY', 'FRUSTRATED', 'ANXIOUS', 'EXCITED', 'CALM', 'TIRED', 'NEUTRAL'];
const CATEGORIES = ['WORK', 'PERSONAL', 'IDEAS', 'GOALS', 'REFLECTION'];

export const EditEntryModal = ({ entry, isOpen, onClose, onSave }: EditEntryModalProps) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tidyContent, setTidyContent] = useState('');
    const [mood, setMood] = useState('NEUTRAL');
    const [category, setCategory] = useState('PERSONAL');
    const [isTidying, setIsTidying] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showTidied, setShowTidied] = useState(false);

    // Update state when entry changes
    useEffect(() => {
        if (entry) {
            setTitle(entry.title || '');
            setContent(entry.rawContent);
            setTidyContent(entry.tidyContent || '');
            setMood(entry.mood || 'NEUTRAL');
            setCategory(entry.category || 'PERSONAL');
            setShowTidied(!!entry.isTidied);
        }
    }, [entry]);

    const handleTidyUp = async () => {
        if (!content.trim()) {
            toast.error("Please write something first");
            return;
        }

        setIsTidying(true);
        try {
            const response = await fetch('http://localhost:3000/api/tidy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: content })
            });

            const data = await response.json();

            if (response.ok) {
                setTidyContent(data.tidyContent);
                setMood(data.mood);
                setCategory(data.category);
                setShowTidied(true);
                toast.success("Entry tidied up!");
            } else {
                toast.error("Failed to tidy up");
            }
        } catch (error) {
            console.error('Tidy error:', error);
            toast.error("Failed to tidy up");
        } finally {
            setIsTidying(false);
        }
    };

    const handleSave = async () => {
        if (!entry) return;

        setIsSaving(true);
        try {
            const response = await fetch(`http://localhost:3000/api/update-entry/${entry.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: title.trim() || null,
                    rawContent: content,
                    tidyContent: showTidied ? tidyContent : null,
                    mood,
                    category,
                    isTidied: showTidied
                })
            });

            if (response.ok) {
                toast.success("Entry updated!");
                onSave();
                onClose();
            } else {
                toast.error("Failed to update entry");
            }
        } catch (error) {
            console.error('Save error:', error);
            toast.error("Failed to update entry");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Entry</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Title */}
                    <div>
                        <label className="text-sm font-medium mb-2 block">Title (optional)</label>
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Give your entry a title..."
                        />
                    </div>

                    {/* Content */}
                    <div>
                        <label className="text-sm font-medium mb-2 block">Content</label>
                        <Textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Write your thoughts..."
                            className="min-h-[150px]"
                        />
                    </div>

                    {/* Tidy Up Button */}
                    <Button
                        onClick={handleTidyUp}
                        disabled={isTidying || !content.trim()}
                        variant="outline"
                        className="w-full"
                    >
                        {isTidying ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Tidying up...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4 mr-2" />
                                Tidy Up with AI
                            </>
                        )}
                    </Button>

                    {/* Tidied Content */}
                    {showTidied && tidyContent && (
                        <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                            <label className="text-sm font-medium mb-2 block text-indigo-900">
                                ✨ Tidied Version
                            </label>
                            <Textarea
                                value={tidyContent}
                                onChange={(e) => setTidyContent(e.target.value)}
                                className="min-h-[100px] bg-white"
                            />
                        </div>
                    )}

                    {/* Mood & Category */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium mb-2 block">Mood</label>
                            <Select value={mood} onValueChange={setMood}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {MOODS.map(m => (
                                        <SelectItem key={m} value={m}>
                                            {m.charAt(0) + m.slice(1).toLowerCase()}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-2 block">Category</label>
                            <Select value={category} onValueChange={setCategory}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {CATEGORIES.map(c => (
                                        <SelectItem key={c} value={c}>
                                            {c.charAt(0) + c.slice(1).toLowerCase()}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving || !content.trim()}>
                        {isSaving ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            'Save Changes'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};