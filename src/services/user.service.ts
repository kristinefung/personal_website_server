import bcrypt from 'bcrypt';

import { UserRepository } from '../repositories/user.repository';
import { User } from '../entities/user.entity';

import { ApiError } from '../utils/err';
import { genRandomString } from '../utils/common';
import { UserRole, UserStatus, ApiStatusCode } from '../utils/enum';

const userRepo = new UserRepository();

export interface IUserService {
    createUser(userReq: User): Promise<User | ApiError>;
    getUserById(userId: number): Promise<User | ApiError>;
    getAllUsers(): Promise<User[] | ApiError>;
    deleteUserById(userId: number): Promise<null | ApiError>;
    updateUserById(userId: number, userReq: User): Promise<User | ApiError>;
}

export class UserService implements IUserService {
    async createUser(userReq: User): Promise<User | ApiError> {
        // Step 0: Data validation
        const validateResult = userReq.validateCreateInput();
        if (!validateResult.success) {
            console.log(validateResult);
            throw new ApiError(validateResult.errors?.[0] ?? "", ApiStatusCode.INVALID_ARGUMENT, 400);
        }
        let user = validateResult.data!;

        // Step 1: Check user email not existed in database
        const dbUser = await userRepo.getUserByEmail(user.email!)
        if (dbUser) {
            throw new ApiError("User existed", ApiStatusCode.INVALID_ARGUMENT, 400);
        }

        // Step 2: Hash user password
        const salt = genRandomString(20);
        const pwWithSalt = user.password! + user.password_salt!;
        const hashedPw = await bcrypt.hash(pwWithSalt, 10);

        user.password_salt = salt;
        user.password = hashedPw;

        // Step 3: Assign user default role and status;
        user.role_id = UserRole.USER;
        user.status_id = UserStatus.UNVERIFIED;

        // Step 4: Insert user into database
        const userRes = await userRepo.createUser(user);

        // TODO: Step 5: Generate 6-digit OTP
        // TODO: Step 6: Send confirmation email with OTP

        return userRes.hideSensitive();
    }

    async getUserById(userId: number): Promise<User | ApiError> {
        const user = await userRepo.getUserById(userId);
        if (!user) {
            throw new ApiError("User not existed", ApiStatusCode.INVALID_ARGUMENT, 400);
        }
        return user.hideSensitive();
    }

    async getAllUsers(): Promise<User[] | ApiError> {
        const users = await userRepo.getAllUsers();
        return users.map((user) => user.hideSensitive());
    }

    async deleteUserById(userId: number): Promise<null | ApiError> {
        const user = await userRepo.deleteUserById(userId);
        return user;
    }

    async updateUserById(userId: number, userReq: User): Promise<User | ApiError> {
        // Step 0: Data validation
        const validateResult = userReq.validateUpdateInput();
        if (!validateResult.success) {
            console.log(validateResult);
            throw new ApiError(validateResult.errors?.[0] ?? "", ApiStatusCode.INVALID_ARGUMENT, 400);
        }
        let user = validateResult.data!;

        // Step 1: Update user into database
        const userRes = await userRepo.updateUserById(userId, user);

        return userRes.hideSensitive();
    }
}