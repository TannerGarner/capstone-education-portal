import pgPool from "./pgPool.js";

export async function getAddressPG(addressID) {
    const res = await pgPool.query({
        text: `
            SELECT
                street,
                city,
                state_or_region,
                country
            FROM
                addresses
            WHERE
                address_id = $1;
        `,
        values: [addressID]
    });
    const user = res.rows[0];

    return user;
}

export async function createAddressPG(userID, addressData) {
    await pgPool.query({
        text: `
            INSERT INTO
                addresses (user_id, street, city, state_or_region, country)
            VALUES
                ($1, $2, $3, $4, $5);
        `,
        values: [
            userID,
            addressData.street,
            addressData.city,
            addressData.state,
            addressData.country
        ]
    });
}

export async function updateAddressPG(userID, addressData) {
    await pgPool.query({
        text: `
            UPDATE
                addresses
            SET
                street = $1,
                city = $2,
                state_or_region = $3,
                country = $4
            WHERE
                user_id = $5;
        `,
        values: [
            addressData.street,
            addressData.city,
            addressData.state,
            addressData.country,
            userID
        ]
    });
}