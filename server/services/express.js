import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import configMorgan from "./morgan.js";

export default function createApp() {
    const app = express();
    
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    configFrontEnd(app);
    configMorgan(app);

    return app;
}

function configFrontEnd(app) {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);    
    
    app.use(express.static(path.resolve(__dirname, "../../client/dist")));
}