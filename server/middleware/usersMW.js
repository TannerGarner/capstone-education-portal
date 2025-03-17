import bcrypt from "bcrypt";
import { genUserID, isUserIDSyntaxValid, sendErrRes, throwResErr } from "../utils/generalUtils.js";
import { genToken } from "../services/jwt.js";
import { createUserPG, deleteUserPG, getUserPG, getUsersPG, updateUserPG } from "../services/postgres/usersCRUD.js";
import { getAddressPG } from "../services/postgres/addressesCRUD.js";

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

        if (!user) throwInvalidCredsErr();
        else if (!bcrypt.compareSync(password, user.password_hash)) throwInvalidCredsErr();

        delete user.password_hash;

        res.json({
            token: genToken(user_id, user.is_admin),
            user: user
        });
    } catch (err) {
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

        if (users.length === 1) {
            const user = await getUserPG(users[0].user_id);
            delete user.password_hash;
            
            res.json([user]);
        }
        else res.json(users);
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

        // Add user to database: 
        const success = await createUserPG(userData);

        // Delete password_hash from userData:
        delete userData.password_hash;

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
    function ensureRoleNotChanged() {
        if ("is_admin" in req.body) {
            const { sub, isAdmin } = req.auth;

            if (!isAdmin || +(sub) === +(userID)) throwResErr(403, "User cannot change their role");
        }
    }

    // async function mergeOldAndNewData() {
    //     const oldUserData = await getUserPG(userID);
    //     const mergedUserData = {
    //         ...oldUserData,
    //         ...req.body // new user data
    //     };

    //     return { oldUserData, mergedUserData }
    // }

    async function mergeOldAndNewAddressData(addressID) {
        const oldAddressData = await getAddressPG(addressID);
        
        const mergedAddressData = {
            ...oldAddressData,
            ...req.body?.address // new address data
        };

        return mergedAddressData;
    }

    const { userID } = req.params;

    try {
        ensureRoleNotChanged();

        // Update general user data:
        const oldUserData = await getUserPG(userID, { returnAddressDataOrID: "ID" });
        let mergedUserData = {
            ...oldUserData,
            ...req.body // new user data
        };
        // let { oldUserData, mergedUserData } = await mergeOldAndNewData();

        // Update address user data:
            // const oldAddressData = await getAddressPG(oldUserData.address_id);
            
            // const mergedAddressData = {
            //     ...oldAddressData,
            //     ...req.body?.address // new address data
            // };

        // Update newUserData.address with new address data:
        mergedUserData.address = await mergeOldAndNewAddressData(oldUserData.address_id);;

        // Update information on database and return updated user:
        updatedUserData = await updateUserPG(userID, mergedUserData);

        // Delete password_hash from userData:
        // delete updatedUserData.password_hash;

        res.json(updatedUserData);
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