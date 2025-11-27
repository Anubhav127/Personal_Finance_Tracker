import express from 'express';
import { Router } from 'express';
import {register, login} from '../controllers/authController.js';

const router = Router();

//register route
router.post('/register', register);

//login route
router.post('/login', login);

export default router;