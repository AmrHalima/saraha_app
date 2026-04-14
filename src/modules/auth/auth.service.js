import { OAuth2Client } from "google-auth-library";
import envConfig from "../../config/env.config.js";
import UserRepository from "../../DB/repositories/user.repository.js";
import {
    BadRequestError,
    ConflictError,
    NotFoundError,
    UnauthorizedError,
} from "../../utils/Error/exceptions.js";
import {
    asymmEncryption,
    compare,
    hash,
    PROVIDERS,
    TOKEN_TYPES,
} from "../../utils/index.js";
import {
    createLoginCredentials,
    getUserAndDecodedTokenFromToken,
} from "../../utils/tokens.utils.js";
import crypto from "crypto";
const envJWT = envConfig.jwt;
const client = new OAuth2Client();

const generateTokensHelper = (user, selectedToken = -1) => {
    return createLoginCredentials({
        payload: {
            sub: user._id || user.sub,
            role: user.role,
            email: user.email,
        },
        options: {
            access: {
                expiresIn: envJWT[user.role].ACCESS_EXP,
            },
            refresh: {
                expiresIn: envJWT[user.role].REFRESH_EXP,
            },
        },
        selectedToken,
    });
};

export const register = async (body) => {
    const { firstName, lastName, email, password, gender, phoneNumber, role } =
        body;
    const isUserExists = await UserRepository.findOne({ email }, { email: 1 });

    if (isUserExists) {
        throw new ConflictError("email already exists");
    }

    const hashedPassword = await hash(password);
    const userObj = {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        gender,
        role,
    };

    if (phoneNumber) {
        userObj.phoneNumber = asymmEncryption(phoneNumber);
    }
    return UserRepository.create(userObj);
};

export const login = async (body) => {
    const { email, password } = body;
    const user = await UserRepository.findOne({
        email,
        provider: PROVIDERS.SYSTEM,
    });

    if (!user || !(await compare(password, user.password))) {
        throw new UnauthorizedError("invalid email or password");
    }

    return generateTokensHelper(user);
};

export const refreshTokenService = async (headers) => {
    const { authorization: refreshToken } = headers;
    if (!refreshToken)
        throw new BadRequestError("authorization header is required");

    const { decodedData } = await getUserAndDecodedTokenFromToken(
        refreshToken,
        TOKEN_TYPES.REFRESH,
    );

    const { accessToken } = generateTokensHelper(
        decodedData,
        TOKEN_TYPES.ACCESS,
    );
    return accessToken;
};

export const verifyGCPToken = async (idToken) => {
    const ticket = await client.verifyIdToken({
        idToken,
        audience: envConfig.GCP.CLIENT_ID,
    });
    return ticket.getPayload();
};

const verifyGoogleUser = async (idToken) => {
    const payload = await verifyGCPToken(idToken);
    if (!payload || !payload.email_verified) {
        throw new UnauthorizedError(
            "Your account is not authorized, please contact google service",
        );
    }
    return payload;
};

export const gmailRegisterService = async (body) => {
    const payload = await verifyGoogleUser(body.idToken);

    const existingUser = await UserRepository.findOne({ email: payload.email });
    if (existingUser) {
        throw new ConflictError("User already exists, please login instead");
    }

    const user = await UserRepository.create({
        firstName: payload.given_name,
        lastName: payload.family_name,
        email: payload.email,
        provider: PROVIDERS.GOOGLE,
        googleSub: payload.sub,
        password: await hash(crypto.randomBytes(12).toString("hex")),
    });

    return generateTokensHelper(user);
};

export const gmailLoginService = async (body) => {
    const payload = await verifyGoogleUser(body.idToken);

    const user = await UserRepository.findOne({
        email: payload.email,
        provider: PROVIDERS.GOOGLE,
    });

    if (!user) {
        throw new NotFoundError(
            "Account not found or registered with a different provider",
        );
    }

    const updatedUser = await UserRepository.findByIdAndUpdate(
        user._id,
        {
            firstName: payload.given_name,
            lastName: payload.family_name,
        },
        { new: true },
    );

    return generateTokensHelper(updatedUser);
};
