import { UserRepository } from '../repositories/user.repository';
import { User } from '../schemas/user.schema';

import { ApiError } from '../utils/Err';
import bcrypt from 'bcrypt';
import { genRandomString } from '../utils/common';

import { USER_ROLE, USER_STATUS } from '../utils/enum';
import { API_STATUS_CODE } from '../utils/enum';

const userRepo = new UserRepository();

export class UserService {
    async createUser(reqJson: any): Promise<User | ApiError> {
        // Step 0: Data validation
        const userReq = new User(reqJson);
        const validateResult = userReq.validateCreateInput();
        if (!validateResult.success) {
            console.log(validateResult);
            throw new ApiError(validateResult.errors?.[0] ?? "", API_STATUS_CODE.INVALID_ARGUMENT, 400);
        }
        let user = validateResult.data!;

        // Step 1: Check user email not existed in database
        const dbUser = await userRepo.getUserByEmail(user.email!)
        if (dbUser) {
            throw new ApiError("User existed", API_STATUS_CODE.INVALID_ARGUMENT, 400);
        }

        // Step 2: Hash user password
        const salt = genRandomString(20);
        const pwWithSalt = user.password! + user.password_salt!;
        const hashedPw = await bcrypt.hash(pwWithSalt, 10);

        user.password_salt = salt;
        user.password = hashedPw;

        // Step 3: Assign user default role and status;
        user.role_id = USER_ROLE.USER;
        user.status_id = USER_STATUS.UNVERIFIED;

        // Step 4: Insert user into database
        const userRes = await userRepo.createUser(user);

        // TODO: Step 5: Generate 6-digit OTP
        // TODO: Step 6: Send confirmation email with OTP

        return userRes.hideSensitive();
    }

    async getUserById(reqParams: any): Promise<User | ApiError> {
        const userId = parseInt(reqParams.id);
        const user = await userRepo.getUserById(userId);
        if (!user) {
            throw new ApiError("User not existed", API_STATUS_CODE.INVALID_ARGUMENT, 400);
        }
        return user.hideSensitive();
    }

    async getAllUsers(): Promise<User[] | ApiError> {
        const users = await userRepo.getAllUsers();
        return users.map((user) => user.hideSensitive());
    }
}