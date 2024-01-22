import { Schema, model } from "mongoose";

const userScheme = new Schema({
    fullName:{
        type:'String',
        required:[true, "Name is require"],
        minLength:[5, "Name must be at least 5 character "],
        maxLength:[50, "Name should be less than 50 character "],
        lowercase:true,
        trim:true,



    },
    email:{
        type:'String',
        required:[true,"Email is require"],
        lowercase: true,
        trim:true,
        unique:true,
        match:[ /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "Please fill a valid email address"
    ]

    },
    password:{
        type:'String', 
        required:[true,"Password is required"],
        minLength:[8, 'Password must be at least 8 character'],
        select:false,


       },
       avatar:{
        public_url:{
            type:"String"
        },
        secure_url:{
            type:"String"
        }
       },
       role:{
        type:"String",
        enum:["USER","ADMIN"],
        default:"USER",
       },


       forgotPasswordToken:String,
       forgotPasswordExpiry:String

}, {timestamps:true});


const User = model("User", userScheme);

export default User;