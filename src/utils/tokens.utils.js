import jwt from "jsonwebtoken";
//symmetric
import envConfig from "../config/env.config.js";
import fs from "node:fs";
import userRepository from "../DB/repositories/user.repository.js";
import { TOKEN_TYPES, USER_ROLES } from "./constants.utils.js";

const host = envConfig.app.HOST;

const envJWT = envConfig.jwt;

export const generateToken = ({ payload, secret, options = {} }) => {
    return jwt.sign(payload, secret, options);
};

export const verifyToken = ({ payload, secret, options = {} }) => {
    return jwt.verify(payload, secret, options);
};
//asymmetric
const privateKey = fs.readFileSync("privateKey.pem");
export const generateTokenUsingPRkey = ({ payload, options = {} }) => {
    return jwt.sign(payload, privateKey, options);
};

const publicKey = fs.readFileSync("publicKey.pem");
export const verifyTokenUsingPKkey = ({ payload, options = {} }) => {
    return jwt.verify(payload, publicKey, options);
};

export const createLoginCredentials = ({
    payload,
    options = {},
    selectedToken = -1,
}) => {
    const signature = detectSignatureByRole({ role: payload.role });
    let accessToken, refreshToken;
    switch (selectedToken) {
        case TOKEN_TYPES.ACCESS:
            accessToken = generateToken({
                payload,
                secret: signature.ACCESS_SECRET,
                options: options.access,
            });
            break;
        case TOKEN_TYPES.REFRESH:
            refreshToken = generateToken({
                payload,
                secret: signature.REFRESH_SECRET,
                options: options.refresh,
            });
            break;
        case -1:
            accessToken = generateToken({
                payload,
                secret: signature.ACCESS_SECRET,
                options: options.access,
            });
            refreshToken = generateToken({
                payload,
                secret: signature.REFRESH_SECRET,
                options: options.refresh,
            });
            break;
        default:
            throw new Error("invalid token type");
            break;
    }

    return { accessToken, refreshToken };
};
export const getUserAndDecodedTokenFromToken = async (token, tokenType) => {
    let decodedData;

    try {
        if (token && token.startsWith("Bearer ")) {
            token = token.split(" ")[1];
        }
        decodedData = jwt.decode(token);
        if (!decodedData || !decodedData.role)
            throw new Error("invalid payload");
        const signature = detectSignatureByRoleAndType({
            role: decodedData.role,
            tokenType,
        });
        decodedData = verifyToken({
            payload: token,
            secret: signature,
        });
        if (!decodedData || !decodedData.sub)
            throw new Error("invalid payload");
    } catch (error) {
        throw new Error(error.message, { cause: { status: 401 } });
    }
    const user = await userRepository.findById(decodedData.sub);
    return { user, decodedData };
};

export const detectSignatureByRole = ({ role }) => {
    let signature;
    if (role == USER_ROLES.ADMIN) {
        signature = envJWT.admin;
    } else {
        signature = envJWT.user;
    }
    return signature;
};
export const detectSignatureByRoleAndType = ({ role, tokenType }) => {
    const signature = detectSignatureByRole({ role });
    let tokenSignature;
    switch (tokenType) {
        case TOKEN_TYPES.ACCESS:
            tokenSignature = signature.ACCESS_SECRET;
            break;
        case TOKEN_TYPES.REFRESH:
            tokenSignature = signature.REFRESH_SECRET;
            break;
        default:
            throw new Error("invalid token type", { cause: { status: 400 } });
    }
    return tokenSignature;
};
