
import {Router} from 'express';
import { allPayments, buySubscription, cancelSubcription, getRazorpayApiKey, verifySubscription } from '../controllers/payment.controller.js';
import { authorizedRoles, isLonggedIn } from '../middlewares/auth.middleware.js';

const router = Router();

router
.route('/razorpay-key')
.get(
    isLonggedIn,
    getRazorpayApiKey
    );

router
.route('/subscribe')
.post(
    isLonggedIn,
    buySubscription);

router
.route('/verify')
.post(
    isLonggedIn,
    verifySubscription);


router
.route('/unsubdcribe')
.post(
    isLonggedIn,
    cancelSubcription);

router
.route('/')
.get(
    isLonggedIn,
    authorizedRoles('ADMIN'),
    allPayments);

export default router;