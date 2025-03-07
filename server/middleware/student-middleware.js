import bcrypt from "bcrypt";
import { genUserID } from "../utils/generalUtils.js";
import logger from "../logging/logger.js";
import { genToken } from "../services/jwt.js";
import { createUserPG, getUserPG, updateUserPG } from "../services/postgres/usersCRUD.js";
import { getCoursesPG } from "../services/postgres/coursesCRUD.js";
import { getAddressPG } from "../services/postgres/addressesCRUD.js";

export async function verifyTokenMW(req, res) {
    const { token } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.json({ user_id: decoded.sub });
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ errorMessage: "Internal Server Error" });
    }
}

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
                token: token,
                user_id: userData.user_id,
            });
        }
        res.status(500).json({ errorMessage: err.message });

    } catch (err) {
        logger.error(err.message);

        res.status(500).json({ errorMessage: err.message });
    }
}

export async function putUserMW(req, res) {
    try {
        const { userID } = req.params;

        // Update general user data:
        const oldUserData = await getUserPG(userID);

        let newUserData = {
            ...oldUserData,
            ...req.body // new user data
        };

        // Update address user data:
        const oldAddressData = await getAddressPG(oldUserData.address_id);
        
        const newAddressData = {
            ...oldAddressData,
            ...req.body.address // new address data
        };

        // Update newUserData.address with new address data:
        newUserData.address = newAddressData;

        // Update information on database and return updated user:
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