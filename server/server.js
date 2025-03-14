import logger from "./logging/logger.js";
import { authMW, errMW, verifyTokenMW } from "./middleware/student-middleware.js";
import usersRouter from "./routes/usersRouter.js";
import coursesRouter from "./routes/coursesRouter.js";
import createApp from "./services/express.js";
import { getCourseMaxCapacityPG, getCoursesForUserPG, getCoursesUsersCountPG, getUsersForCoursePG } from "./services/postgres/enrollmentCRUD.js";

const app = createApp();
const PORT = process.env.PORT || 3001;

// Endpoints:
app.get("/api", (_req, res) => res.json({ message: "Hello from server!" }));
app.get("/api/verify-token", authMW, verifyTokenMW);


// Test Endpoint
app.get("/test", async (req, res) => {
    res.json({ value: await getCoursesUsersCountPG("ISYS-2000") });
});


// GET /api/users/{courseID}

// Routes:
app.use("/api/users", usersRouter);
app.use("/api/courses", coursesRouter);

// Error handling endpoint:
app.use(errMW);

app.listen(PORT, () => logger.info(`Server listening on ${PORT}`));