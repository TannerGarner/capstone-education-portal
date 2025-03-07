import jwt from "jsonwebtoken";

export function genToken(userID) {

    const jwtPayload = {
        sub: userID,
        iat: Math.floor(Date.now() / 1000), // Issued at (current time)
    };

    const token = jwt.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: "1h" });

    return token;
}