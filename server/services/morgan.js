import morgan from "morgan";
import logger from "../logging/logger.js";

export default function configMorgan(app) {
    app.use(morgan("combined", {
        stream: {
            write: (message) => logger.http(message.trim())
        }
    }));
}