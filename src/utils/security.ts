import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET_KEY || "";

type Payload = {
    userId: number,
    exp: number,
}

export async function hashPassword(plainPassword: string, salt: string): Promise<string> {
    const passwordWithSalt = plainPassword + salt;
    const hashedPassword = await bcrypt.hash(passwordWithSalt, 10);

    return hashedPassword;
}

export async function verifyPassword(plainPassword: string, salt: string, hashedPassword: string): Promise<boolean> {
    const data = plainPassword + salt;
    const correct = await bcrypt.compare(data, hashedPassword)

    return correct
}

export async function generateUserSessionToken(userId: number): Promise<string> {
    // Step 1: Sign JWT
    const payload: Payload = {
        userId: userId,
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 3) // Token expires in 3 hours
    };

    const token = jwt.sign(payload, secretKey);

    return token;
};