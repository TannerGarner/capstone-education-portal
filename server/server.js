import express from "express";
import logger from "./logging/logger.js";
import { coursesMW, registerMW } from "./middleware/student-middleware.js";
import setUpMorgan from "./services/morgan.js";

const PORT = process.env.PORT || 3001;

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
setUpMorgan(app);


// app.post("/register", registerMW); // Incomplete
// app.post("/login", "..."); // Incomplete
app.get("/courses", coursesMW);


app.listen(PORT, () => logger.info(`Server listening on ${PORT}`));