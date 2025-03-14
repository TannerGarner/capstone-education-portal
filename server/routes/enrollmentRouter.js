import { Router } from "express";
import { authMW } from "../middleware/student-middleware.js";
import { dropMW, enrollMW } from "../middleware/enrollmentMW.js";

const enrollmentRouter = Router()
export default enrollmentRouter;

// enrollmentRouter.get("/user/:userID", authMW, "..."); // Get courses a specific user is taking.
// enrollmentRouter.get("/course/:courseID", authMW, "..."); // Get enrollment in specific course.
enrollmentRouter.post("/enroll", authMW, enrollMW);
enrollmentRouter.delete("/drop", authMW, dropMW);