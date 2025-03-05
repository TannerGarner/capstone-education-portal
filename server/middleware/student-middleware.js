import bcrypt from "bcrypt";
import { genUserID } from "../utils/generalUtils.js";
import pgPool from "../services/postgres.js";
import logger from "../logging/logger.js";

export async function getRegisterMW(req, res) {
    try {
        // Code to verify that username is unique:
        

        // Store general data:
        const generalData = {
            ...req.body.general_data,
            password_hash: bcrypt.hashSync(req.body.general_data.password, 10),
            user_id: genUserID()
        };
        delete generalData.password;

        
        // Store address data:
        const addressData = { ...req.body.address_data };

        const columns = [...Object.values(generalData), /* address_id = */ 100];

        

        await pgPool.query({
            text: "............",
            values: []
        });

        res.status(500).json({ errorMessage: "This endpoint is not yet completed." });
    } catch (err) {
        res.status(500).json({ errorMessage: "Internal Server Error" });
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