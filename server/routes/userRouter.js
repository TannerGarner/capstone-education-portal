import { Router } from "express";
import { authMW, deleteUserMW, getUserMW, postUserMW, putUserMW } from "../middleware/student-middleware.js";

const userRouter = Router();
export default userRouter;

userRouter.use(authMW);

userRouter.get("/:userID", getUserMW);
userRouter.post("", postUserMW);
userRouter.put("/:userID", putUserMW);
userRouter.delete("/:userID", deleteUserMW)