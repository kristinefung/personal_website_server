import prisma from '../prisma/prisma_client';
import { User } from '../schemas/user.schema';
import { Dto } from '../utils/dto';
import { ApiError } from 'src/utils/apiError';

const dto = new Dto();

const sourceName = "UserRepository";

export class UserRepository {
    async createUser(user: User): Promise<User | ApiError> {
        try {
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
            return createdUser;

        }
        catch (err) {
            throw dto.dataToError(sourceName, err);
        }
    }

    async getUserByEmail(email: string): Promise<User | null | ApiError> {
        try {
            const user = await prisma.userModel.findUnique({
                where: { email, deleted: 0 },
            });
            return user;
        }
        catch (err) {
            throw dto.dataToError(sourceName, err);
        }
    }

    async getUserById(id: number): Promise<User | null | ApiError> {
        try {
            const user = await prisma.userModel.findUnique({
                where: { id, deleted: 0 },
            });
            return user;
        }
        catch (err) {
            throw dto.dataToError(sourceName, err);
        }
    }

    async getAllUsers(): Promise<User[]> {
        return await prisma.userModel.findMany({
            where: { deleted: 0 }
        });
    }
}