import jwt from 'jsonwebtoken';
import { UserRole, UserStatus, ApiStatusCode } from '../utils/enum';

import { ApiError } from '../utils/err';
import { UserSessionTokenRepository } from '../repositories/user_session_token.repository';
import { UserRepository } from '../repositories/user.repository';
import { string } from 'zod';

const secretKey = process.env.JWT_SECRET_KEY || "";

type Payload = {
    userId: number,
    exp: number,
}

export interface IAuthService {
    authUser(requiredRoleIds: UserRole[], authHeader: string | undefined): Promise<void>;
    generateUserSessionToken(userId: number): Promise<string>;
}

export class AuthService implements IAuthService {
    constructor(
        private ustRepo: UserSessionTokenRepository,
        private userRepo: UserRepository
    ) { }

    async authUser(requiredRoleIds: UserRole[], authHeader: string | undefined): Promise<void> {
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
        const dbToken = await this.ustRepo.getUserSessionTokenByToken(bearerToken);
        if (!dbToken) {
            console.error(`No session token record in db. Received: ${dbToken}`);
            throw err;
        }

        // Step 3: Extract token payload data
        const payload = jwt.verify(bearerToken, secretKey) as Payload;

        const user = await this.userRepo.getUserById(payload.userId);
        if (!user?.role_id) {
            console.error(`No user role_id found. UserId: ${payload.userId}, Received: ${JSON.stringify(user)}`);
            throw err;
        }

        // Step 4: Check user role has permission
        if (!requiredRoleIds.includes(user.role_id!)) {
            console.error(`User role has no permission. Expected: ${requiredRoleIds}, Received: ${user.role_id}`);
            throw err;
        }

    }

    async generateUserSessionToken(userId: number): Promise<string> {
        // Step 1: Sign JWT
        const payload: Payload = {
            userId: userId,
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 3) // Token expires in 3 hours
        };

        const token = jwt.sign(payload, secretKey);

        // Stpe 2: Save token to db
        const dbToken = await this.ustRepo.createUserSessionToken(token);

        return dbToken;
    };
}