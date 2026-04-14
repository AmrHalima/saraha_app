import "./config/env.config.js";
import express from "express";
import cors from "cors";
import envConfig from "./config/env.config.js";
import { corsOptions } from "./config/cors.config.js";
import dbconnection from "./DB/models/db.connection.js";
import { globalErrorHandler } from "./middlewares/index.js";
import * as controllers from "./modules/index.js";
const app = express();

const port = envConfig.app.PORT;

dbconnection();

app.use(cors(corsOptions));

app.use(express.json());

app.use("/api/user", controllers.userController);
app.use("/api/auth", controllers.authController);
app.use("/api/message", controllers.messageController);

app.get("/", (req, res) => {
    res.json("welcome to saraha app");
});

app.use((req, res, next) => {
    res.status(404).json("not found route");
});

app.use(globalErrorHandler);

app.listen(port, () => {
    console.log("server is running on port " + port);
});
