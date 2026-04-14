import { USER_ROLES } from "../utils/constants.utils.js";
import { getUserAndDecodedTokenFromToken } from "../utils/tokens.utils.js";

const authorize = (allowedRoles) => {
    return (req, res, next) => {
        const role = req.user.role;
        if (!allowedRoles.includes(role)) {
            next(
                new Error("unauthorized to access this endpoint", {
                    cause: { status: 401 },
                }),
            );
        }
        next();
    };
};

export default authorize;
