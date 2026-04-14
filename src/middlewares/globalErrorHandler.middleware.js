import envConfig from "../config/env.config.js";

const globalErrorHandler = (err, req, res, next) => {
    res.status(err?.statusCode || 500).json({
        success:false,
        message: err?.message || "internal server error",
        error:{code:err.code,details:err.details},
        stack: envConfig.app.NODE_ENV == "dev" ? err.stack : undefined,
    });
};
export default globalErrorHandler;
