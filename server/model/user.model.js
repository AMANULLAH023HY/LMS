import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from 'crypto'

const userScheme = new Schema(
  {
    fullName: {
      type: "String",
      required: [true, "Name is require"],
      minLength: [5, "Name must be at least 5 character "],
      maxLength: [50, "Name should be less than 50 character "],
      lowercase: true,
      trim: true,
    },
    email: {
      type: "String",
      required: [true, "Email is require"],
      lowercase: true,
      trim: true,
      unique: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please fill a valid email address",
      ],
    },
    password: {
      type: "String",
      required: [true, "Password is required"],
      minLength: [8, "Password must be at least 8 character"],
      select: false,
    },
    avatar: {
      public_url: {
        type: "String",
      },
      secure_url: {
        type: "String",
      },
    },
    role: {
      type: "String",
      enum: ["USER", "ADMIN"],
      default: "USER",
    },

    forgotPasswordToken: String,
    forgotPasswordExpiry: String,
  },
  { timestamps: true }
);

userScheme.pre("save", async function (next) {
  if (this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

userScheme.methods = {
  // Will generate a JWT token with user id as payload
  generateJWTToken: async function () {
    return await jwt.sign(
      { id: this._id, role: this.role, subscription: this.subscription },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRY,
      }
    );
  },

  comparePassword:async function(plainTextPassword){
    return await bcrypt.compare(plainTextPassword,this.password)

  },

  generatePasswordResetToken:async function(){
    const resetToken = crypto.randomBytes(20).toString('hex')

    this.forgotPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')
    ;
    this.forgotPasswordExpiry = Date.now() +15*60*1000 // 15 min from
  }
};

const User = model("User", userScheme);

export default User;
