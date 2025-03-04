import morgan from "morgan";

export function setUpMorgan(app) {
    app.use(morgan("combined", {
        stream: {
            write: (message) => logger.http(message.trim())
        }
    }));
}