import Course from "../model/course.model.js"
import AppErorr from "../utils/error.util.js";

const getAllCourses = async (req,res,next)=>{

    const courses = await Course.find({}).select('-lectures'); 

    try {
        res.status(200).json({
            success:true,
            message:"All courses",
            courses,
    
        })
    } catch (error) {
        return next(new AppErorr(error.message,500));
        
    }

   

}

const getLectureByCourseId = async (req,res,next)=>{


    try {
        const {id} = req.params;

        const course = await Course.findById(id);
        if(!course){
        return next(new AppErorr('Invalid course id',400));

        }

        res.status(200).json({
            success:true,
            message:"Course lectures fetched successfully!",
            lectures:course.lectures
        })
        
    } catch (error) {
        return next(new AppErorr(error.message,500));
        
    }
    
}

export{
    getAllCourses,
    getLectureByCourseId,
}