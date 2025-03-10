import pgPool from "./pgPool.js";

export async function getUserPG(userID) {
    const res = await pgPool.query({
        text: "SELECT * FROM users WHERE user_id = $1;",
        values: [userID]
    });
    const user = res.rows[0] ?? null;

    return user;
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