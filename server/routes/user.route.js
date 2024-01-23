import {Router} from 'express';
import { getProfile, login, logout, register } from '../controllers/user.controller.js';
import { isLonggedIn } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me',isLonggedIn, getProfile);




export default router;