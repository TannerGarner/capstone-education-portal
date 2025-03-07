import pgPool from "../services/postgres/pgPool.js";

export function genRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

export function genUserID() {
    return genRandomInt(0, 999999999);
}