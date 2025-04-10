import pgPool from "./pgPool.js";
import { throwResErr } from "../../utils/errHandling.js";
import { organizeAddressUserData } from "../../utils/otherUtils.js";

export async function getUserPG(userID, config) {
    // Set up configuration variable:
    const defaultConfig = {
        throwErrWhenUserNotFound: true,
        returnPasswordHash: false
    };
    config = {
        ...defaultConfig,
        ...config
    };

    const res = await pgPool.query({
        text: `
            SELECT
                u.user_id, first_name, last_name, password_hash, email, phone_number, is_admin, street, city, state_or_region, country
            FROM
                users u LEFT JOIN addresses a ON u.user_id = a.user_id
            WHERE
                u.user_id = $1;
        `,
        values: [userID]
    });
    const rawUserData = res.rows[0];

    // Verify the user exists:
    if (!rawUserData) {
        if (config.throwErrWhenUserNotFound) throwResErr(404, `User (with user_id "${userID}") does not exist`);
        else return null;
    }

    // Organize the user's data (put address data into an address property):
    const organizedUserData = organizeAddressUserData(rawUserData);

    if (!config.returnPasswordHash) delete organizedUserData.password_hash;

    return organizedUserData;
}

export async function getUsersPG(searchTerm, config) {
    // Set up configuration variable:
    const defaultConfig = {
        returnPasswordHash: false
    };
    config = {
        ...defaultConfig,
        ...config
    };

    // Ensure that the searchTerm is not undefined and that it is trimmed:
    searchTerm = (searchTerm ?? "").trim();

    let { rows: users } = await pgPool.query({
        text: `
            SELECT
                u.user_id, first_name, last_name, email, phone_number, is_admin, street, city, state_or_region, country
            FROM
                users u LEFT JOIN addresses a ON u.user_id = a.user_id
            WHERE
                u.user_id::VARCHAR(9) ILIKE $1 OR first_name ILIKE $2 OR last_name ILIKE $2 OR email ILIKE $2;
        `,
        values: [`${searchTerm}%`, `%${searchTerm}%`]
    });

    // Put all address data in its own property on each user:
    users = users.map((user) => organizeAddressUserData(user));

    return users;
}

export async function createUserPG(userData) {
    await pgPool.query({
        text: `
            INSERT INTO
                users (user_id, first_name, last_name, password_hash, email, phone_number, is_admin)
            VALUES
                ($1, $2, $3, $4, $5, $6, $7);
        `,
        values: [
            userData.user_id,
            userData.first_name,
            userData.last_name,
            userData.password_hash,
            userData.email,
            userData.phone_number,
            userData.is_admin,
        ]
    });
}

export async function updateUserPG(userID, newData) {
    await pgPool.query({
        text: `
            UPDATE
                users
            SET
                first_name = $1,
                last_name = $2,
                password_hash = $3,
                email = $4,
                phone_number = $5,
                is_admin = $6
            WHERE
                user_id = $7;
        `,
        values: [
            newData.first_name,
            newData.last_name,
            newData.password_hash,
            newData.email,
            newData.phone_number,
            newData.is_admin,
            userID
        ]
    });
}

export async function deleteUserPG(userID) {
    // Verify that user exists to begin with:
    await ensureUserExistsPG(userID)

    await pgPool.query({
        text: "DELETE FROM users WHERE user_id = $1;",
        values: [userID]
    });
}


export async function ensureUserExistsPG(userID) {
    const res = await pgPool.query({
        text: "SELECT COUNT(*) FROM users WHERE user_id = $1;",
        values: [userID]
    });

    const userExists = res.rows[0].count === "1";

    if (!userExists) throwResErr(404, `User (with user_id "${userID}") does not exist`);
}

export async function ensureUserIsNotAdminPG(userID) {
    const res = await pgPool.query({
        text: "SELECT is_admin FROM users WHERE user_id = $1;",
        values: [userID]
    });

    const isAdmin = res.rows[0].is_admin;

    if (isAdmin) throwResErr(403, "Admins cannot enroll in courses");
}