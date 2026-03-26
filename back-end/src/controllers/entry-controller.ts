// src/controllers/entry-controller.ts
import { Request, Response, NextFunction } from 'express';
import EntryModel from '../models/entry-model';
import { prisma } from '../connection/client';

export async function getDashboardData(req: Request, res: Response, next: NextFunction) {
    try {
        const { userId } = req.query;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        if (!userId) {
            return res.status(400).json({ error: 'userId is required' });
        }

        // Fetch entries with pagination
        const entriesData = await EntryModel.getEntries({
            userId: userId as string,
            page,
            limit
        });

        // Fetch user stats
        const stats = await EntryModel.getUserStats(userId as string);

        // Fetch latest insight
        const insight = await EntryModel.getLatestInsight(userId as string);

        res.status(200).json({
            entries: entriesData.entries,
            pagination: entriesData.pagination,
            stats,
            insight
        });

    } catch (error: any) {
        console.error('GET DASHBOARD ERROR:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
}

export async function getEntries(req: Request, res: Response, next: NextFunction) {
    try {
        const { userId } = req.query;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        if (!userId) {
            return res.status(400).json({ error: 'userId is required' });
        }

        const data = await EntryModel.getEntries({
            userId: userId as string,
            page,
            limit
        });

        res.status(200).json(data);

    } catch (error: any) {
        console.error('GET ENTRIES ERROR:', error);
        res.status(500).json({ error: 'Failed to fetch entries' });
    }
}

export async function deleteEntry(req: Request, res: Response, next: NextFunction) {
    try {
        const entryId = req.params.entryId as string;
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ error: 'userId is required' });
        }

        if (!entryId) {
            return res.status(400).json({ error: 'entryId is required' });
        }

        await EntryModel.deleteEntry(entryId, userId);

        // Update total entries count
        await prisma.user.update({
            where: { id: userId },
            data: {
                totalEntries: {
                    decrement: 1
                }
            }
        });

        res.status(200).json({ message: 'Entry deleted successfully' });

    } catch (error: any) {
        console.error('DELETE ENTRY ERROR:', error);

        if (error.message === 'Entry not found or unauthorized') {
            return res.status(404).json({ error: error.message });
        }

        res.status(500).json({ error: 'Failed to delete entry' });
    }
}