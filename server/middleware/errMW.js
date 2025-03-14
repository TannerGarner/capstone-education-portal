import { sendErrRes } from "../utils/generalUtils.js";

export async function errMW(err, _req, res, _next) {
    function doesErrEqualOneOfFollowing(...errorMessages) {
        return errorMessages.includes(err.message);
    }

    if (doesErrEqualOneOfFollowing("No authorization token was found", "jwt expired")) {
        err.statusCode = 401;
    }
    else if (doesErrEqualOneOfFollowing("Format is Authorization: Bearer [token]", "invalid jwt", "jwt malformed")) {
        err.statusCode = 400;
    }

    sendErrRes(err, res);
}