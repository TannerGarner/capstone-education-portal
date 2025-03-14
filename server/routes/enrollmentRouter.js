import { Router } from "express";
import { authMW } from "../middleware/student-middleware.js";
import { enrollMW } from "../middleware/enrollmentMW.js";

const enrollmentRouter = Router()
export default enrollmentRouter;

// enrollmentRouter.get("/user/:userID", authMW, "...");
// enrollmentRouter.get("/course/:courseID", authMW, "...");
enrollmentRouter.post("/enroll", authMW, enrollMW);
// enrollmentRouter.delete("/drop", authMW, "...");