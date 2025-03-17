import { Router } from "express";
import { searchCoursesMW, postCourseMW, putCourseMW, deleteCourseMW } from "../middleware/coursesMW.js";
import { isAdminMW, jwtAuthMW } from "../middleware/authMW.js";

const coursesRouter = Router();
export default coursesRouter;

coursesRouter.get("", jwtAuthMW, searchCoursesMW);
coursesRouter.post("", jwtAuthMW, isAdminMW, postCourseMW);
coursesRouter.put("/:courseID", jwtAuthMW, isAdminMW, putCourseMW);
coursesRouter.delete("/:courseID", jwtAuthMW, isAdminMW, deleteCourseMW);