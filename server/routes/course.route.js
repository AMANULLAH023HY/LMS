import {Router} from 'express';
import { createCourse, getAllCourses, getLectureByCourseId, removeCourse, updateCourse } from '../controllers/course.controller.js';
import { isLonggedIn } from '../middlewares/auth.middleware.js';
import upload from '../middlewares/multer.middleware.js';

const router = Router();

router.route('/')
.get(getAllCourses)
.post(
    isLonggedIn,
    upload.single('thumbnail'),
    createCourse
    );


router.route('/:id')
.get(isLonggedIn,getLectureByCourseId)
.put(
    isLonggedIn,
    updateCourse)
.delete(
    isLonggedIn,
    removeCourse);

export default router;
