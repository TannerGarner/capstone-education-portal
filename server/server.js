import express from "express";
import { logger } from "./logging/log.js";
import { register } from "./middleware/student-middleware.js";
import pgPool from "./services/postgres.js";
import { setUpMorgan } from "./services/morgan.js";

const PORT = process.env.PORT || 3001;

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
setUpMorgan(app);


// import pg from "pg";
// const { Pool } = pg;
// const connectionString = process.env.DB_URI || 'postgres://postgres:postgres@localhost:5432/capstone-test';
// logger.info(`connectionString: ${connectionString}`);

// const pool = new Pool({ connectionString });



app.get("/", (_req, res) => {
    res.send("Hello World!");
});

app.get("/test", (_req, res) => {
    res.send("Test Endpoint");
});

app.get("/test-query", async (req, res) => {
    try {
        const data = await pgPool.query({
            text: "SELECT * FROM courses;",
            values: []
        });

        res.json(data.rows)
    } catch (err) {
        logger.info(`err: ${err}`);
        res.status(500).send("Error");
    }
});


// app.post("/register", register);
// app.post("/login", "...");
// app.get("/courses", "...");


app.listen(PORT, () => logger.info(`Server listening on ${PORT}`));