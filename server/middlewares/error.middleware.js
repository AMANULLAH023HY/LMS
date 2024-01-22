const errorMiddleware = (err, req,res,next)=>{

    err.statusCode =   err.statusCode|| 500;
    err.meassage = err.message || "Something went wrong!";

   return res.status(err.statusCode).json({
        success:false,
        message:err.message,
        stack:err.stack
    })
};

export default errorMiddleware;