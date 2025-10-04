import express from 'express';
import { signup, signin } from '../controllers/auth.controller.js';
import { signOut } from '../services/auth.service.js';

const router = express.Router();

router.post('/sign-up', signup);

router.post('/sign-in', signin);

router.post('/sign-out', signOut);

export default router;
