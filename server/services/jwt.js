import jwt from "jsonwebtoken";

export function genToken(userID, username) {

    const jwtPayload = {
        sub: userID,
        username,
        iat: Math.floor(Date.now() / 1000), // Issued at (current time)
    };

    const token = jwt.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: "1h" });

    return token;
}