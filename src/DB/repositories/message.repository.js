import {Message} from "../models/index.js";
import Repository from "./repository.js";

class MessageRepository extends Repository {
    constructor() {
        super(Message);
    }
}
export default new MessageRepository();