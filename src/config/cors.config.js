import envConfig from "./env.config.js";

const whiteListedOrigins = [
    `${envConfig.client.ORIGIN}`,
];

export const corsOptions = {
    origin: (origin, callback) => {
        const isAllowed =
            envConfig.app.NODE_ENV === "dev"
                ? whiteListedOrigins.includes(origin) || !origin
                : whiteListedOrigins.includes(origin);
        if (isAllowed) {
            callback(null, true);
        } else {
            callback(new Error("not allowed by CORS"));
        }
    },
};
