import bcrypt from "bcrypt";
import { genUserID } from "../utils/generalUtils.js";
import pgPool from "../services/postgres.js";

export async function registerMW(req, res) {
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

export async function coursesMW(req, res) {
    try {
        const { rows: courses } = await pgPool.query({
            text: "SELECT * FROM courses;",
            values: []
        });

        res.json(courses);
    } catch (err) {
        res.status(500).json({ errorMessage: "Internal Server Error" });
    }
}