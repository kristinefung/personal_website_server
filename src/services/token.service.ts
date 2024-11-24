import jwt from 'jsonwebtoken';

import { UserRepository } from '../repositories/user.repository';

import { ApiError } from '../utils/err';
import { UserSessionTokenRepository } from '../repositories/user_session_token.repository';

const ustRepo = new UserSessionTokenRepository();
const secretKey = process.env.JWT_SECRET_KEY || "";

export interface ITokenService {
    generateUserSessionToken(userId: number): Promise<string | ApiError>;
}

export class TokenService implements ITokenService {
    async generateUserSessionToken(userId: number): Promise<string | ApiError> {
        // Step 1: Sign JWT
        const payload = {
            userId: userId,
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 3) // Token expires in 3 hours
        };

        const token = jwt.sign(payload, secretKey);

        // Stpe 2: Save token to db
        const dbToken = await ustRepo.createUserSessionToken(token);

        return dbToken;
    };
}