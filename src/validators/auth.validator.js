import Joi from "joi";
import { GENDER, USER_ROLES } from "../utils/constants.utils.js";

const nameSchema = Joi.string().trim().min(3).max(50).messages({
    "string.base": "{{#label}} must be a string",
    "string.empty": "{{#label}} is required",
    "string.min": "{{#label}} must contain at least {#limit} characters",
    "string.max": "{{#label}} must contain at most {#limit} characters",
});

const emailSchema = Joi.string()
    .trim()
    .lowercase()
    .email({ tlds: { allow: false } })
    .messages({
        "string.base": "email must be a string",
        "string.empty": "email is required",
        "string.email": "email must be a valid email address",
    });

const passwordSchema = Joi.string()
    .min(8)
    .max(128)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
    .messages({
        "string.base": "password must be a string",
        "string.empty": "password is required",
        "string.min": "password must contain at least {#limit} characters",
        "string.max": "password must contain at most {#limit} characters",
        "string.pattern.base":
            "password must include at least one uppercase letter, one lowercase letter, and one number",
    });

const phoneNumberSchema = Joi.string()
    .trim()
    .pattern(/^\+?[1-9]\d{7,14}$/)
    .messages({
        "string.base": "phoneNumber must be a string",
        "string.empty": "phoneNumber cannot be empty",
        "string.pattern.base":
            "phoneNumber must be a valid international phone number",
    });

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

export const registerSchema = {
    body: Joi.object({
        firstName: nameSchema.required().label("firstName"),
        lastName: nameSchema.required().label("lastName"),
        email: emailSchema.required(),
        password: passwordSchema.required(),
        gender: Joi.number().integer().valid(...Object.values(GENDER)).messages({
            "number.base": "gender must be a number",
            "number.integer": "gender must be either 0 (male) or 1 (female)",
            "any.only": "gender must be either 0 (male) or 1 (female)",
        }),
        phoneNumber: phoneNumberSchema,
        role: Joi.string().valid(...Object.values(USER_ROLES)).messages({
            "string.base": "role must be a string",
            "any.only": "role must be either user or admin",
        }),
    })
        .required()
        .unknown(false)
        .messages({
            "object.base": "request body must be a valid object",
            "any.required": "request body is required",
            "object.unknown": "{{#label}} is not allowed",
        }),
};

export const loginSchema = {
    body: Joi.object({
        email: emailSchema.required(),
        password: Joi.string().required().messages({
            "string.base": "password must be a string",
            "string.empty": "password is required",
            "any.required": "password is required",
        }),
    })
        .required()
        .unknown(false)
        .messages({
            "object.base": "request body must be a valid object",
            "any.required": "request body is required",
            "object.unknown": "{{#label}} is not allowed",
        }),
};

export const refreshTokenSchema = {
    headers: Joi.object({
        authorization: authorizationHeaderSchema,
    })
        .required()
        .unknown(true),
};

const idTokenBodySchema = Joi.object({
    idToken: Joi.string().trim().required().messages({
        "string.base": "idToken must be a string",
        "string.empty": "idToken is required",
        "any.required": "idToken is required",
    }),
})
    .required()
    .unknown(false)
    .messages({
        "object.base": "request body must be a valid object",
        "any.required": "request body is required",
        "object.unknown": "{{#label}} is not allowed",
    });

export const gmailRegisterSchema = {
    body: idTokenBodySchema,
};

export const gmailLoginSchema = {
    body: idTokenBodySchema,
};
