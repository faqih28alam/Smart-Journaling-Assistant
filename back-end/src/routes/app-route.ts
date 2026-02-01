// app-route.ts 
// src/routes/app-route.ts

import express from 'express';

// Controllers
import { handleTidyUp, handleSaveToDatabase } from '../controllers/app-controller';

const router = express.Router();

// Routes
router.post('/tidy', handleTidyUp)
router.post('/save-entry', handleSaveToDatabase)

export default router;