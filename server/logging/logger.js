import winston from "winston";

console.log("process.env.LOG_LEVEL:", process.env.LOG_LEVEL);

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL ?? "http",
    format: winston.format.json(),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: "./logging/server.log" })
    ]
});
export default logger;

logger.debug("Test");