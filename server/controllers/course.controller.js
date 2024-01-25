import { count } from "console";
import Course from "../model/course.model.js";
import AppErorr from "../utils/error.util.js";
import cloudniry from "cloudinary";
import fs from "fs/promises";

const getAllCourses = async (req, res, next) => {
  const courses = await Course.find({}).select("-lectures");

  try {
    res.status(200).json({
      success: true,
      message: "All courses",
      courses,
    });
  } catch (error) {
    return next(new AppErorr(error.message, 500));
  }
};

const getLectureByCourseId = async (req, res, next) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);
    if (!course) {
      return next(new AppErorr("Invalid course id", 400));
    }

    res.status(200).json({
      success: true,
      message: "Course lectures fetched successfully!",
      lectures: course.lectures,
    });
  } catch (error) {
    return next(new AppErorr(error.message, 500));
  }
};

const createCourse = async (req, res, next) => {
  const { title, description, category, createdBy } = req.body;

  if (!title || !description || !category || createdBy) {
    return next(new AppErorr("All fields are required ", 400));
  }

  const course = await Course.create({
    title,
    description,
    category,
    createdBy,
    thumbnail: {
      public_id: "Dummy",

      secure_url: "Dummy",
    },
  });
  if (!course) {
    return next(
      new AppErorr("Course could not be created, please try again ", 500)
    );
  }

  if ((req, file)) {
    try {
      const result = await cloudniry.v2.uploader.upload(req.file.path, {
        folder: "lms",
      });

      if (result) {
        course.thumbnail.public_id = result.public_id;
        course.thumbnail.secure_url = result.secure_url;
      }
      fs.rm(`uploads/${req.file.filename}`);
    } catch (error) {
      return next(new AppErorr(error.message, 500));
    }

    await course.save();

    res.status(200).json({
      success: true,
      message: "Course created successfully!",
      course,
    });
  }
};

const updateCourse = async (req, res, next) => {

  try {

    const {id} = req.params;
    const course = await Course.findByIdAndUpdate(
      id,
      {
        $set:req.body
      },
      {
        runValidators:true
      }
    );
    
  if(!course){
      return next(new AppErorr("Course with given id does not exist", 500));

  }

  res.status(200).json({
    success:true,
    message:"Course updated successfully!",
    course,
  })
    
  } catch (error) {
      return next(new AppErorr(error.message, 500));

    
  }

};

const removeCourse = async (req, res, next) => {

  try {

    const {id} = req.params;

    const course = await Course.findById(id);

    if(!course){
      return next(new AppErorr("Course with given id does not exist", 500));

    }

    await Course.findByIdAndDelete(id);

    res.status(200).json({
      success:true,
      message:"Course deleted successfullt!",

    })
    
  } catch (error) {
    return next(new AppErorr(error.message,500));
  }
};

export {
  getAllCourses,
  getLectureByCourseId,
  createCourse,
  updateCourse,
  removeCourse,
};