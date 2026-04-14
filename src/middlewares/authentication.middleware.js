import { TOKEN_TYPES } from "../utils/constants.utils.js";
import { getUserAndDecodedTokenFromToken } from "../utils/tokens.utils.js";

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
                new Error("Invalid user credentials , register first", {
                    cause: { status: 401 },
                }),
            );
        }
        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
};
export default authenticate;
