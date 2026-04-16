import "./config/env.config.js";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import envConfig from "./config/env.config.js";
import { corsOptions } from "./config/cors.config.js";
import dbconnection from "./DB/models/db.connection.js";
import { globalErrorHandler } from "./middlewares/index.js";
import * as controllers from "./modules/index.js";
import morgan from "morgan";

const app = express();

const port = envConfig.app.PORT;

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: { message: "Too many requests, please try again later." },
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
        message:
            "Too many authentication attempts, please try again in a few minutes.",
    },
});

dbconnection();

app.use(
    helmet({
        crossOriginResourcePolicy: { policy: "cross-origin" },
    }),
);
app.use(cors(corsOptions));
app.use("/uploads", express.static("uploads"));
app.use(express.json());
app.use(morgan("common"));
app.use("/api", apiLimiter);
app.use("/api/auth", authLimiter);

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
