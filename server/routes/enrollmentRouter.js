import { Router } from "express";
import { dropMW, enrollMW, getCoursesForUserMW, getUsersForCourseMW } from "../middleware/enrollmentMW.js";
import { jwtAuthMW } from "../middleware/authMW.js";

const enrollmentRouter = Router()
export default enrollmentRouter;

enrollmentRouter.get("/users?/:userID", jwtAuthMW, getCoursesForUserMW);
enrollmentRouter.get("/courses?/:courseID", jwtAuthMW, getUsersForCourseMW);
enrollmentRouter.post("/enroll", jwtAuthMW, enrollMW);
enrollmentRouter.delete("/drop", jwtAuthMW, dropMW);