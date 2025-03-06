import bcrypt from "bcrypt";
import { genUserID } from "../utils/generalUtils.js";
import pgPool from "../services/postgres.js";
import logger from "../logging/logger.js";
import { genToken } from "../services/jwt.js";

export async function getRegisterMW(req, res) {
    try {
        // Store address data: (Incomplete)
        const addressData = { ...req.body.address_data };

        // Store general data:
        const generalData = {
            ...req.body.general_data,
            password_hash: bcrypt.hashSync(req.body.general_data.password, 10),
            user_id: genUserID(),
            address_id: null
        };
        delete generalData.password;


        const { rowCount } = await pgPool.query({
            text: `
                INSERT INTO
	                users (user_id, first_name, last_name, username, password_hash, email, phone_number, address_id, is_admin)
                VALUES
	                ($1, $2, $3, $4, $5, $6, $7, $8, $9);
            `,
            values: [
                generalData.user_id,
                generalData.first_name,
                generalData.last_name,
                generalData.username,
                generalData.password_hash,
                generalData.email,
                generalData.phone_number,
                generalData.address_id,
                generalData.is_admin
            ]
        });

        if (!!rowCount) {
            const token = genToken(generalData.user_id, generalData.username);

            res.json({ token });
        }
        else res.status(500).json({ errorMessage: "Postgres Error" });
    } catch (err) {
        logger.error(err.message);
        if (err.message == `duplicate key value violates unique constraint "username"`) {
            res.status(409).json({ errorMessage: "Username already in use" });
        }
        // else if (err.message == `duplicate key value violates unique constraint "users_pkey"`) {

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
        res.status(500).json({ errorMessage: "Internal Server Error" });
    }
}