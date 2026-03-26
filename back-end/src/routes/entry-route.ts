// src/routes/entry-route.ts
import express from 'express'

import {
    getDashboardData,
    getEntries,
    deleteEntry
} from '../controllers/entry-controller';

const router = express.Router();

// routes for pagination
router.get('/dashboard', getDashboardData);
router.get('/entries', getEntries);
router.delete('/entries/:entryId', deleteEntry);

export default router;