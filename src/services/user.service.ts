import { UserRepository } from '../repositories/user.repository';
import { User } from '../schemas/user.schema';

const className = 'UserService';
const userRepository = new UserRepository();

export class UserService {
    async createUser(user: User): Promise<User | Error> {
        try {
            return await userRepository.createUser(user);
        }
        catch (err: unknown) {
            if (err instanceof Error) {
                throw new Error(`[${className}] User creation failed: ${err.message}`);
            }
            throw new Error(`[${className}] User creation failed: An unknown error occurred`);
        }
    }

    async getUserById(id: number): Promise<User | null> {
        return await userRepository.getUserById(id);
    }

    async getAllUsers(): Promise<User[]> {
        return await userRepository.getAllUsers();
    }
}