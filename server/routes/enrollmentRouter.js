import { Router } from "express";
import { dropMW, enrollMW, getCoursesForUserMW, getUsersForCourseMW } from "../middleware/enrollmentMW.js";
import { authMW } from "../middleware/authMW.js";

const enrollmentRouter = Router()
export default enrollmentRouter;

enrollmentRouter.get("/user/:userID", authMW, getCoursesForUserMW);
enrollmentRouter.get("/course/:courseID", authMW, getUsersForCourseMW);
enrollmentRouter.post("/enroll", authMW, enrollMW);
enrollmentRouter.delete("/drop", authMW, dropMW);