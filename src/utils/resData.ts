
import { User } from '../schemas/user.schema';

const hiddenWord = "********";

export class ResData {
    dataToResp(user: User): User {
        let userRes = user;

        userRes.password = hiddenWord;
        userRes.password_salt = hiddenWord;

        return userRes;
    }
}