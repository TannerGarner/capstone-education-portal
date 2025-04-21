import logger from "../logging/logger.js";

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