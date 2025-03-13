import { Router } from "express";
import { authMW, getCoursesMW, postCoursesMW, putCoursesMW } from "../middleware/student-middleware.js";

const coursesRouter = Router();
export default coursesRouter;

coursesRouter.get("", getCoursesMW);
coursesRouter.post("", authMW, postCoursesMW);
coursesRouter.put("/:courseID", authMW, putCoursesMW);