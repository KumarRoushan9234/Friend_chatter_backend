import express from 'express';
import {getMessages, getUsers,sendMessages} from '../controllers/message.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get("/users",protectRoute,getUsers);
router.get("/:id",protectRoute,getMessages);
// very important we get the messages with the user with id

// route to send messages
router.post("/send/:id",protectRoute,sendMessages);

// all these routes should be protected or even the unauthorized users can send messages.


export default router;