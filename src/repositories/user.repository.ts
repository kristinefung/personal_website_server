import { PrismaClient, User } from '@prisma/client';

export type UserQueryParams = {
    offset?: number;
    limit?: number;
    orderBy?: keyof User;
    orderDirection?: 'asc' | 'desc';
}

export interface IUserRepository {
    createUser(user: Partial<User>): Promise<number>;
    getAllUsers(params?: UserQueryParams): Promise<{ users: User[], total: number }>;
    getUserByEmail(email: string): Promise<User | null>;
    getUserById(id: number): Promise<User | null>;
    deleteUserById(id: number): Promise<void>;
    updateUserById(id: number, user: Partial<User>): Promise<User>;
}

export class UserRepository implements IUserRepository {
    constructor(
        private prismaClient: PrismaClient
    ) { }

    async createUser(user: Partial<User>): Promise<number> {
        const createdUser = await this.prismaClient.user.create({
            data: {
                email: user.email!,
                name: user.name!,
                hashedPassword: user.hashedPassword!,
                passwordSalt: user.passwordSalt!,
                roleId: user.roleId!,
                statusId: user.statusId!,
                createdAt: new Date(),
                createdBy: user.createdBy!,
                deleted: user.deleted!,
            },
        });

        return createdUser.id;
    }

    async getAllUsers(params?: UserQueryParams): Promise<{ users: User[], total: number }> {
        const where = {
            deleted: 0
        };

        const users = await this.prismaClient.user.findMany({
            where: where,
            skip: params?.offset,
            take: params?.limit,
            orderBy: params?.orderBy ? {
                [params.orderBy]: params.orderDirection || 'asc'
            } : undefined,
        });

        const total = await this.prismaClient.user.count({
            where: where,
        });

        return {
            users: users,
            total: total,
        };
    }

    async getUserByEmail(email: string): Promise<User | null> {
        const user = await this.prismaClient.user.findUnique({
            where: {
                email,
                deleted: 0
            },
        });

        return user;
    }

    async getUserById(id: number): Promise<User | null> {
        const user = await this.prismaClient.user.findUnique({
            where: {
                id: id,
                deleted: 0
            },
        });
        return user;
    }

    async deleteUserById(id: number): Promise<void> {
        const user = await this.prismaClient.user.update({
            where: {
                id: id,
                deleted: 0
            },
            data: {
                deleted: 1
            },
        });
        return;
    }

    async updateUserById(id: number, user: Partial<User>): Promise<User> {
        const updatedUser = await this.prismaClient.user.update({
            where: {
                id: id,
                deleted: 0,
            },
            data: {
                email: user.email,
                name: user.name,
                hashedPassword: user.hashedPassword,
                passwordSalt: user.passwordSalt,
                roleId: user.roleId,
                statusId: user.statusId,
                lockedExpiredAt: user.lockedExpiredAt,
                createdAt: user.createdAt,
                createdBy: user.createdBy,
                updatedAt: new Date(),
                updatedBy: user.updatedBy,
            },
        });

        return updatedUser;
    }
}