import { Router } from "express";
import { deleteUserMW, getUserMW, getUsersMW, loginMW, postUserMW, putUserMW } from "../middleware/usersMW.js";
import { isAdminMW, isAdminOrSelfMW, jwtAuthMW } from "../middleware/authMW.js";

const usersRouter = Router();
export default usersRouter;

usersRouter.post("/login", loginMW);
usersRouter.get("/:userID", jwtAuthMW, isAdminOrSelfMW, getUserMW);
usersRouter.get("", jwtAuthMW, isAdminMW, getUsersMW);
usersRouter.post("", postUserMW);
usersRouter.put("/:userID", jwtAuthMW, isAdminOrSelfMW, putUserMW);
usersRouter.delete("/:userID", jwtAuthMW, isAdminOrSelfMW, deleteUserMW);