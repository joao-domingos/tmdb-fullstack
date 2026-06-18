// Filled in phase 4 (TMDB proxy + Redis cache).
import { Router } from 'express';

export const moviesRouter = Router();

moviesRouter.get('/__phase', (req, res) => res.json({ phase: 2, route: 'movies' }));
