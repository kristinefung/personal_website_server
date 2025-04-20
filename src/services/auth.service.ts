import jwt from 'jsonwebtoken';
import { ApiStatusCode } from '../utils/enum';
import { UserRole } from '@prisma/client';
import { ApiError } from '../utils/err';
import { UserLoginLogRepository } from '../repositories/user_login_log.repository';
import { UserRepository } from '../repositories/user.repository';

import { UserLoginLog } from '@prisma/client';

import bcrypt from 'bcrypt';

const secretKey = process.env.JWT_SECRET_KEY || "";

type Payload = {
    userId: number,
    exp: number,
}

export interface IAuthService {
    authUser(requiredRoleIds: UserRole[], authHeader: string | undefined): Promise<number>;
    generateUserSessionToken(userId: number): Promise<string>;
}

export class AuthService implements IAuthService {
    constructor(
        private ustRepo: UserLoginLogRepository,
        private userRepo: UserRepository
    ) { }

    async authUser(requiredRoleIds: UserRole[], authHeader: string | undefined): Promise<number> {
        const err = new ApiError("User has no permission", ApiStatusCode.UNAUTHORIZED, 401);

        // Step 1: Check is valid bear token
        if (typeof authHeader !== 'string') {
            console.error(`No token provided.`);
            throw err;
        }

        const tokenType = authHeader.split(' ')[0];
        if (tokenType !== 'Bearer') {
            console.error(`Not a valid bearer token: ${authHeader}`);
            throw err;
        }

        const bearerToken = authHeader.split(' ')[1];

        // Step 2: Check token is in database
        const dbToken = await this.ustRepo.getUserLoginLogBySessionToken(bearerToken);
        if (!dbToken) {
            console.error(`No session token record in db. Received: ${dbToken}`);
            throw err;
        }

        // Step 3: Extract token payload data
        const payload = jwt.verify(bearerToken, secretKey) as Payload;

        const user = await this.userRepo.getUserById(payload.userId);
        if (!user?.roleId) {
            console.error(`No user roleId found. UserId: ${payload.userId}, Received: ${JSON.stringify(user)}`);
            throw err;
        }

        // Step 4: Check user role has permission
        if (requiredRoleIds.length > 0 && !requiredRoleIds.includes(user.roleId)) {
            console.error(`User role has no permission. Expected: ${requiredRoleIds}, Received: ${user.roleId}`);
            throw err;
        }

        return user.id;
    }

    async generateUserSessionToken(userId: number): Promise<string> {
        // Step 1: Sign JWT
        const payload: Payload = {
            userId: userId,
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 3) // Token expires in 3 hours
        };

        const token = jwt.sign(payload, secretKey);

        // Stpe 2: Save token to db
        const userLoginLog: Partial<UserLoginLog> = {
            userId: userId,
            sessionToken: token
        }
        const dbUserLoginLog = await this.ustRepo.createUserLoginLog(userLoginLog);

        return token;
    };

    async hashPassword(plainPassword: string, salt: string): Promise<string> {
        const passwordWithSalt = plainPassword + salt;
        const hashedPassword = await bcrypt.hash(passwordWithSalt, 10);

        return hashedPassword;
    }

    async verifyPassword(plainPassword: string, salt: string, hashedPassword: string): Promise<boolean> {
        const data = plainPassword + salt;
        const correct = await bcrypt.compare(data, hashedPassword)

        return correct
    }
}