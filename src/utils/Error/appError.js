class AppError extends Error {
    constructor(
        message = "an error occured",
        statusCode = 500,
        code = "INTERNAL_ERROR",
        details = null,
    ) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;
    }
}

export default AppError;
