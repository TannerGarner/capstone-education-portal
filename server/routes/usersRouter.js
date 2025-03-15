import { Router } from "express";
import { deleteUserMW, getUserMW, loginMW, postUserMW, putUserMW } from "../middleware/usersMW.js";
import { jwtAuthMW } from "../middleware/authMW.js";

const usersRouter = Router();
export default usersRouter;

usersRouter.post("/login", loginMW);
usersRouter.get("/:userID", jwtAuthMW, getUserMW);
usersRouter.post("", postUserMW);
usersRouter.put("/:userID", jwtAuthMW, putUserMW);
usersRouter.delete("/:userID", jwtAuthMW, deleteUserMW);