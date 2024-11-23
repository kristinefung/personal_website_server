import prisma from '../prisma/prisma_client';
import { User } from '../schemas/user.schema';

export class UserRepository {
    async createUser(user: User): Promise<User> {
        const createdUser = await prisma.userModel.create({
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
        const user = await prisma.userModel.findUnique({
            where: { email, deleted: 0 },
        });

        return user ? new User(user) : null;
    }

    async getUserById(id: number): Promise<User | null> {
        const user = await prisma.userModel.findUnique({
            where: { id, deleted: 0 },
        });
        return user ? new User(user) : null;
    }


    async getAllUsers(): Promise<User[]> {
        const users = await prisma.userModel.findMany({
            where: { deleted: 0 }
        });
        return users.map(user => new User(user));;
    }
}