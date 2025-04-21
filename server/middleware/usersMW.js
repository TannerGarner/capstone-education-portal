import bcrypt from "bcrypt";
import { genUserID, isUserIDSyntaxValid } from "../utils/userIDUtils.js";
import { genToken } from "../services/jwt.js";
import { createUserPG, deleteUserPG, getUserPG, getUsersPG, updateUserPG } from "../services/postgres/usersPG.js";
import { createAddressPG, updateAddressPG } from "../services/postgres/addressesPG.js";
import { sendErrRes, throwResErr } from "../utils/errHandlingUtils.js";
import { separateAddressFromGeneralData } from "../utils/otherUtils.js";
import { sanitizeUserData } from "../utils/dataHandlingUtils.js";

export async function loginMW(req, res) {
    function throwInvalidCredsErr() {
        throwResErr(401, "Invalid credentials entered");
    }

    try {
        const { user_id, password } = req.body;

        if (!isUserIDSyntaxValid(user_id)) throwInvalidCredsErr();

        const user = await getUserPG(user_id, {
            throwErrWhenUserNotFound: false,
            returnPasswordHash: true
        });

        console.log("user:", user);

        if (!user) throwInvalidCredsErr();
        else if (!bcrypt.compareSync(password, user.password_hash)) throwInvalidCredsErr();

        delete user.password_hash;

        res.json({
            token: genToken(user_id, user.is_admin),
            user: user
        });
    } catch (err) {
        console.log("err:", err);
        sendErrRes(err, res);
    }
}

export async function getUserMW(req, res) {
    try {
        const user = await getUserPG(req.params.userID);
        delete user.password_hash;
        
        if (user) res.json(user);
        else res.status(404).json({ errorMessage: "User does not exist" });
    } catch (err) {
        sendErrRes(err, res);
    }
}

export async function getUsersMW(req, res) {
    try {
        const { searchTerm } = req.query;

        const users = await getUsersPG(searchTerm);

        res.json(users);
    } catch (err) {
        sendErrRes(err, res);
    }
}

export async function postUserMW(req, res) {
    try {
        const userData = {
            ...req.body,
            password_hash: bcrypt.hashSync(req.body.password, 10),
            user_id: genUserID()
        };

        const { generalData, address } = separateAddressFromGeneralData(userData);

        // Update DB:
        await createUserPG(generalData);
        await createAddressPG(generalData.user_id, address);

        // Delete password_hash from userData:
        delete userData.password_hash;

        res.json({
            token: genToken(userData.user_id, userData.is_admin),
            user_id: userData.user_id
        });
    } catch (err) {
        sendErrRes(err, res);
    }
}

export async function putUserMW(req, res) {
    try {
        // Pull user data out of req and sanitize it:
        const userData = sanitizeUserData(req);

        // Update data in DB:
        await updateUserPG(userData);
        await updateAddressPG(userData);

        // Return response:
        res.json({ errorMessage: null });
    } catch (err) {
        sendErrRes(err, res);
    }
}

export async function deleteUserMW(req, res) {
    try {
        const { userID } = req.params;

        await deleteUserPG(userID);

        res.json({ errorMessage: null });
    } catch (err) {
        sendErrRes(err, res);
    }
}