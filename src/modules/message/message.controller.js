import { Router } from "express";
import * as messageService from "./message.service.js";
import responseFormatter from "../../middlewares/unifiedResponse.middleware.js";

const messageController = Router();

messageController.post(
    "/send",
    responseFormatter(async (req, res, next) => {
        const result = await messageService.sendMessage(req.body);
        return {
            message: "message sent",
            data: result,
            meta: { statusCode: 201 },
        };
    }),
);

messageController.get(
    "/my-messages/:id",
    responseFormatter(async (req, res) => {
        const messages = await messageService.listMassages(req.params.id);
        return {
            message: "messages retrieved successfully",
            data: { messages },
            meta: { statusCode: 200 },
        };
    }),
);

export default messageController;
