import User from "../model/user.model";
import AppErorr from "../utils/error.util";

const cookieOption = {
    maxAge: 7*24*60*60*1000, // 7 days
    httpOnly: true, 
    secure: true 
}

const register = async (req,res, next)=>{
    const [fullName, email, password] = req.body;

    if(!fullName || !email || !password){
        return next(AppErorr("All field id required", 400));
    }

    const userExists = await User.findOne({email});

    if(userExists){
        return next(AppErorr("Email already exists", 400));

    }

    const user = await User.create({
        fullName,
        email,
        password,
        avatar:{
            public_url:email,
            secure_url:"https://res.cloudinary.com/du9jzqlpt/image/upload/v1674647316/avatar_drzgxv.jpg",
        }
    });

    if(!user){
        return next(AppErorr("User registration failed, please try again ", 400));


    }

    // TODO : file upload 

    await user.save();

    user.password = undefined; 

    const token  = await user.generateJWTToken();

    res.cookie('token', token, cookieOption);

    res.status(201).json({
        success:true,
        message: "User registered successfully",
        user
    })

};

const login = (req,res)=>{

};

const logout = (req,res)=>{

};


const getProfile = (req,res)=>{

};


export {
    register,
    login,
    logout,
    getProfile
}
