import { Router } from "express";
import { dropMW, enrollMW, getCoursesForUserMW, getUsersForCourseMW } from "../middleware/enrollmentMW.js";
import { jwtMW } from "../middleware/authMW.js";

const enrollmentRouter = Router()
export default enrollmentRouter;

enrollmentRouter.get("/user/:userID", jwtMW, getCoursesForUserMW);
enrollmentRouter.get("/course/:courseID", jwtMW, getUsersForCourseMW);
enrollmentRouter.post("/enroll", jwtMW, enrollMW);
enrollmentRouter.delete("/drop", jwtMW, dropMW);