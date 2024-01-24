import {Router} from 'express';
import { changePassword, forgotPassword, getProfile, login, logout, register, resetPassword, updateUser } from '../controllers/user.controller.js';
import { isLonggedIn } from '../middlewares/auth.middleware.js';
import upload from '../middlewares/multer.middleware.js';

const router = Router();

router.post('/register',upload.single("avatar"), register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me',isLonggedIn, getProfile);
router.post('/reset', forgotPassword);
router.post('/reset/:resetToken', resetPassword);
router.post('/chnage-passorod', isLonggedIn, changePassword);
router.put('/update/', isLonggedIn,upload.single("avatar"),updateUser);




export default router;