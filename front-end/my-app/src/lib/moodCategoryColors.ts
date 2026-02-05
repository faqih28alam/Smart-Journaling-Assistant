// src/lib/moodCategoryColors.ts

export const getMoodColor = (mood?: string): string => {
    switch (mood?.toUpperCase()) {
        case 'HAPPY':
            return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        case 'EXCITED':
            return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        case 'CALM':
            return 'bg-blue-100 text-blue-700 border-blue-200';
        case 'SAD':
            return 'bg-gray-100 text-gray-700 border-gray-200';
        case 'ANGRY':
            return 'bg-red-100 text-red-700 border-red-200';
        case 'FRUSTRATED':
            return 'bg-red-100 text-red-700 border-red-200';
        case 'ANXIOUS':
            return 'bg-purple-100 text-purple-700 border-purple-200';
        case 'TIRED':
            return 'bg-slate-100 text-slate-700 border-slate-200';
        case 'NEUTRAL':
        default:
            return 'bg-neutral-100 text-neutral-700 border-neutral-200';
    }
};

export const getCategoryColor = (category?: string): string => {
    switch (category?.toUpperCase()) {
        case 'WORK':
            return 'bg-indigo-100 text-indigo-700 border-indigo-200';
        case 'PERSONAL':
            return 'bg-pink-100 text-pink-700 border-pink-200';
        case 'IDEAS':
            return 'bg-amber-100 text-amber-700 border-amber-200';
        case 'GOALS':
            return 'bg-emerald-100 text-emerald-700 border-emerald-200';
        case 'REFLECTION':
            return 'bg-violet-100 text-violet-700 border-violet-200';
        default:
            return 'bg-gray-100 text-gray-700 border-gray-200';
    }
};