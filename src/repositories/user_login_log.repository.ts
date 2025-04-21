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
                failAttempts: log.failAttempts ?? 0,
                createdAt: new Date(),
                createdBy: log.createdBy ?? 0,
            },
        });

        return createdUserLoginLog;
    }

    async updateUserLoginLogBySessionToken(log: UserLoginLog, sessionToken: string): Promise<UserLoginLog> {
        const updatedUserLoginLog = await this.prismaClient.userLoginLog.update({
            where: {
                sessionToken: sessionToken,
                deleted: false
            },
            data: {
                userId: log.userId,
                ipAddress: log.ipAddress,
                userAgent: log.userAgent,
                sessionToken: log.sessionToken,
                loginAt: log.loginAt,
                logoutAt: log.logoutAt,
                failAttempts: log.failAttempts,
                createdAt: log.createdAt,
                createdBy: log.createdBy,
                updatedAt: log.updatedAt,
                updatedBy: log.updatedBy,
                deleted: log.deleted,
            },
        });

        return updatedUserLoginLog;
    }

    async getUserLoginLogBySessionToken(sessionToken: string): Promise<UserLoginLog | null> {
        const userLoginLog = await this.prismaClient.userLoginLog.findUnique({
            where: {
                sessionToken: sessionToken,
                deleted: false
            },
        });

        return userLoginLog;
    }

    async findTopUserLoginLogByUserId(userId: number): Promise<UserLoginLog | null> {
        const userLoginLog = await this.prismaClient.userLoginLog.findFirst({
            where: {
                userId: userId,
                deleted: false
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
                deleted: false
            },
            data: {
                deleted: true
            },
        });
        return;
    }
}