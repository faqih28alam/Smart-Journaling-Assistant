// search-controller.ts
// src/services/controllers/search-controller.ts

import { Request, Response, NextFunction } from "express";
import { prisma } from "../../connection/client";


// Controller function for searching and filtering entries
export async function handleSearchEntries(req: Request, res: Response, next: NextFunction) {
    try {
        const { userId, searchText, mood, category, startDate, endDate } = req.query;

        if (!userId) {
            return res.status(400).json({ error: "userId is required" });
        }

        console.log("=== SEARCHING ENTRIES ===");
        console.log("Filters:", { userId, searchText, mood, category, startDate, endDate });

        // Build filter conditions
        const where: any = {
            userId: userId as string,
        };

        // Text search (search in both rawContent and tidyContent)
        if (searchText) {
            where.OR = [
                { rawContent: { contains: searchText as string, mode: 'insensitive' } },
                { tidyContent: { contains: searchText as string, mode: 'insensitive' } },
                { title: { contains: searchText as string, mode: 'insensitive' } }
            ];
        }

        // Mood filter
        if (mood && mood !== 'ALL') {
            where.mood = mood as string;
        }

        // Category filter
        if (category && category !== 'ALL') {
            where.category = category as string;
        }

        // Date range filter
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate) {
                where.createdAt.gte = new Date(startDate as string);
            }
            if (endDate) {
                where.createdAt.lte = new Date(endDate as string);
            }
        }

        // Fetch filtered entries
        const entries = await prisma.entry.findMany({
            where,
            orderBy: {
                createdAt: 'desc'
            }
        });

        console.log(`Found ${entries.length} entries`);
        res.status(200).json(entries);

    } catch (error: any) {
        console.error("SEARCH ENTRIES ERROR:", error);
        res.status(500).json({ error: "Failed to search entries" });
    }
}