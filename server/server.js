import express from "express";
import { logger, setUpMorgan } from "./logging/log.js";

const PORT = process.env.PORT || 3001;

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
setUpMorgan(app);


app.get("/", (_req, res) => {
    res.send("Hello World!");
});

app.get("/test", (_req, res) => {
    res.send("Test Endpoint");
});


app.listen(PORT, () => {
    logger.info(`Server listening on ${PORT}`);
});