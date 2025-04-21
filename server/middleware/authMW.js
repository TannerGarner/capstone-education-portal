import { expressjwt } from "express-jwt";
import { getUserIDFromBodyOrParams } from "../utils/userIDUtils.js";
import { sendErrRes } from "../utils/errHandlingUtils.js";

export const jwtAuthMW = expressjwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"] });

export async function verifyTokenMW(_req, res) {
    res.json({ errorMessage: null });
}

export async function isAdminMW(req, res, next) {
    const { isAdmin } = req.auth;

    if (isAdmin) next();
    else sendErrRes({
        statusCode: 403,
        message: "User must be an admin"
    }, res);
}

export async function isAdminOrSelfMW(req, res, next) {
    const { isAdmin, sub: userMakingReq } = req.auth;
    const userAffectedByReq = getUserIDFromBodyOrParams(req);

    if (isAdmin || +(userMakingReq) === +(userAffectedByReq)) next();
    else sendErrRes({
        statusCode: 403,
        message: "User cannot preform this action"
    }, res);
}