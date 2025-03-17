import logger from "../logging/logger.js";

function genRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

export function genUserID() {
    return genRandomInt(0, 999999999);
}



export function isUserIDSyntaxValid(userID) {
    return userID.toString().length < 10;
}

export function throwResErr(statusCode, message) {
    const err = new Error(message);
    err.statusCode = statusCode ?? 500;
    throw err;
}

export function sendErrRes(err, res) {
    logger.error(err.message);
    res.status(err.statusCode ?? 500);
    res.json({ errorMessage: err.message });
}


export function getUserIDFromBodyOrParams(req) {
    const { userID: userIDFromParams } = req.params;
    const { user_id: userIDFromBody } = req.body;

    return userIDFromParams || userIDFromBody;
}