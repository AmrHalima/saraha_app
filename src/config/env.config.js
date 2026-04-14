import { config } from "dotenv";
config({ path: [`.${process.env.NODE_ENV}.env`, ".env"] });
const envConfig = {
    app: {
        NODE_ENV: process.env.NODE_ENV ?? "dev",
        PORT: process.env.PORT ?? "3000",
        HOST:
            process.env.HOST && process.env.PORT
                ? `${process.env.HOST}:${process.env.PORT}`
                : "http://localhost:3000",
    },
    GCP:{
        CLIENT_ID : process.env.GCP_CLIENT_ID,
    },
    client: {
        ORIGIN:
            process.env.CLIENT_HOST && process.env.CLIENT_PORT
                ? `${process.env.CLIENT_HOST}:${process.env.CLIENT_PORT}`
                : "http://localhost:3001",
    },
    database: {
        MONGO_URI: process.env.MONGO_URI,
    },
    encryption: {
        ENC_IV_LENGTH: Number(process.env.ENC_IV_LENGTH),
        ENC_KEY: process.env.ENC_KEY,
    },
    hash: {
        HASH_SALT_ROUNDS: Number(process.env.HASH_SALT_ROUNDS),
    },
    jwt: {
        user: {
            ACCESS_SECRET: process.env.ACCESS_SECRET_USER,
            ACCESS_EXP: process.env.ACCESS_EXP_USER,
            REFRESH_SECRET: process.env.REFRESH_SECRET_USER,
            REFRESH_EXP: process.env.REFRESH_EXP_USER,
        },
        admin: {
            ACCESS_SECRET: process.env.ACCESS_SECRET_ADMIN,
            ACCESS_EXP: process.env.ACCESS_EXP_ADMIN,
            REFRESH_SECRET: process.env.REFRESH_SECRET_ADMIN,
            REFRESH_EXP: process.env.REFRESH_EXP_ADMIN,
        },
    },
};
export default envConfig;
