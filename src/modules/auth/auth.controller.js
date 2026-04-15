import { Router } from "express";
import * as authService from "./auth.service.js";
import {validate,responseFormatter} from "../../middlewares/index.js";
import {
    gmailLoginSchema,
    gmailRegisterSchema,
    loginSchema,
    refreshTokenSchema,
    registerSchema,
} from "../../validators/auth.validator.js";

const authController = Router();

authController.post(
    "/register",validate(registerSchema),
    responseFormatter(async (req, res) => {
        const result = await authService.register(req.body);
        return {
            message: "user registered successfully",
            data: result,
            meta: { statusCode: 201 },
        };
    }),
);

authController.post(
    "/login",
    validate(loginSchema),
    responseFormatter(async (req, res) => {
        const result = await authService.login(req.body);
        return {
            message: "user found successfully",
            data: result,
            meta: { statusCode: 200 },
        };
    }),
);

authController.post(
    "/refresh-token",
    validate(refreshTokenSchema),
    responseFormatter(async (req, res) => {
        const result = await authService.refreshTokenService(req.headers);
        return {
            message: "access token refreshed successfully",
            data: { accessToken: result },
            meta: { statusCode: 200 },
        };
    }),
);

authController.post(
    "/gmail/register",
    validate(gmailRegisterSchema),
    responseFormatter(async (req, res) => {
        const result = await authService.gmailRegisterService(req.body);
        return {
            message: "user registered successfully",
            data: result,
            meta: { statusCode: 201 },
        };
    }),
);

authController.post(
    "/gmail/login",
    validate(gmailLoginSchema),
    responseFormatter(async (req, res) => {
        const result = await authService.gmailLoginService(req.body);
        return {
            message: "user logged in successfully",
            data: result,
            meta: { statusCode: 200 },
        };
    }),
);

export default authController;
