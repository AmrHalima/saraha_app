import { TOKEN_TYPES } from "../utils/constants.utils.js";
import { getUserAndDecodedTokenFromToken } from "../utils/tokens.utils.js";
import { UnauthorizedError } from "../utils/Error/exceptions.js";

const authenticate = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return next(
            new Error("authorization header is required", {
                cause: { status: 400 },
            }),
        );
    }
    //bearer token
    const [prefix, token] = authorization.split(" ");
    try {
        const {user} = await getUserAndDecodedTokenFromToken(
            token,
            TOKEN_TYPES.ACCESS,
        );
        if (!user) {
            return next(
                new UnauthorizedError("Invalid user credentials , register first"),
            );
        }
        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
};
export default authenticate;
