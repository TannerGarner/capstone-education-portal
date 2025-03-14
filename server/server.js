import logger from "./logging/logger.js";
import { authMW, errMW, verifyTokenMW } from "./middleware/student-middleware.js";
import usersRouter from "./routes/usersRouter.js";
import coursesRouter from "./routes/coursesRouter.js";
import createApp from "./services/express.js";
import enrollmentRouter from "./routes/enrollmentRouter.js";

const app = createApp();
const PORT = process.env.PORT || 3001;

// Endpoints:
app.get("/api", (_req, res) => res.json({ message: "Hello from server!" }));
app.get("/api/verify-token", authMW, verifyTokenMW);


// Test Endpoint
// app.get("/test", async (req, res) => {
//     res.json({ value: await isUserEnrolledInCoursePG(19543829, "CSCI-2009") });
// });


// GET /api/enrollment/course/{courseID}
// GET /api/enrollment/user/{userID}


// Routes:
app.use("/api/users", usersRouter);
app.use("/api/courses", coursesRouter);
app.use("/api/enrollment", enrollmentRouter);

// Error handling endpoint:
app.use(errMW);

app.listen(PORT, () => logger.info(`Server listening on ${PORT}`));