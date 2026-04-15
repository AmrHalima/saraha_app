import { Router } from "express";
import * as userService from "./user.service.js";
import authenticate from "../../middlewares/authentication.middleware.js";
import authorize from "../../middlewares/authorization.middleware.js";
import { USER_ROLES } from "../../utils/constants.utils.js";
import responseFormatter from "../../middlewares/unifiedResponse.middleware.js";
import { validate } from "../../middlewares/index.js";
import {
    getAllUsersSchema,
    profileSchema,
    updateProfileSchema,
} from "../../validators/user.validator.js";

const userController = Router();

userController.get(
    "/profile",
    validate(profileSchema),
    authenticate,
    responseFormatter((req, res) => {
        const result = userService.getProfileService(req.user);
        return {
            message: "user found successfully",
            data: result,
            meta: { statusCode: 200 },
        };
    }),
);

userController.get(
    "/all",
    validate(getAllUsersSchema),
    authenticate,
    authorize([USER_ROLES.ADMIN]),
    responseFormatter(async (req, res) => {
        const result = await userService.getAllUsersService();
        return {
            message: "all users retrieved successfully",
            data: result,
            meta: { statusCode: 200 },
        };
    }),
);

userController.put(
    "/update",
    validate(updateProfileSchema),
    authenticate,
    responseFormatter(async (req, res) => {
        const result = await userService.updateProfileService(
            req.user,
            req.body,
        );
        return {
            message: "user updated successfully",
            data: result,
            meta: { statusCode: 200 },
        };
    }),
);

export default userController;
