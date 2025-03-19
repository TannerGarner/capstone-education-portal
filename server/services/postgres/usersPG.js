import pgPool from "./pgPool.js";
import { throwResErr } from "../../utils/errHandling.js";

export async function getUserPG(userID, config) {
    function verifyUserExists(userData) {
        if (!userData) {
            if (config.throwErrWhenUserNotFound) throwResErr(404, `User (with user_id "${userID}") does not exist`);
            else return null;
        }
    }

    // Set up configuration variable:
    const defaultConfig = {
        throwErrWhenUserNotFound: true,
        returnPasswordHash: false,
        returnAddressDataOrID: "DATA"
    };
    config = {
        ...defaultConfig,
        ...config
    };

    // Get user data:
    if (config.returnAddressDataOrID === "DATA") {
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

        verifyUserExists(rawUserData);

        const organizedUserData = {
            user_id: rawUserData.user_id,
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

        if (!config.returnPasswordHash) delete organizedUserData.password_hash;

        return organizedUserData;
    }
    else if (config.returnAddressDataOrID === "ID") {
        const res = await pgPool.query({
            text: "SELECT * FROM users WHERE user_id = $1;",
            values: [userID]
        });

        const user = res.rows[0];

        if (!config.returnPasswordHash) delete user.password_hash;

        return user;
    }
}

export async function getUsersPG(searchTerm) {
    // Ensure that the searchTerm is not undefined and that it is trimmed:
    searchTerm = (searchTerm ?? "").trim();

    const mainQuery = `
        SELECT
            user_id,
            first_name,
            last_name,
            email,
            phone_number,
            is_admin
        FROM
            users
        WHERE
    `;
    let whereClause = "";
    let values = [];

    if (searchTerm.includes(" ")) {
        const splitSearchTerm = searchTerm.split(/\s+/gi);

        const firstName = splitSearchTerm[0];
        const lastName = splitSearchTerm[splitSearchTerm.length - 1];

        whereClause = "first_name ILIKE $1 AND last_name ILIKE $2";
        values = [`%${firstName}%`, `%${lastName}%`];
    }
    else {
        whereClause = "user_id::VARCHAR(9) ILIKE $1 OR first_name ILIKE $2 OR last_name ILIKE $2;";
        values = [`${searchTerm}%`, `%${searchTerm}%`];
    }

    const { rows: users } = await pgPool.query({
        text: mainQuery + whereClause,
        values: values
    });

    return users;
}

export async function createUserPG(userData) {
    await pgPool.query({
        // text: `
        //     INSERT INTO
        //         users (user_id, first_name, last_name, password_hash, email, phone_number, is_admin, address_id)
        //     VALUES
        //         ($1, $2, $3, $4, $5, $6, $7, find_or_create_address($8, $9, $10, $11));
        // `,
        text: `
            INSERT INTO
                users (user_id, first_name, last_name, password_hash, email, phone_number, is_admin)
            VALUES
                ($1, $2, $3, $4, $5, $6, $7);
        `,
        values: [
            userData.user_id, // $1
            userData.first_name, // $2
            userData.last_name, // $3
            userData.password_hash, // $4
            userData.email, // $5
            userData.phone_number, // $6
            userData.is_admin, // $7

            // userData.address.street, // $8
            // userData.address.city, // $9
            // userData.address.state, // $10
            // userData.address.country // $11
        ]
    });

    // return !!rowCount;
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