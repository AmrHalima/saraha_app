import Joi from "joi";
import { GENDER } from "../utils/constants.utils.js";

const objectIdPattern = /^[0-9a-fA-F]{24}$/;

const authorizationHeaderSchema = Joi.string()
    .trim()
    .pattern(/^Bearer\s+[^\s]+$/)
    .required()
    .messages({
        "string.base": "authorization header must be a string",
        "string.empty": "authorization header is required",
        "string.pattern.base":
            "authorization header must use this format: Bearer <token>",
        "any.required": "authorization header is required",
    });

export const profileSchema = {
    headers: Joi.object({
        authorization: authorizationHeaderSchema,
    })
        .required()
        .unknown(true),
};

export const getAllUsersSchema = {
    headers: Joi.object({
        authorization: authorizationHeaderSchema,
    })
        .required()
        .unknown(true),
};

export const updateProfileSchema = {
    headers: Joi.object({
        authorization: authorizationHeaderSchema,
    })
        .required()
        .unknown(true),
    body: Joi.object({
        firstName: Joi.string().trim().min(3).max(50).messages({
            "string.base": "firstName must be a string",
            "string.empty": "firstName cannot be empty",
            "string.min": "firstName must contain at least {#limit} characters",
            "string.max": "firstName must contain at most {#limit} characters",
        }),
        lastName: Joi.string().trim().min(3).max(50).messages({
            "string.base": "lastName must be a string",
            "string.empty": "lastName cannot be empty",
            "string.min": "lastName must contain at least {#limit} characters",
            "string.max": "lastName must contain at most {#limit} characters",
        }),
        email: Joi.string()
            .trim()
            .lowercase()
            .email({ tlds: { allow: false } })
            .messages({
                "string.base": "email must be a string",
                "string.empty": "email cannot be empty",
                "string.email": "email must be a valid email address",
            }),
        phoneNumber: Joi.string()
            .trim()
            .pattern(/^\+?[1-9]\d{7,14}$/)
            .messages({
                "string.base": "phoneNumber must be a string",
                "string.empty": "phoneNumber cannot be empty",
                "string.pattern.base":
                    "phoneNumber must be a valid international phone number",
            }),
        gender: Joi.number()
            .integer()
            .valid(...Object.values(GENDER))
            .messages({
                "number.base": "gender must be a number",
                "number.integer":
                    "gender must be either 0 (male) or 1 (female)",
                "any.only": "gender must be either 0 (male) or 1 (female)",
            }),
    })
        .min(1)
        .required()
        .unknown(false)
        .messages({
            "object.base": "request body must be a valid object",
            "object.min":
                "request body must include at least one field to update",
            "any.required": "request body is required",
            "object.unknown": "{{#label}} is not allowed",
        }),
};

export const uploadProfileImgSchema = {
    headers: Joi.object({
        authorization: authorizationHeaderSchema,
    })
        .required()
        .unknown(true),
};

export const userIdParamSchema = {
    params: Joi.object({
        id: Joi.string().trim().pattern(objectIdPattern).required().messages({
            "string.base": "id must be a string",
            "string.empty": "id is required",
            "string.pattern.base": "id must be a valid MongoDB ObjectId",
            "any.required": "id is required",
        }),
    })
        .required()
        .unknown(false)
        .messages({
            "object.base": "request params must be a valid object",
            "any.required": "request params are required",
            "object.unknown": "{{#label}} is not allowed",
        }),
};
