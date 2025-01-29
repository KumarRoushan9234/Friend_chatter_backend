import express from 'express';
import { registerUser,loginUser,logoutUser,updateUser,checkAuth} from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

// Route to register new chatter
router.post('/register', registerUser);

router.post('/login', loginUser);

router.post('/logout', logoutUser);

router.put('/update-profile',protectRoute,updateUser);

router.get("/check-auth",protectRoute,checkAuth);
// chcek if the user is authenticated or not 

// similar to this we can add the admin and other things

export default router;
