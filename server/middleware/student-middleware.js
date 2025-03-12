import bcrypt from "bcrypt";
import { genUserID, isUserIDSyntaxValid, sendErrRes, throwResErr } from "../utils/generalUtils.js";
import { genToken } from "../services/jwt.js";
import { createUserPG, getUserPG, updateUserPG } from "../services/postgres/usersCRUD.js";
import { getCoursesPG } from "../services/postgres/coursesCRUD.js";
import { getAddressPG } from "../services/postgres/addressesCRUD.js";
import { expressjwt } from "express-jwt";

export async function loginMW(req, res) {
    function throwInvalidCredsErr() {
        throwResErr(400, "Invalid credentials entered");
    }

    try {
        const { user_id, password } = req.body;

        if (!isUserIDSyntaxValid(user_id)) throwInvalidCredsErr();

        const user = await getUserPG(user_id);

        if (!user) return invalidCredsRes();
        if (!bcrypt.compareSync(password, user.password_hash)) throwInvalidCredsErr();

        res.json({ token: genToken(user_id) });
    } catch (err) {
        sendErrRes(err, res);
    }
}

export const authMW = expressjwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"] });

export async function postUserMW(req, res) {
    try {
        const userData = {
            ...req.body,
            password_hash: bcrypt.hashSync(req.body.password, 10),
            user_id: genUserID()
        };

        const success = await createUserPG(userData);

        if (success) res.json({
            token: genToken(userData.user_id, userData.is_admin),
            user_id: userData.user_id
        });
        else res.status(500).json({ errorMessage: "Internal server error" });
    } catch (err) {
        sendErrRes(err, res);
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
            ...req.body?.address // new address data
        };

        // Update newUserData.address with new address data:
        newUserData.address = newAddressData;

        // Update information on database and return updated user:
        newUserData = await updateUserPG(userID, newUserData);

        res.json(newUserData);
    } catch (err) {
        sendErrRes(err, res);
    }
}

export async function getUserMW(req, res) {
    try {
        const user = await getUserPG(req.params.userID);
        
        if (user) res.json(user);
        else res.status(404).json({ errorMessage: "User does not exist" });
    } catch (err) {
        sendErrRes(err, res);
    }
}


export async function getCoursesMW(req, res) {
    try {
        const { searchTerm } = req.query;

        const courses = await getCoursesPG(searchTerm);

        res.json(courses);
    } catch (err) {
        sendErrRes(err, res);
    }
}