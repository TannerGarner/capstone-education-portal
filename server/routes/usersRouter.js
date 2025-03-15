import { Router } from "express";
import { deleteUserMW, getUserMW, loginMW, postUserMW, putUserMW } from "../middleware/usersMW.js";
import { jwtMW } from "../middleware/authMW.js";

const usersRouter = Router();
export default usersRouter;

usersRouter.post("/login", loginMW);
usersRouter.get("/:userID", jwtMW, getUserMW);
usersRouter.post("", jwtMW, postUserMW);
usersRouter.put("/:userID", jwtMW, putUserMW);
usersRouter.delete("/:userID", jwtMW, deleteUserMW);