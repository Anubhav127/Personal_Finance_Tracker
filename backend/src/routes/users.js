import express from 'express';
import { getUserProfile, updateUserProfile } from '../controllers/userController.js';
import {authenticateToken ,authorizeRoles} from '../middleware/auth.js';
import Router from 'express';

const router = Router();

router.get('/profile', authenticateToken, authorizeRoles(['admin']), getUserProfile);

router.put('/profile/:id', authenticateToken, authorizeRoles(['admin']), updateUserProfile);

export default router;

