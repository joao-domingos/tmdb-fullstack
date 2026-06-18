// Filled in phase 3 (auth routes + requireAuth middleware-in-file).
import { Router } from 'express';

export const authRouter = Router();

authRouter.get('/__phase', (req, res) => res.json({ phase: 2, route: 'auth' }));
