import logger from "./logging/logger.js";
import { getCoursesMW, postUserMW, getUserMW, putUserMW, verifyTokenMW, loginMW } from "./middleware/student-middleware.js";
import createApp from "./services/express.js";

const app = createApp();
const PORT = process.env.PORT || 3001;

app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
});

app.post("/api/login", loginMW);

app.post("/api/user", postUserMW);
app.put("/api/user/:userID", putUserMW);
app.get("/api/courses", getCoursesMW);
app.get("/api/user/:userID", getUserMW);
app.get("/api/auth/verify", verifyTokenMW);

app.listen(PORT, () => logger.info(`Server listening on ${PORT}`));