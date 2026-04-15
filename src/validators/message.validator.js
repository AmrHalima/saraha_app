import Joi from "joi";

const objectIdPattern = /^[0-9a-fA-F]{24}$/;

export const sendMessageSchema = {
    body: Joi.object({
        content: Joi.string().trim().min(1).max(2000).required().messages({
            "string.base": "content must be a string",
            "string.empty": "content is required",
            "string.min": "content cannot be empty",
            "string.max": "content must contain at most {#limit} characters",
            "any.required": "content is required",
        }),
        receiverId: Joi.string()
            .trim()
            .pattern(objectIdPattern)
            .required()
            .messages({
                "string.base": "receiverId must be a string",
                "string.empty": "receiverId is required",
                "string.pattern.base": "receiverId must be a valid MongoDB ObjectId",
                "any.required": "receiverId is required",
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

export const listMessagesSchema = {
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
