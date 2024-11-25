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
        const createdUser = await this.prismaClient.userModel.create({
            data: {
                email: user.email ?? "",
                name: user.name ?? "",
                password: user.password ?? "",
                password_salt: user.password_salt ?? "",
                role_id: user.role_id ?? -1,
                status_id: user.status_id ?? -1,
                created_at: user.created_at ?? new Date(),
                created_by: user.created_by ?? -1,
                updated_at: user.updated_at ?? new Date(),
                updated_by: user.updated_by ?? -1,
                deleted: user.deleted ?? 0,
            },
        });

        return new User(createdUser);
    }

    async getUserByEmail(email: string): Promise<User | null> {
        const user = await this.prismaClient.userModel.findUnique({
            where: {
                email,
                deleted: 0
            },
        });

        return user ? new User(user) : null;
    }

    async getUserById(id: number): Promise<User | null> {
        const user = await this.prismaClient.userModel.findUnique({
            where: {
                id: id,
                deleted: 0
            },
        });
        return user ? new User(user) : null;
    }

    async getAllUsers(): Promise<User[]> {
        const users = await this.prismaClient.userModel.findMany({
            where: {
                deleted: 0
            },
        });
        return users.map(user => new User(user));
    }

    async deleteUserById(id: number): Promise<void> {
        const user = await this.prismaClient.userModel.update({
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
        const updatedUser = await this.prismaClient.userModel.update({
            where: {
                id: id,
                deleted: 0,
            },
            data: {
                email: user.email ?? undefined,
                name: user.name ?? undefined,
                password: user.password ?? undefined,
                password_salt: undefined,
                role_id: user.role_id ?? undefined,
                status_id: user.status_id ?? undefined,
                created_at: undefined,
                created_by: undefined,
                updated_at: new Date(),
                updated_by: user.updated_by ?? undefined,
                deleted: undefined,
            },
        });

        return new User(updatedUser);
    }
}