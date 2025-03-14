import { Router } from "express";
import { authMW, deleteUserMW, getUserMW, loginMW, postUserMW, putUserMW } from "../middleware/student-middleware.js";

const usersRouter = Router();
export default usersRouter;

usersRouter.post("/login", loginMW);
usersRouter.get("/:userID", authMW, getUserMW);
usersRouter.post("", authMW, postUserMW);
usersRouter.put("/:userID", authMW, putUserMW);
usersRouter.delete("/:userID", authMW, deleteUserMW);