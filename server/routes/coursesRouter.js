import { Router } from "express";
import { searchCoursesMW, postCourseMW, putCourseMW } from "../middleware/coursesMW.js";
import { authMW } from "../middleware/authMW.js";

const coursesRouter = Router();
export default coursesRouter;

coursesRouter.get("", authMW, searchCoursesMW);
coursesRouter.post("", authMW, postCourseMW);
coursesRouter.put("/:courseID", authMW, putCourseMW);