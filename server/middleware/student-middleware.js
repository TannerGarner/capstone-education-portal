import bcrypt from "bcrypt";
import { genUserID } from "../utils/generalUtils.js";
import pgPool from "../services/postgres.js";
import logger from "../logging/logger.js";
import { genToken } from "../services/jwt.js";

export async function postUserMW(req, res) {
    try {
        const userData = {
            ...req.body,
            password_hash: bcrypt.hashSync(req.body.password, 10),
            user_id: genUserID(),
        };

        const { rowCount } = await pgPool.query({
            text: `
                INSERT INTO
	                users (user_id, first_name, last_name, password_hash, email, phone_number, is_admin, address_id)
                VALUES
	                ($1, $2, $3, $4, $5, $6, $7, find_or_create_address($8, $9, $10, $11));
            `,
            values: [
                userData.user_id, // $1
                userData.first_name, // $2
                userData.last_name, // $3
                userData.password_hash, // $4
                userData.email, // $5
                userData.phone_number, // $6
                userData.is_admin, // $7

                userData.address_data.street, // $8
                userData.address_data.city, // $9
                userData.address_data.state_or_region, // $10
                userData.address_data.country // $11
            ]
        });

        if (rowCount) {
            const token = genToken(userData.user_id, userData.username);
            res.json({
                token,
                userID: userData.user_id
            });
        }
        else res.status(500).json({ errorMessage: "Postgres Error" });

    } catch (err) {
        logger.error(err.message);
        // if (err.message == `duplicate key value violates unique constraint "users_pkey"`) {

        // }

        res.status(500).json({ errorMessage: err.message });
    }
}

export async function getCoursesMW(req, res) {
    try {
        const { rows: courses } = await pgPool.query({
            text: "SELECT * FROM courses;",
            values: []
        });

        res.json(courses);
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ errorMessage: "Internal Server Error" });
    }
}

export async function getUserMW(req, res) {
    const { userID } = req.params;

    try {
        const queryRes = await pgPool.query({
            text: "SELECT * FROM users WHERE user_id = $1;",
            values: [userID]
        });
        const student = queryRes.rows[0];

        if (student) res.json(student);
        else res.status(404).json({ errorMessage: "User does not exist" });
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ errorMessage: err.message });
    }
}