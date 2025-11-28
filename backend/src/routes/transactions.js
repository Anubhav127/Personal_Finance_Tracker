import express from 'express';
import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { transactionlimiter } from '../middleware/ratelimiter.js';
import { createTransaction, updateTransaction, deleteTransaction, getTransactions } from '../controllers/transactionController.js';

const router = Router();

//apply rate limiter to all transaction routes
router.use(transactionlimiter);
router.use(authenticateToken);

router.post('/', createTransaction);

router.patch('/:id', updateTransaction);

router.delete('/:id', deleteTransaction);

router.get('/', getTransactions);

export default router;