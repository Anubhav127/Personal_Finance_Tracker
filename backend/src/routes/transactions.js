import express from 'express';
import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { createTransaction, updateTransaction, deleteTransaction, getTransactions } from '../controllers/transactionController.js';

const router = Router();

router.post('/', authenticateToken, createTransaction);

router.patch('/:id', authenticateToken, updateTransaction);

router.delete('/:id', authenticateToken, deleteTransaction);

router.get('/', authenticateToken, getTransactions);

export default router;