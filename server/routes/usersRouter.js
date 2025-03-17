import { Router } from "express";
import { deleteUserMW, getUserMW, loginMW, postUserMW, putUserMW } from "../middleware/usersMW.js";
import { isAdminOrSelfMW, jwtAuthMW } from "../middleware/authMW.js";

const usersRouter = Router();
export default usersRouter;

usersRouter.post("/login", loginMW);
usersRouter.get("/:userID", jwtAuthMW, isAdminOrSelfMW, getUserMW);
usersRouter.post("", postUserMW);
usersRouter.put("/:userID", jwtAuthMW, isAdminOrSelfMW, putUserMW);
usersRouter.delete("/:userID", jwtAuthMW, isAdminOrSelfMW, deleteUserMW);