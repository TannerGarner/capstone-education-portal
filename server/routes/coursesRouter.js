import { Router } from "express";
import { searchCoursesMW, postCourseMW, putCourseMW, deleteCourseMW } from "../middleware/coursesMW.js";
import { jwtMW } from "../middleware/authMW.js";

const coursesRouter = Router();
export default coursesRouter;

coursesRouter.get("", jwtMW, searchCoursesMW);
coursesRouter.post("", jwtMW, postCourseMW);
coursesRouter.put("/:courseID", jwtMW, putCourseMW);
coursesRouter.delete("/:courseID", jwtMW, deleteCourseMW);