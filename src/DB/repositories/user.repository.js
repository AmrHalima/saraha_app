import {User} from './../models/index.js'
import  Repository  from './repository.js';


class UserRepository extends Repository{
    constructor(){
        super(User)
    }
}
export default new UserRepository();