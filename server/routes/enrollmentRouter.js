import { Router } from "express";
import { dropMW, enrollMW, getCoursesForUserMW, getUsersForCourseMW } from "../middleware/enrollmentMW.js";
import { isAdminMW, isAdminOrSelfMW, jwtAuthMW } from "../middleware/authMW.js";

const enrollmentRouter = Router()
export default enrollmentRouter;

enrollmentRouter.get("/users?/:userID", jwtAuthMW, isAdminOrSelfMW, getCoursesForUserMW);
enrollmentRouter.get("/courses?/:courseID", jwtAuthMW, isAdminMW, getUsersForCourseMW);
enrollmentRouter.post("/enroll", jwtAuthMW, isAdminOrSelfMW, enrollMW);
enrollmentRouter.delete("/drop", jwtAuthMW, isAdminOrSelfMW, dropMW);