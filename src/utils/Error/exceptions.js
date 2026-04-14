import AppError from "./appError.js";

export class BadRequestError extends AppError {
    constructor(message = "Bad Request", details = null) {
        super(message, 400, "BAD_REQUEST", details);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message = "Unauthorized", details = null) {
        super(message, 401, "UNAUTHORIZED", details);
    }
}

export class ForbiddenError extends AppError {
    constructor(message = "Forbidden", details = null) {
        super(message, 403, "FORBIDDEN", details);
    }
}

export class NotFoundError extends AppError {
    constructor(message = "Not Found", details = null) {
        super(message, 404, "NOT_FOUND", details);
    }
}

export class ConflictError extends AppError {
    constructor(message = "Conflict", details = null) {
        super(message, 409, "CONFLICT", details);
    }
}
