import messageRepository from "../../DB/repositories/message.repository.js";


export const sendMessage=(body)=>{
    const {content,receiverId} = body;
    return messageRepository.create({ content, receiverId });
}
export const listMassages=(userId)=>{
    return messageRepository.find({receiverId:userId});
}