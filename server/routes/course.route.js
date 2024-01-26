import { Router } from "express";
import {
  addLectureToCourseById,
  createCourse,
  getAllCourses,
  getLectureByCourseId,
  removeCourse,
  updateCourse,
} from "../controllers/course.controller.js";
import {
  authorizedRoles,
  authorizedSubscriber,
  isLonggedIn,
} from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";

const router = Router();

router
  .route("/")
  .get(getAllCourses)
  .post(
    isLonggedIn,
    authorizedRoles("ADMIN"),
    upload.single("thumbnail"),
    createCourse
  );

router
  .route("/:id")
  .get(isLonggedIn,authorizedSubscriber,getLectureByCourseId)
  .put(isLonggedIn, authorizedRoles("ADMIN"), updateCourse)
  .delete(isLonggedIn, authorizedRoles("ADMIN"), removeCourse)
  .post(
    isLonggedIn,
    authorizedRoles("ADMIN"),
    upload.single("lecture"),
    addLectureToCourseById
  );

export default router;
