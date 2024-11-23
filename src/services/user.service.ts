import { UserRepository } from '../repositories/user.repository';
import { validateCreateUser, User } from '../schemas/user.schema';

import { Dto } from '../utils/dto';
import { ApiError } from '../utils/apiError';
import bcrypt from 'bcrypt';
import { genRandomString } from '../utils/common';
import { ResData } from '../utils/resData';

import { USER_ROLE, USER_STATUS } from '../utils/enum';
import { API_STATUS_CODE } from '../utils/enum';

const sourceName = "UserService";

const userRepo = new UserRepository();
const resData = new ResData();
const dto = new Dto();

export class UserService {
    async createUser(reqJson: any): Promise<User | ApiError> {
        try {
            // Step 0: Data validation
            const validateResult = validateCreateUser(reqJson);
            if (!validateResult.success) {
                throw dto.dataToError(sourceName, validateResult.errors?.[0]);
            }
            let user = validateResult.data!;

            // Step 1: Check user email not existed in database
            const dbUser = await userRepo.getUserByEmail(user.email!)
            if (dbUser) {
                throw new ApiError("User existed", API_STATUS_CODE.INVALID_ARGUMENT);
            }

            // Step 2: Hash user password
            user = await this.hashUserPassword(user);

            // Step 3: Assign user default role and status;
            user.role_id = USER_ROLE.USER;
            user.status_id = USER_STATUS.UNVERIFIED;

            // Step 4: Insert user into database
            const createdUser = await userRepo.createUser(user);

            // TODO: Step 5: Generate 6-digit OTP
            // TODO: Step 6: Send confirmation email with OTP
            return resData.dataToResp(createdUser);
        }
        catch (err: any) {
            throw dto.dataToError(sourceName, err);
        }
    }

    async getUserById(id: number): Promise<User | null> {
        return await userRepo.getUserById(id);
    }

    async getAllUsers(): Promise<User[]> {
        return await userRepo.getAllUsers();
    }

    async hashUserPassword(user: User): Promise<User | ApiError> {
        try {
            // Step 1: Hash user password
            const salt = genRandomString(20);

            const pwWithSalt = user.password! + user.password_salt!;
            const hashedPw = await bcrypt.hash(pwWithSalt, 10);

            // Step 2: return user with hashed password
            user.password_salt = salt;
            user.password = hashedPw;
            return user;
        }
        catch (err: any) {
            throw dto.dataToError(sourceName, err);
        }
    }
}