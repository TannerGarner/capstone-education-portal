import logger from "./logging/logger.js";
import { getCoursesMW, postUserMW, getUserMW, putUserMW, authMW, loginMW, errMW, verifyTokenMW } from "./middleware/student-middleware.js";
import createApp from "./services/express.js";

const app = createApp();
const PORT = process.env.PORT || 3001;

app.get("/api", (_req, res) => {
    res.json({ message: "Hello from server!" });
});

app.post("/api/login", loginMW);
app.post("/api/user", postUserMW);
app.put("/api/user/:userID", authMW, putUserMW);
app.get("/api/courses", authMW, getCoursesMW);
app.get("/api/user/:userID", authMW, getUserMW);
app.get("/api/verify-token", authMW, verifyTokenMW);

app.use(errMW);

app.listen(PORT, () => logger.info(`Server listening on ${PORT}`));