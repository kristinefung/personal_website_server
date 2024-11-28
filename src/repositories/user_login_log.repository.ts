import { PrismaClient, UserLoginLog } from '@prisma/client';

export interface IUserLoginLogRepository {
    createUserLoginLog(log: Partial<UserLoginLog>): Promise<UserLoginLog>;
    updateUserLoginLogBySessionToken(log: UserLoginLog, sessionToken: string): Promise<UserLoginLog>
    getUserLoginLogBySessionToken(sessionToken: string): Promise<UserLoginLog | null>;
    findTopUserLoginLogByUserId(userId: number): Promise<UserLoginLog | null>
    deleteUserLoginLogBySessionToken(sessionToken: string): Promise<void>;
}

export class UserLoginLogRepository implements IUserLoginLogRepository {
    constructor(
        private prismaClient: PrismaClient
    ) { }

    async createUserLoginLog(log: Partial<UserLoginLog>): Promise<UserLoginLog> {
        const createdUserLoginLog = await this.prismaClient.userLoginLog.create({
            data: {
                userId: log.userId ?? 0,
                ipAddress: log.ipAddress,
                userAgent: log.userAgent,
                sessionToken: log.sessionToken,
                loginAt: log.loginAt ?? new Date(),
                logoutAt: log.logoutAt,

                createdAt: log.createdAt ?? new Date(),
                createdBy: log.createdBy ?? 0,
                updatedAt: log.updatedAt ?? new Date(),
                updatedBy: log.updatedBy ?? 0,
                deleted: log.deleted ?? 0,
            },
        });

        return createdUserLoginLog;
    }

    async updateUserLoginLogBySessionToken(log: UserLoginLog, sessionToken: string): Promise<UserLoginLog> {
        const createdUserLoginLog = await this.prismaClient.userLoginLog.update({
            where: {
                sessionToken: sessionToken,
                deleted: 0
            },
            data: {
                userId: log.userId ?? undefined,
                ipAddress: log.ipAddress ?? undefined,
                userAgent: log.userAgent ?? undefined,
                sessionToken: log.sessionToken ?? undefined,
                loginAt: log.loginAt ?? undefined,
                logoutAt: log.logoutAt ?? undefined,

                createdAt: log.createdAt ?? undefined,
                createdBy: log.createdBy ?? undefined,
                updatedAt: log.updatedAt ?? undefined,
                updatedBy: log.updatedBy ?? undefined,
                deleted: log.deleted ?? undefined,
            },
        });

        return createdUserLoginLog;
    }

    async getUserLoginLogBySessionToken(sessionToken: string): Promise<UserLoginLog | null> {
        const userLoginLog = await this.prismaClient.userLoginLog.findUnique({
            where: {
                sessionToken: sessionToken,
                deleted: 0
            },
        });

        return userLoginLog;
    }

    async findTopUserLoginLogByUserId(userId: number): Promise<UserLoginLog | null> {
        const userLoginLog = await this.prismaClient.userLoginLog.findFirst({
            where: {
                userId: userId,
                deleted: 0
            },
            orderBy: {
                createdAt: 'desc',
            },
        })

        return userLoginLog;
    }

    async deleteUserLoginLogBySessionToken(sessionToken: string): Promise<void> {
        const dbData = await this.prismaClient.userLoginLog.update({
            where: {
                sessionToken: sessionToken,
                deleted: 0
            },
            data: {
                deleted: 1
            },
        });
        return;
    }
}