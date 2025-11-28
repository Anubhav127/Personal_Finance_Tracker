import express from 'express';
import { Router } from 'express';
import {authenticateToken} from '../middleware/auth.js';
import { analyticslimiter } from '../middleware/ratelimiter.js';
import {getMonthlyAnalytics, getCategoryBreakdown, getIncomeExpenseTrends} from '../controllers/analyticsController.js';


const router = Router();

router.use(authenticateToken);
router.use(analyticslimiter);

router.get('/monthly', getMonthlyAnalytics);

router.get('/category', getCategoryBreakdown);

router.get('/trends', getIncomeExpenseTrends);

export default router;
