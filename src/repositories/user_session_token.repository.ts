import prisma from './prisma/prisma_client';

export interface IUserSessionTokenRepository {
    createUserSessionToken(token: string): Promise<string>;
    getUserSessionTokenByToken(token: string): Promise<string | null>;
    deleteUserSessionTokenByToken(token: string): Promise<void>;
}

export class UserSessionTokenRepository implements IUserSessionTokenRepository {
    async createUserSessionToken(token: string): Promise<string> {
        const createdUserSessionToken = await prisma.userSessionTokenModel.create({
            data: {
                token: token,
                created_at: new Date(),
                created_by: -1,
                updated_at: new Date(),
                updated_by: -1,
                deleted: 0,
            },
        });

        return token;
    }

    async getUserSessionTokenByToken(token: string): Promise<string | null> {
        const dbData = await prisma.userSessionTokenModel.findUnique({
            where: {
                token: token,
                deleted: 0
            },
        });

        return dbData ? dbData.token : null;
    }

    async deleteUserSessionTokenByToken(token: string): Promise<void> {
        const dbData = await prisma.userSessionTokenModel.update({
            where: {
                token: token,
                deleted: 0
            },
            data: {
                deleted: 1
            },
        });
        return;
    }
}