import User from "../model/user.model.js";
import { razorpay } from "../server.js";
import AppErorr from "../utils/error.util.js";
import crypto from "crypto";

const getRazorpayApiKey = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: "Razorpay API key",
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    return next(new AppErorr(error.message, 500));
  }
};

const buySubscription = async (req, res, next) => {
  try {
    const { id } = req.user;

    const user = await User.findById(id);

    if (!user) {
      return next(new AppErorr("Unautherized ,Please login "));
    }

    if (user.role === "ADMIN") {
      return next(new AppErorr("Admin can not purchase a subscription", 400));
    }

    const subscription = await razorpay.subscription.create({
      plan_id: process.env.RAZORPAY_PLAN_ID,
      customer_notify: 1,
    });

    user.subscription.id = subscription.id;
    user.subscription.status = subscription.status;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Subscribed Successfully!",
      subscription_id: subscription.id,
    });
  } catch (error) {
    return next(new AppErorr(error.message, 500));
  }
};

const verifySubscription = async (req, res, next) => {
  try {
    const { id } = req.user;
    const {
      razorpay_payment_id,
      razorpay_signature,
      razorpay_subscription_id,
    } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return next(new AppErorr("Unautherized ,Please login "));
    }

    const subscriptionId = user.subscription.id;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SCRET)
      .update(`${razorpay_payment_id}|${subscriptionId}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return next(new AppErorr("Payment not verified , please try again", 400));
    }

    await Payment.create({
      razorpay_payment_id,
      razorpay_signature,
      razorpay_subscription_id,
    });

    user.subscription.status = "active";

    await user.save();

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
    });
  } catch (error) {
    return next(new AppErorr(error.message, 500));
  }
};

const cancelSubcription = async (req, res, next) => {
  try {
    const { id } = req.user;

    const user = await User.findById(id);

    if (!user) {
      return next(new AppErorr("Unautherized ,Please login "));
    }

    if (user.role === "ADMIN") {
      return next(new AppErorr("Admin can not purchase a subscription", 400));
    }

    const subscriptionId = user.subscription.id;

    const subscription = await razorpay.subscriptions.cancel(subscriptionId);

    user.subscription.status = subscription.status;

    await user.save();
  } catch (error) {
    return next(new AppErorr(error.message, 500));
  }
};


const allPayments = async (req, res, next) => {
try {
    
    const {count} = req.query;
    const subscriptions  = await razorpay.subscriptions.all({
        count:count||10
    });

    res.status(200).json({
        success:true,
        message:'All payments',
        subscriptions
    })

} catch (error) {
    return next(new AppErorr(error.message, 500));
    
}


};

export {
  getRazorpayApiKey,
  buySubscription,
  verifySubscription,
  cancelSubcription,
  allPayments,
};
