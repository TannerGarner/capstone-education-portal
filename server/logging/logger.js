import winston from "winston";
import path from "path";

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL ?? "http",
    format: winston.format.json(),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: path.join(".", "logging", "server.log") })
    ]
});
export default logger;