import pgPool from "./pgPool.js";

export async function getAddressPG(addressID) {
    const res = await pgPool.query({
        text: "SELECT * FROM addresses WHERE address_id = $1;",
        values: [addressID]
    });
    const user = res.rows[0];

    return user;
}