import pg from "pg";
import logger from "../../logging/logger.js";

const { Pool } = pg;
const connectionString = process.env.DB_URI || "postgres://postgres:postgres@localhost:5432/capstone-test";
logger.silly(`connectionString: ${connectionString}`);

const pgPool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false }
});
export default pgPool;