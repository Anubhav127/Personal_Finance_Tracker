import express from 'express';
import { Router } from 'express';
import {register, login} from '../controllers/authController.js';
import { authlimiter } from '../middleware/ratelimiter.js';

const router = Router();

// Apply rate limiter to all auth routes
router.use(authlimiter);

//register route
router.post('/register', register);

//login route
router.post('/login', login);

export default router;