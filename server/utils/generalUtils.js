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



export function throwResErr(statusCode, errorMessage) {
    console.log("errorMessage:", errorMessage);
    console.log("typeof errorMessage:", typeof errorMessage);
    const err = new Error(errorMessage);
    err.statusCode = statusCode ?? 500;
    throw err;
}

export function sendErrRes(err, res) {
    logger.error(err.message);
    res.status(err.statusCode ?? 500);
    res.json({ errorMessage: err.message });
}