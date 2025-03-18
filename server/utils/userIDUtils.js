export function genUserID() {
    function genRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    return genRandomInt(0, 999999999);
}

export function isUserIDSyntaxValid(userID) {
    return userID.toString().length < 10;
}

export function getUserIDFromBodyOrParams(req) {
    const { userID: userIDFromParams } = req.params;
    const { user_id: userIDFromBody } = req.body;

    return userIDFromParams || userIDFromBody;
}