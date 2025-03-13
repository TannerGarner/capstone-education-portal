import { Router } from "express";
import { authMW, getUserMW, postUserMW, putUserMW } from "../middleware/student-middleware.js";

const userRouter = Router();
export default userRouter;

// coursesRouter.get(getCoursesMW);
// coursesRouter.post(authMW, postCoursesMW);
// coursesRouter.put("/:courseID", authMW, putCoursesMW);

userRouter.use(authMW);

userRouter.get("/:userID", getUserMW);
userRouter.post("", postUserMW);
userRouter.put("/:userID", putUserMW);