import { expressjwt } from "express-jwt";

export const jwtAuthMW = expressjwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"] });

export async function verifyTokenMW(_req, res) {
    res.json({ errorMessage: null });
}