import jwt from "jsonwebtoken";

export function genToken(userID, isAdmin) {
    const jwtPayload = {
        sub: userID,
        isAdmin: isAdmin,
        iat: Math.floor(Date.now() / 1000), // Issued at (current time)
    };

    const token = jwt.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: "1h" });

    return token;
}