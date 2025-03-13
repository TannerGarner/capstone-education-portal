import { Router } from "express";
import { authMW, deleteUserMW, getUserMW, postUserMW, putUserMW } from "../middleware/student-middleware.js";

const usersRouter = Router();
export default usersRouter;

usersRouter.use(authMW);

usersRouter.get("/:userID", getUserMW);
usersRouter.post("", postUserMW);
usersRouter.put("/:userID", putUserMW);
usersRouter.delete("/:userID", deleteUserMW)