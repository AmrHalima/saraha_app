import { Router } from "express";
import * as authService from "./auth.service.js";
import {validate,responseFormatter, authenticate} from "../../middlewares/index.js";
import {
    forgotPasswordSchema,
    gmailLoginSchema,
    gmailRegisterSchema,
    loginSchema,
    logoutSchema,
    refreshTokenSchema,
    registerSchema,
    resetPasswordSchema,
    updatePasswordSchema,
    verifyEmailSchema,
} from "../../validators/auth.validator.js";

const authController = Router();

authController.post(
    "/register",validate(registerSchema),
    responseFormatter(async (req, res) => {
        await authService.register(req.body);
        return {
            message: "confirmation email has been sent",
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
    "/verify-email",
    validate(verifyEmailSchema),
    responseFormatter(async (req) => {
        await authService.verifyEmailService(req.body);
        return {
            message: "email verified successfully",
            meta: { statusCode: 200 },
        };
    }),
);

authController.post(
    "/forgot-password",
    validate(forgotPasswordSchema),
    responseFormatter(async (req) => {
        await authService.forgotPasswordService(req.body);
        return {
            message: "password reset code sent successfully",
            meta: { statusCode: 200 },
        };
    }),
);

authController.post(
    "/reset-password",
    validate(resetPasswordSchema),
    responseFormatter(async (req) => {
        await authService.resetPasswordService(req.body);
        return {
            message: "password reset successfully",
            meta: { statusCode: 200 },
        };
    }),
);

authController.patch(
    "/update-password",
    authenticate,
    validate(updatePasswordSchema),
    responseFormatter(async (req) => {
        await authService.updatePasswordService(req);
        return {
            message: "password updated successfully",
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

authController.post(
    "/logout",
    authenticate,
    validate(logoutSchema),
    responseFormatter(async (req, res) => {
        await authService.logoutService(req);
        return {
            message: "logged out successfully",
            meta: { statusCode: 200 },
        };
    }),
);
export default authController;
