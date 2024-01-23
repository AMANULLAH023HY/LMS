import {Router} from 'express';
import { getProfile, login, logout, register } from '../controllers/user.controller.js';
import { isLonggedIn } from '../middlewares/auth.middleware.js';
import upload from '../middlewares/multer.middleware.js';

const router = Router();

router.post('/register',upload.single("avatar"), register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me',isLonggedIn, getProfile);




export default router;