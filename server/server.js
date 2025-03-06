import express from "express";
import logger from "./logging/logger.js";
import { getCoursesMW, getRegisterMW, getUserMW } from "./middleware/student-middleware.js";
import setUpMorgan from "./services/morgan.js";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.static(path.resolve(__dirname, "../client/dist")));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
setUpMorgan(app);


app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
});

app.post("/api/register", getRegisterMW);
// app.post("/api/login", "..."); // Incomplete
app.get("/api/courses", getCoursesMW);
app.get("/api/user/:userID", getUserMW);

app.listen(PORT, () => logger.info(`Server listening on ${PORT}`));