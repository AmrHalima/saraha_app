import mongoose from "mongoose";
import envConfig from "../../config/env.config.js";

const mongodbURI = envConfig.database.MONGO_URI;

const dbconnection = async () => {
    try {
        await mongoose.connect(mongodbURI);
        console.log("DB connected successfully");
    } catch (error) {
        console.log("DB failed connection try , error : ", error);
    }
};
export default dbconnection;