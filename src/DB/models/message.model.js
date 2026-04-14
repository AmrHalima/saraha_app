import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: true,
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: {
                name: "idX_receiverId",
            },
        },
    },
    {
        timestamps: true,
    },
);
const Message =
    mongoose.models.Message || mongoose.model("Message", MessageSchema);
export default Message;
