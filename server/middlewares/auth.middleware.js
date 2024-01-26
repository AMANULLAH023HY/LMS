import AppErorr from "../utils/error.util.js";
import jwt from 'jsonwebtoken';

const isLonggedIn = (req,res,next)=>{

    const {token} = req.cookie;

    if(!token){
        return next(new AppErorr("Unauthenticated, please login again",401));
    }

    const userDetails = jwt.verify(token, process.env.JWT_SECRET);

    req.user = userDetails;

    next();
}



const authorizedRoles = (...roles)=>async(req,res,next)=>{
    const currentUserRole = req.user.role;
  
  if(!role.includes(currentUserRole )){
    return next(new AppErorr('You do nat have permission to access this route ',500));
  }
  next();
  }

export{
    isLonggedIn,
    authorizedRoles
}