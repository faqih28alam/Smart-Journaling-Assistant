// app.ts
// src/app.ts

import express, { Request, Response } from 'express';
import appRoutes from './routes/app-route';
import entryRoutes from './routes/entry-route'
import corsMiddleware from './middlewares/cors';
import path from 'path';

const app = express();

// Middleware to parse JSON bodies (Crucial for Postman POST requests)
app.use(express.json());
// Middleware for CORS
app.use(corsMiddleware);

// Routes
app.use('/api', appRoutes);
app.use('/api', entryRoutes);
// Add this above your global error handler
app.get('/', (req, res) => {
    res.send('Backend Server is running! Use /api for routes.');
});

// global error handler: middleware for any unexpected errors 
app.use((err: any, req: any, res: any, next: any) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ // Changed .send to .json for consistency
        success: false,
        message: err.message || 'Internal Server Error'
    });
});

// Start server and listen on specified port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Backend Server running on Port ${PORT}`);
});

export default app;