import prisma from '../prisma/prisma_client';
import { UserModel } from '@prisma/client';
import { userSchema, User } from '../schemas/user.schema';

const className = 'UserRepository'

export class UserRepository {
    async createUser(user: User): Promise<User | Error> {
        try {
            const createdUser = await prisma.userModel.create({
                data: {
                    email: user.email,
                    name: user.name,
                    password: user.password,
                    password_salt: "",
                    role_id: 0,
                    status_id: 0,
                    created_at: new Date(),
                    created_by: 1,
                    updated_at: new Date(),
                    updated_by: 1,
                    deleted: 0,
                },
            });
            return createdUser;

        }
        catch (err: unknown) {
            if (err instanceof Error) {
                throw new Error(`[${className}] User creation failed: ${err.message}`);
            }
            throw new Error(`[${className}] User creation failed: An unknown error occurred`);
        }
    }

    async getUserById(id: number): Promise<User | null> {
        return await prisma.userModel.findUnique({
            where: { id },
        });
    }

    async getAllUsers(): Promise<User[]> {
        return await prisma.userModel.findMany();
    }
}