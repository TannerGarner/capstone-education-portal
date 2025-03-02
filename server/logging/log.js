import winston from "winston";
import morgan from "morgan";

export const logger = winston.createLogger({
    level: process.env.LOG_LEVEL ?? "http",
    format: winston.format.json(),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: "./logging/server.log" })
    ]
});

export function setUpMorgan(app) {
    app.use(morgan("combined", {
        stream: {
            write: (message) => logger.http(message.trim())
        }
    }));
}