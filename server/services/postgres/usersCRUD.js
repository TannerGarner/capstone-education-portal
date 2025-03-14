import pgPool from "./pgPool.js";
import { throwResErr } from "../../utils/generalUtils.js";

export async function getUserPG(userID) {
    const res = await pgPool.query({
        text: `
            SELECT
                first_name, last_name, password_hash, email, phone_number, is_admin, street, city, state_or_region, country
            FROM
                users u LEFT JOIN addresses a ON u.address_id = a.address_id
            WHERE
                user_id = $1;
        `,
        values: [userID]
    });
    const rawUserData = res.rows[0];

    if (!rawUserData) throwResErr(404, `User (with user_id "${userID}") does not exist`);

    const organizedUserData = {
        first_name: rawUserData.first_name,
        last_name: rawUserData.last_name,
        password_hash: rawUserData.password_hash,
        email: rawUserData.email,
        phone_number: rawUserData.phone_number,
        is_admin: rawUserData.is_admin,
        address: {
            street: rawUserData.street,
            city: rawUserData.city,
            state: rawUserData.state_or_region,
            country: rawUserData.country
        }
    };

    return organizedUserData;
}

export async function createUserPG(userData) {
    const { rowCount } = await pgPool.query({
        text: `
            INSERT INTO
                users (user_id, first_name, last_name, password_hash, email, phone_number, is_admin, address_id)
            VALUES
                ($1, $2, $3, $4, $5, $6, $7, find_or_create_address($8, $9, $10, $11));
        `,
        values: [
            userData.user_id, // $1
            userData.first_name, // $2
            userData.last_name, // $3
            userData.password_hash, // $4
            userData.email, // $5
            userData.phone_number, // $6
            userData.is_admin, // $7

            userData.address.street, // $8
            userData.address.city, // $9
            userData.address.state, // $10
            userData.address.country // $11
        ]
    });

    return !!rowCount;
}

export async function updateUserPG(userID, newData) {
    await pgPool.query({
        text: `
            UPDATE
                users
            SET
                first_name = $1,
                last_name = $2,
                email = $3,
                phone_number = $4,
                is_admin = $5,
                address_id = find_or_create_address($6, $7, $8, $9)
            WHERE
                user_id = $10;
        `,
        values: [
            newData.first_name,
            newData.last_name,
            newData.email,
            newData.phone_number,
            newData.is_admin,

            newData.address.street,
            newData.address.city,
            newData.address.state,
            newData.address.country,

            userID
        ]
    });

    return await getUserPG(userID); // Return updated user
}

export async function deleteUserPG(userID) {
    if (!(await getUserPG(userID))) throwResErr(404, "User does not exist");

    await pgPool.query({
        text: "DELETE FROM users WHERE user_id = $1;",
        values: [userID]
    });
}


export async function ensureUserExistsPG(userID) {
    const user = await getUserPG(userID);
        
    if (!user) throwResErr(404, `User (with user_id "${userID}") does not exist`);
}