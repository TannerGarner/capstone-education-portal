import { Router } from "express";
import { searchCoursesMW, postCourseMW, putCourseMW, deleteCourseMW } from "../middleware/coursesMW.js";
import { jwtAuthMW } from "../middleware/authMW.js";

const coursesRouter = Router();
export default coursesRouter;

coursesRouter.get("", jwtAuthMW, searchCoursesMW);
coursesRouter.post("", jwtAuthMW, postCourseMW);
coursesRouter.put("/:courseID", jwtAuthMW, putCourseMW);
coursesRouter.delete("/:courseID", jwtAuthMW, deleteCourseMW);