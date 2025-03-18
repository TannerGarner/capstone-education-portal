import bcrypt from "bcrypt";
import { genUserID, isUserIDSyntaxValid, sendErrRes, separateAddressFromGeneralData, throwResErr } from "../utils/generalUtils.js";
import { genToken } from "../services/jwt.js";
import { createUserPG, deleteUserPG, getUserPG, getUsersPG, updateUserPG } from "../services/postgres/usersCRUD.js";
import { createAddressPG, getAddressPG, updateAddressPG } from "../services/postgres/addressesCRUD.js";

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
    function ensureRoleNotChanged(newGeneralData) {
        if ("is_admin" in newGeneralData) {
            const { sub, isAdmin } = req.auth;

            if (newGeneralData.is_admin !== isAdmin && (!isAdmin || +(sub) === +(userID))) {
                throwResErr(403, "User cannot change their role");
            }
        }
    }

    const { userID } = req.params;

    try {
        // Get old and new user data (separated into general and address data):
        const { generalData: newGeneralData, address: newAddress } = separateAddressFromGeneralData(req.body);
        const { generalData: oldGeneralData, address: oldAddress } = separateAddressFromGeneralData(await getUserPG(userID));

        // Ensure user cannot change their role (changing from student to admin or otherwise):
        ensureRoleNotChanged(newGeneralData);        

        // Merge general data and address data:
        const mergedGeneralData = {
            ...oldGeneralData,
            ...newGeneralData
        };
        const mergedAddress = {
            ...oldAddress,
            ...newAddress
        };

        // Update data in DB:
        await updateUserPG(userID, mergedGeneralData);
        await updateAddressPG(userID, mergedAddress);

        // Put address inside general data:
        mergedGeneralData.address = mergedAddress;

        res.json(mergedGeneralData);
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