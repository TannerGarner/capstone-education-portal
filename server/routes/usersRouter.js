import { Router } from "express";
import { deleteUserMW, getUserMW, loginMW, postUserMW, putUserMW } from "../middleware/usersMW.js";
import { authMW } from "../middleware/authMW.js";

const usersRouter = Router();
export default usersRouter;

usersRouter.post("/login", loginMW);
usersRouter.get("/:userID", authMW, getUserMW);
usersRouter.post("", authMW, postUserMW);
usersRouter.put("/:userID", authMW, putUserMW);
usersRouter.delete("/:userID", authMW, deleteUserMW);