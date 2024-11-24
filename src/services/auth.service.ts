import jwt from 'jsonwebtoken';

import { ApiError } from '../utils/err';
import { UserSessionTokenRepository } from '../repositories/user_session_token.repository';

const secretKey = process.env.JWT_SECRET_KEY || "";

export interface IAuthService {
    generateUserSessionToken(userId: number): Promise<string | ApiError>;
}

export class AuthService implements IAuthService {
    constructor(
        private ustRepo: UserSessionTokenRepository
    ) { }
    async generateUserSessionToken(userId: number): Promise<string | ApiError> {
        // Step 1: Sign JWT
        const payload = {
            userId: userId,
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 3) // Token expires in 3 hours
        };

        const token = jwt.sign(payload, secretKey);

        // Stpe 2: Save token to db
        const dbToken = await this.ustRepo.createUserSessionToken(token);

        return dbToken;
    };
}