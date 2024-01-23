import User from "../model/user.model.js";
import AppErorr from "../utils/error.util.js";

const cookieOption = {
    maxAge: 7*24*60*60*1000, // 7 days
    httpOnly: true, 
    secure: true 
}

const register = async (req,res, next)=>{
    const [fullName, email, password] = req.body;

    if(!fullName || !email || !password){
        return next(new AppErorr("All field id required", 400));
    }

    const userExists = await User.findOne({email});

    if(userExists){
        return next(new AppErorr("Email already exists", 400));

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
        return next(new AppErorr("User registration failed, please try again ", 400));


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

const login = async(req,res, next)=>{
    
    try {
        cosnt [email, password] = req.body;

            if(!email || !password){
                return next(new AppErorr('All filed are required ', 400));
            }
            const user = await User.findOne({email}).select('+password');
        
            if(!user || !user.comparePassword(password)){
                return next(new AppErorr('Email or Password does not match', 400));
            }
        
            const token = await user.generateJWTToken();
            user.password = undefined;
        
            res.cookie('token', token, cookieOption);
        
            res.status(200).json({
                success:true,
                message:"User loggedin successfully",
                user,
            });
    } catch (e) {
        return next(new AppErorr(e.message, 500));

        
    }

};

const logout = (req,res)=>{
res.cookie('token', null, {
    secure:true,
    maxAge:0,
    httpOnly:true
});
res.status(200).json({
    success:true,
    message:"User logout successfully",
});


};


const getProfile = async (req,res)=>{

    try {
        const userId = req.user.id;
        const uder = await  User.findOne(userId);

        res.status(200).json({
            success:true,
            messgae:"User details",
            user,
        })

    } catch (e) {

        return next(new AppErorr("Failed to fetch profile details", 500));
        
    }

};


export {
    register,
    login,
    logout,
    getProfile
}
