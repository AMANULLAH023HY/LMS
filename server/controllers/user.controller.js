import User from "../model/user.model.js";
import AppErorr from "../utils/error.util.js";
import cloudinary from "cloudinary";
import fs from "fs/promises";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";

const cookieOption = {
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  httpOnly: true,
  secure: true,
};

const register = async (req, res, next) => {
  const [fullName, email, password] = req.body;

  if (!fullName || !email || !password) {
    return next(new AppErorr("All field id required", 400));
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    return next(new AppErorr("Email already exists", 400));
  }

  const user = await User.create({
    fullName,
    email,
    password,
    avatar: {
      public_url: email,
      secure_url:
        "https://res.cloudinary.com/du9jzqlpt/image/upload/v1674647316/avatar_drzgxv.jpg",
    },
  });

  if (!user) {
    return next(
      new AppErorr("User registration failed, please try again ", 400)
    );
  }

  // TODO : file upload

  if (req.file) {
    try {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "LSM",
        width: 250,
        height: 250,
        gravity: "faces",
        crop: "fill",
      });

      if (result) {
        user.avatar.public_url = result.public_id;
        user.avatar.secure_url = result.secure_url;

        // Remove file from server
        fs.rm(`uploads/${req.file.filename}`);
      }
    } catch (error) {
      return next(
        new AppErorr(error || "File not uploaded, please try again", 500)
      );
    }
  }

  await user.save();

  user.password = undefined;

  const token = await user.generateJWTToken();

  res.cookie("token", token, cookieOption);

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    user,
  });
};

const login = async (req, res, next) => {
  try {
    cosnt[(email, password)] = req.body;

    if (!email || !password) {
      return next(new AppErorr("All filed are required ", 400));
    }
    const user = await User.findOne({ email }).select("+password");

    if (!user || !user.comparePassword(password)) {
      return next(new AppErorr("Email or Password does not match", 400));
    }

    const token = await user.generateJWTToken();
    user.password = undefined;

    res.cookie("token", token, cookieOption);

    res.status(200).json({
      success: true,
      message: "User loggedin successfully",
      user,
    });
  } catch (e) {
    return next(new AppErorr(e.message, 500));
  }
};

const logout = (req, res) => {
  res.cookie("token", null, {
    secure: true,
    maxAge: 0,
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "User logout successfully",
  });
};

const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const uder = await User.findOne(userId);

    res.status(200).json({
      success: true,
      messgae: "User details",
      user,
    });
  } catch (e) {
    return next(new AppErorr("Failed to fetch profile details", 500));
  }
};

const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new AppErorr("Email is required", 400));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return next(new AppErorr("Email not registerd", 400));
  }

  const resetToken = await user.generatePasswordResetToken();

  await user.save();

  const resetPasswordUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  const subject = "Reset Password";
  const message = `You can reset your password by clicking <a href=${resetPasswordUrl} target="_blank">Reset your password</a>\nIf the above link does not work for some reason then copy paste this link in new tab ${resetPasswordUrl}.\n If you have not requested this, kindly ignore.`;

  try {
    await sendEmail(email, subject, message);

    res.status(200).json({
      success: true,
      message: `Reset password token has been sent to ${email} successfully`,
    });
  } catch (error) {
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;
    await user.save();

    return next(new AppErorr(error.message, 500));
  }
};

const resetPassword = async (req, res, next) => {
  const { resetToken } = req.params;
  const { password } = req.body;

  const forgotPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const user = await User.findOne({
    forgotPasswordToken,
    forgotPasswordExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new AppErorr("Token is invalid or expired, please try again", 400)
    );
  }

  user.password = password;
  user.forgotPasswordToken = undefined;
  user.forgotPasswordExpiry = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Password changed successfully",
  });
};

const changePassword = async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  const { id } = req.user;

  if (!oldPassword || newPassword) {
    return next(new AppErorr("All filed are required ", 400));
  }

  const user = await User.findById(id).select("+password");

  if (!user) {
    return next(new AppErorr("User does not exist", 400));
  }

  const isPasswordvalid = await user.comparePassword(oldPassword);

  if (!isPasswordvalid) {
    return next(new AppErorr("Invalid old password ", 400));
  }

  user.password = newPassword;

  await user.save();

  user.password = undefined;

  res.status(200).json({
    success: true,
    message: "Password changed successfully! ",
  });
};

const updateUser = async (req, res, next) => {
  const { fullName } = req.body;
  const { id } = req.user.id;

  const user = await User.findById(id);

  if (!user) {
    return next(new AppErorr("User does not exist ", 400));
  }

  if (req.fullName) {
    user.fullName = fullName;
  }

  if (req.file) {
    await cloudinary.v2.uploader.destroy(user.avatar.public_url);
    try {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "LSM",
        width: 250,
        height: 250,
        gravity: "faces",
        crop: "fill",
      });

      if (result) {
        user.avatar.public_url = result.public_id;
        user.avatar.secure_url = result.secure_url;

        // Remove file from server
        fs.rm(`uploads/${req.file.filename}`);
      }
    } catch (error) {
      return next(
        new AppErorr(error || "File not uploaded, please try again", 500)
      );
    }
  }

  await user.save();

  res.status(200).json({
    success:true,
    message:"User details updated succefully!"
  })
};

export {
  register,
  login,
  logout,
  getProfile,
  forgotPassword,
  resetPassword,
  changePassword,
  updateUser,
};
