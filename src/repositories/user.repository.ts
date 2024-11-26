import { PrismaClient } from '@prisma/client';
import { User } from '../entities/user.entity';

export interface IUserRepository {
    createUser(user: User): Promise<User>;
    getUserByEmail(email: string): Promise<User | null>;
    getUserById(id: number): Promise<User | null>;
    getAllUsers(): Promise<User[]>;
    deleteUserById(id: number): Promise<void>;
    updateUserById(id: number, user: User): Promise<User>;
}

export class UserRepository implements IUserRepository {
    constructor(
        private prismaClient: PrismaClient
    ) { }

    async createUser(user: User): Promise<User> {
        const createdUser = await this.prismaClient.user.create({
            data: {
                email: user.email ?? "",
                name: user.name ?? "",
                hashedPassword: user.hashedPassword ?? "",
                passwordSalt: user.passwordSalt ?? "",
                roleId: user.roleId ?? -1,
                statusId: user.statusId ?? -1,
                createdAt: user.createdAt ?? new Date(),
                createdBy: user.createdBy ?? -1,
                updatedAt: user.updatedAt ?? new Date(),
                updatedBy: user.updatedBy ?? -1,
                deleted: user.deleted ?? 0,
            },
        });

        return new User(createdUser);
    }

    async getUserByEmail(email: string): Promise<User | null> {
        const user = await this.prismaClient.user.findUnique({
            where: {
                email,
                deleted: 0
            },
        });

        return user ? new User(user) : null;
    }

    async getUserById(id: number): Promise<User | null> {
        const user = await this.prismaClient.user.findUnique({
            where: {
                id: id,
                deleted: 0
            },
        });
        return user ? new User(user) : null;
    }

    async getAllUsers(): Promise<User[]> {
        const users = await this.prismaClient.user.findMany({
            where: {
                deleted: 0
            },
        });
        return users.map(user => new User(user));
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

    async updateUserById(id: number, user: User): Promise<User> {
        const updatedUser = await this.prismaClient.user.update({
            where: {
                id: id,
                deleted: 0,
            },
            data: {
                email: user.email ?? undefined,
                name: user.name ?? undefined,
                hashedPassword: user.hashedPassword ?? undefined,
                passwordSalt: undefined,
                roleId: user.roleId ?? undefined,
                statusId: user.statusId ?? undefined,
                createdAt: undefined,
                createdBy: undefined,
                updatedAt: new Date(),
                updatedBy: user.updatedBy ?? undefined,
                deleted: undefined,
            },
        });

        return new User(updatedUser);
    }
}