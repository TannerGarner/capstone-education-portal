import logger from "./logging/logger.js";
import usersRouter from "./routes/usersRouter.js";
import coursesRouter from "./routes/coursesRouter.js";
import createApp from "./services/express.js";
import enrollmentRouter from "./routes/enrollmentRouter.js";
import { jwtAuthMW, verifyTokenMW } from "./middleware/authMW.js";
import { jwtErrMW } from "./middleware/errMW.js";

const app = createApp();
const PORT = process.env.PORT || 3001;

// Endpoints:
app.get("/api", (_req, res) => res.json({ message: "Hello from server!" }));
app.get("/api/verify-token", jwtAuthMW, verifyTokenMW);

// Test Endpoint
app.get("/test", async (req, res) => {
    res.json({ value: await getUserPG(98) });
});

// Routes:
app.use("/api/users?", usersRouter);
app.use("/api/courses?", coursesRouter);
app.use("/api/enrollment", enrollmentRouter);

// Error handling endpoint:
app.use(jwtErrMW);

app.listen(PORT, () => logger.info(`Server listening on ${PORT}`));