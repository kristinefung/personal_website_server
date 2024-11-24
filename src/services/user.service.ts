import bcrypt from 'bcrypt';

import { UserRepository } from '../repositories/user.repository';
import { TokenService } from './token.service';
import { User } from '../entities/user.entity';

import { ApiError } from '../utils/err';
import { genRandomString } from '../utils/common';
import { UserRole, UserStatus, ApiStatusCode } from '../utils/enum';

export interface IUserService {
    createUser(userReq: User): Promise<User | ApiError>;
    getUserById(userId: number): Promise<User | ApiError>;
    getAllUsers(): Promise<User[] | ApiError>;
    deleteUserById(userId: number): Promise<void | ApiError>;
    updateUserById(userId: number, userReq: User): Promise<User | ApiError>;

    login(userReq: User): Promise<string | ApiError>;
}

export class UserService implements IUserService {
    constructor(
        private userRepo: UserRepository,
        private tokenServ: TokenService
    ) { }

    async createUser(userReq: User): Promise<User | ApiError> {
        // Step 0: Data validation
        let user = userReq.createInputToUser();

        // Step 1: Check user email not existed in database
        const dbUser = await this.userRepo.getUserByEmail(user.email!)
        if (dbUser) {
            throw new ApiError("User existed", ApiStatusCode.INVALID_ARGUMENT, 400);
        }

        // Step 2: Hash user password
        user = await user.hashPassword();

        // Step 4: Insert user into database
        const userRes = await this.userRepo.createUser(user);

        // TODO: Step 5: Generate 6-digit OTP
        // TODO: Step 6: Send confirmation email with OTP

        return userRes.hideSensitive();
    }

    async getUserById(userId: number): Promise<User | ApiError> {
        const user = await this.userRepo.getUserById(userId);
        if (!user) {
            throw new ApiError("User not existed", ApiStatusCode.INVALID_ARGUMENT, 400);
        }
        return user.hideSensitive();
    }

    async getAllUsers(): Promise<User[] | ApiError> {
        const users = await this.userRepo.getAllUsers();
        return users.map((user) => user.hideSensitive());
    }

    async deleteUserById(userId: number): Promise<void | ApiError> {
        await this.userRepo.deleteUserById(userId);
        return;
    }

    async updateUserById(userId: number, userReq: User): Promise<User | ApiError> {
        // Step 0: Data validation
        let user = userReq.updateInputToUser();

        // Step 1: Update user into database
        const userRes = await this.userRepo.updateUserById(userId, user);

        return userRes.hideSensitive();
    }

    async login(userReq: User): Promise<string | ApiError> {
        // Step 0: Data validation
        let user = userReq.loginInputToUser();

        // Step 1: Check if email and password are correct
        const dbUser = await this.userRepo.getUserByEmail(user.email!)
        if (!dbUser) {
            throw new ApiError("Email or password incorrect", ApiStatusCode.INVALID_ARGUMENT, 400);
        }

        user = await user.verifyPassword(dbUser)

        // Step 2: Generate user session token
        const token = await this.tokenServ.generateUserSessionToken(dbUser.id!);

        return token;
    }
}