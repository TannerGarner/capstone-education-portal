import logger from "./logging/logger.js";
import { authMW, errMW, verifyTokenMW } from "./middleware/student-middleware.js";
import usersRouter from "./routes/usersRouter.js";
import coursesRouter from "./routes/coursesRouter.js";
import createApp from "./services/express.js";

const app = createApp();
const PORT = process.env.PORT || 3001;

// Endpoints:
app.get("/api", (_req, res) => res.json({ message: "Hello from server!" }));
app.get("/api/verify-token", authMW, verifyTokenMW);

// Routes:
app.use("/api", usersRouter);
app.use("/api/courses", coursesRouter);

// Error handling endpoint:
app.use(errMW);

app.listen(PORT, () => logger.info(`Server listening on ${PORT}`));