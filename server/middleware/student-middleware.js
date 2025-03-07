import bcrypt from "bcrypt";
import { genUserID } from "../utils/generalUtils.js";
import logger from "../logging/logger.js";
import { genToken } from "../services/jwt.js";
import { createUserPG, getUserPG, updateUserPG } from "../services/postgres/usersCRUD.js";
import { getCoursesPG } from "../services/postgres/coursesCRUD.js";

export async function postUserMW(req, res) {
    try {
        const userData = {
            ...req.body,
            password_hash: bcrypt.hashSync(req.body.password, 10),
            user_id: genUserID()
        };

        const success = await createUserPG(userData);

        if (success) {
            const token = genToken(userData.user_id, userData.is_admin);
            res.json({
                token,
                userID: userData.user_id
            });
        }
        else res.status(500).json({ errorMessage: "Postgres Error" });

    } catch (err) {
        logger.error(err.message);

        res.status(500).json({ errorMessage: err.message });
    }
}

export async function putUserMW(req, res) {
    try {
        const { userID } = req.params;

        const oldUserData = await getUserPG(userID);

        let newUserData = {
            ...oldUserData, // Old user data
            ...req.body // New user data
        };

        newUserData = await updateUserPG(userID, newUserData);

        res.json(newUserData);
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ errorMessage: err.message });
    }
}

export async function getUserMW(req, res) {
    try {
        const user = await getUserPG(req.params.userID);

        if (user) res.json(user);
        else res.status(404).json({ errorMessage: "User does not exist" });
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ errorMessage: err.message });
    }
}


export async function getCoursesMW(req, res) {
    try {
        const courses = await getCoursesPG();

        res.json(courses);
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ errorMessage: "Internal Server Error" });
    }
}