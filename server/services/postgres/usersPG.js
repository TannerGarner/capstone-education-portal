import pgPool from "./pgPool.js";
import { throwResErr } from "../../utils/errHandlingUtils.js";

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

    // Query DB for user data:
    const res = await pgPool.query({
        text: `
            SELECT
                u.user_id,
                first_name,
                last_name,
                ${config.returnPasswordHash ? "password_hash," : ""}
                email,
                phone_number,
                is_admin,
                street,
                city,
                state_or_region,
                country
            FROM
                users u LEFT JOIN addresses a ON u.user_id = a.user_id
            WHERE
                u.user_id = $1;
        `,
        values: [userID]
    });
    const userData = res.rows[0];

    // Verify the user exists:
    if (!userData) {
        if (config.throwErrWhenUserNotFound) throwResErr(404, `User (with user_id "${userID}") does not exist`);
        else return null;
    }

    // Return user data:
    return userData;
}

export async function getUsersPG(searchTerm) {
    // Ensure that the searchTerm is not undefined and that it is trimmed:
    searchTerm = (searchTerm ?? "").trim();

    const { rows: users } = await pgPool.query({
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
            userData.is_admin
        ]
    });
}

export async function updateUserPG(newData) {
    const updatePasswordHash = !!newData.password_hash;

    await pgPool.query({
        text: `
            UPDATE
                users
            SET
                email = $1,
                first_name = $2,
                is_admin = $3,
                last_name = $4,
                ${updatePasswordHash ? "password_hash = $7," : ""}
                phone_number = $5
            WHERE
                user_id = $6;
        `,
        values: [
            // Required fields (1-6):
            newData.email,
            newData.first_name,
            newData.is_admin,
            newData.last_name,
            newData.phone_number,
            newData.user_id,
            // Optional password_hash field (7):
            ...(updatePasswordHash ? [newData.password_hash] : [])
        ]
    });
}

export async function deleteUserPG(userID) {
    // Verify that user exists to begin with:
    await ensureUserExistsPG(userID);

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