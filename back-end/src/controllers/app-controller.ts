// App-controller.ts
// src/controllers/app-controller.ts

// Imports
import { Request, Response, NextFunction } from "express";
import { prisma } from "../connection/client";
import AppError from "../utils/app-error";
// import OpenAI from "openai";
import { Groq } from "groq-sdk";

// Initialize Groq
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

// Controller function for tidy up request
export async function handleTidyUp(req: Request, res: Response, next: NextFunction) {
    try {
        const { text } = req.body;

        const completion = await groq.chat.completions.create({
            // model: "gpt-4o-mini",
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: `You are a helpful journaling assistant. 
                    Return ONLY a JSON object with:
                    - tidyContent: A polished version of the user's notes.
                    - mood: Choose from [HAPPY, SAD, ANGRY, FRUSTRATED, ANXIOUS, EXCITED, CALM, TIRED, NEUTRAL].
                    - category: Choose from [WORK, PERSONAL, IDEAS, GOALS, REFLECTION].`
                },
                { role: "user", content: text }
            ],
            response_format: { type: "json_object" }
        });

        const aiResponse = JSON.parse(completion.choices[0].message.content || "{}");

        // Send back to Frontend without saving
        res.status(200).json(aiResponse);
    } catch (error: any) {
        console.error("GROQ ERROR:", error.message);
        res.status(500).json({ error: "AI Processing failed" });
    }
};


// Controller function for saving to database
export async function handleSaveToDatabase(req: Request, res: Response, next: NextFunction) {
    try {
        const { userId, email, rawContent, tidyContent, mood, category, isTidied } = req.body;

        console.log("=== ATTEMPTING CREATE ===");
        console.log("Data:", { userId, rawContent, tidyContent, mood, category, isTidied });

        // Check if user exists in DB, if not, create them (or link them)
        await prisma.user.upsert({
            where: { id: userId },
            update: {}, // If they exist, do nothing | Keep email synced if it changes
            create: {
                id: userId,
                email: email // Ideally, pass email from frontend too
            },
        });

        // Save via Prisma
        const newEntry = await prisma.entry.create({
            data: {
                userId,
                rawContent,
                tidyContent: tidyContent || null,
                mood: mood || 'NEUTRAL',
                category: category || 'PERSONAL',
                isTidied: !!isTidied
            }
        }).catch(err => {
            console.log("=== FULL ERROR ===");
            console.log("Code:", err.code);
            console.log("Meta:", err.meta);
            console.log("Message:", err.message);
            throw err;
        });

        // Prisma handles the push to Supabase
        res.status(201).json(newEntry);
    } catch (error) {
        console.error("PRISMA SAVE ERROR:", error);
        res.status(500).json({ error: "Database save failed" });
    }
};

// Controller function for updating an entry
export async function handleUpdateEntry(req: Request, res: Response, next: NextFunction) {
    try {
        const entryId = req.params.entryId as string;
        const { rawContent, tidyContent, mood, category, isTidied, title } = req.body;

        console.log("=== UPDATING ENTRY ===");
        console.log("Entry ID:", entryId);
        console.log("Update data:", { rawContent, tidyContent, mood, category, isTidied, title });

        // Update the entry
        const updatedEntry = await prisma.entry.update({
            where: { id: entryId },
            data: {
                ...(rawContent && { rawContent }),
                ...(tidyContent !== undefined && { tidyContent }),
                ...(mood && { mood }),
                ...(category && { category }),
                ...(isTidied !== undefined && { isTidied }),
                ...(title !== undefined && { title }),
                updatedAt: new Date()
            }
        });

        console.log("=== ENTRY UPDATED ===");
        res.status(200).json(updatedEntry);

    } catch (error: any) {
        console.error("UPDATE ENTRY ERROR:", error);
        res.status(500).json({ error: "Failed to update entry" });
    }
}

// Controller function for generating weekly insights
export async function handleGenerateWeeklyInsight(req: Request, res: Response, next: NextFunction) {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ error: "userId is required" });
        }

        // Calculate date range (last 7 days)
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);

        console.log("=== GENERATING WEEKLY INSIGHT ===");
        console.log("User ID:", userId);
        console.log("Date range:", startDate.toISOString(), "to", endDate.toISOString());

        // Fetch entries from last 7 days
        const entries = await prisma.entry.findMany({
            where: {
                userId: userId,
                createdAt: {
                    gte: startDate,
                    lte: endDate
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        console.log(`Found ${entries.length} entries for insight generation`);

        // Check if user has enough entries
        if (entries.length === 0) {
            return res.status(400).json({
                error: "Not enough entries. Write at least 1 entry to generate insights."
            });
        }

        // Prepare data for AI analysis
        const entriesText = entries.map((entry, idx) =>
            `Entry ${idx + 1} (${entry.createdAt?.toLocaleDateString()}):
            Content: ${entry.tidyContent || entry.rawContent}
            Mood: ${entry.mood}
            Category: ${entry.category}`
        ).join('\n\n');

        // Count mood distribution
        const moodCounts: Record<string, number> = {};
        entries.forEach(entry => {
            const mood = entry.mood || 'NEUTRAL';
            moodCounts[mood] = (moodCounts[mood] || 0) + 1;
        });

        // Generate AI insight
        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: `You are a thoughtful journaling coach analyzing someone's week.
                    Analyze the journal entries and provide insights.
                    
                    Return ONLY a JSON object with:
                    - summary: A 2-3 sentence encouraging summary of their week (string)
                    - topThemes: Array of 3-5 key themes you noticed (array of strings)
                    
                    Be warm, encouraging, and insightful. Focus on growth and patterns.`
                },
                {
                    role: "user",
                    content: `Analyze these ${entries.length} journal entries from the past week:\n\n${entriesText}`
                }
            ],
            response_format: { type: "json_object" }
        });

        const aiInsight = JSON.parse(completion.choices[0].message.content || "{}");

        // Save insight to database
        const weeklyInsight = await prisma.weeklyInsight.create({
            data: {
                userId: userId,
                startDate: startDate,
                endDate: endDate,
                summary: aiInsight.summary || "No summary generated",
                topThemes: aiInsight.topThemes || [],
                moodData: moodCounts
            }
        });

        console.log("=== INSIGHT GENERATED ===");
        console.log("Insight ID:", weeklyInsight.id);

        // Return the full insight with mood data
        res.status(201).json({
            ...weeklyInsight,
            entriesAnalyzed: entries.length
        });

    } catch (error: any) {
        console.error("WEEKLY INSIGHT ERROR:", error);
        res.status(500).json({ error: "Failed to generate weekly insight" });
    }
}