import { Token } from "../models/index.js";
import Repository from "./repository.js";

class TokenRepository extends Repository {
    constructor() {
        super(Token);
    }
}

export default new TokenRepository();
