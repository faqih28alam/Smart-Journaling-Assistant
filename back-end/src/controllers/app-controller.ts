// App-controller.ts
// src/controllers/app-controller.ts

import { Request, Response, NextFunction } from "express";
import { prisma } from "../connection/client";
import AppError from "../utils/app-error";
// import OpenAI from "openai";
import { Groq } from "groq-sdk";
import { any } from "joi";

// Initialize OpenAI with .env key
// const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY,
// });
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