import { Router } from "express";
import { dropStudentFromCourseMW, enrollStudentInCourseMW, getEnrollmentOfStudentMW, getEnrollmentOfCourseMW } from "../middleware/enrollmentMW.js";
import { isAdminMW, isAdminOrSelfMW, jwtAuthMW } from "../middleware/authMW.js";

const enrollmentRouter = Router()
export default enrollmentRouter;

enrollmentRouter.get("/users?/:userID", jwtAuthMW, isAdminOrSelfMW, getEnrollmentOfStudentMW);
enrollmentRouter.get("/courses?/:courseID", jwtAuthMW, isAdminMW, getEnrollmentOfCourseMW);
enrollmentRouter.post("/enroll", jwtAuthMW, isAdminOrSelfMW, enrollStudentInCourseMW);
enrollmentRouter.delete("/drop", jwtAuthMW, isAdminOrSelfMW, dropStudentFromCourseMW);