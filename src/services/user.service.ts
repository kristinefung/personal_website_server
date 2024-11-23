import { UserRepository } from '../repositories/user.repository';
import { User } from '../schemas/user.schema';

import { Dto } from '../utils/dto';
import { ApiError } from 'src/utils/apiError';

const sourceName = "UserService";

const userRepository = new UserRepository();
const dto = new Dto();

export class UserService {
    async createUser(user: User): Promise<User | ApiError> {
        try {
            const createdUser = await userRepository.createUser(user);
            return createdUser;
        }
        catch (err: any) {
            throw dto.dataToError(sourceName, err);
        }
    }

    async getUserById(id: number): Promise<User | null> {
        return await userRepository.getUserById(id);
    }

    async getAllUsers(): Promise<User[]> {
        return await userRepository.getAllUsers();
    }
}