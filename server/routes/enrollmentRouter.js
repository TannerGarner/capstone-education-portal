import { Router } from "express";
import { authMW } from "../middleware/student-middleware.js";
import { dropMW, enrollMW, getCoursesForUserMW, getUsersForCourseMW } from "../middleware/enrollmentMW.js";

const enrollmentRouter = Router()
export default enrollmentRouter;

enrollmentRouter.get("/user/:userID", authMW, getCoursesForUserMW); // Get courses a specific user is taking.
enrollmentRouter.get("/course/:courseID", authMW, getUsersForCourseMW); // Get enrollment in specific course.
enrollmentRouter.post("/enroll", authMW, enrollMW);
enrollmentRouter.delete("/drop", authMW, dropMW);