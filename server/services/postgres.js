import pg from "pg";

const { Pool } = pg;
const connectionString = process.env.DB_URI || 'postgres://postgres:postgres@localhost:5432/capstone-test';
// logger.info(`connectionString: ${connectionString}`);

const pgPool = new Pool({ connectionString });
export default pgPool;