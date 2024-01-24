import {Router} from 'express';
import { getAllCourses, getLectureByCourseId } from '../controllers/course.controller.js';
import { isLonggedIn } from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/')
.get(getAllCourses);
router.route('/:id')
.get(isLonggedIn,getLectureByCourseId);

export default router;
