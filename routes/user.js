import express from 'express';
import { registerUser } from '../controllers/user.js';

const router = express.Router();

// Route to register new chatter
router.post('/register', registerUser);

export default router;
