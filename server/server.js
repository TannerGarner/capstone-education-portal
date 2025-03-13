import logger from "./logging/logger.js";
import { getCoursesMW, postUserMW, getUserMW, putUserMW, authMW, loginMW, errMW, verifyTokenMW, putCoursesMW, postCoursesMW } from "./middleware/student-middleware.js";
import userRouter from "./routes/userRouter.js";
import coursesRouter from "./routes/coursesRouter.js";
import createApp from "./services/express.js";

const app = createApp();
const PORT = process.env.PORT || 3001;

// Test endpoint:
app.get("/api", (_req, res) => {
    res.json({ message: "Hello from server!" });
});

// JWT verification endpoint:
app.get("/api/verify-token", authMW, verifyTokenMW);

// User endpoints:
app.post("/api/login", loginMW);
app.use("/api/user", userRouter);

// Course routes:
app.use("/api/courses", coursesRouter);

// Error handling endpoint:
app.use(errMW);

app.listen(PORT, () => logger.info(`Server listening on ${PORT}`));