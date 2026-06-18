// Filled in phase 4 (CRUD + toggle).
import { Router } from 'express';

export const watchlistRouter = Router();

watchlistRouter.get('/__phase', (req, res) => res.json({ phase: 2, route: 'watchlist' }));
