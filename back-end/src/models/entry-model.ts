// src/models/entry-model.ts
import { prisma } from '../connection/client';

export interface GetEntriesParams {
    userId: string;
    page?: number;
    limit?: number;
}

export interface PaginatedEntries {
    entries: any[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalEntries: number;
        hasMore: boolean;
        limit: number;
    };
}

class EntryModel {
    // Get paginated entries
    async getEntries({ userId, page = 1, limit = 10 }: GetEntriesParams): Promise<PaginatedEntries> {
        const skip = (page - 1) * limit;

        // Get total count for pagination
        const totalEntries = await prisma.entry.count({
            where: { userId }
        });

        // Fetch entries with pagination
        const entries = await prisma.entry.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
            select: {
                id: true,
                title: true,
                rawContent: true,
                tidyContent: true,
                isTidied: true,
                mood: true,
                category: true,
                createdAt: true,
                updatedAt: true,
            }
        });

        const totalPages = Math.ceil(totalEntries / limit);
        const hasMore = page < totalPages;

        return {
            entries,
            pagination: {
                currentPage: page,
                totalPages,
                totalEntries,
                hasMore,
                limit
            }
        };
    }

    // Get user stats (for dashboard)
    async getUserStats(userId: string) {
        const totalEntries = await prisma.entry.count({
            where: { userId }
        });

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                streakCount: true,
                totalEntries: true
            }
        });

        return {
            count: totalEntries,
            streak: user?.streakCount || 0
        };
    }

    // Get latest weekly insight
    async getLatestInsight(userId: string) {
        return await prisma.weeklyInsight.findFirst({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                summary: true,
                topThemes: true,
                moodData: true,
                startDate: true,
                endDate: true,
                createdAt: true
            }
        });
    }

    // Delete entry
    async deleteEntry(entryId: string, userId: string) {
        // Verify ownership before deleting
        const entry = await prisma.entry.findFirst({
            where: {
                id: entryId,
                userId: userId
            }
        });

        if (!entry) {
            throw new Error('Entry not found or unauthorized');
        }

        return await prisma.entry.delete({
            where: { id: entryId }
        });
    }
}

export default new EntryModel();