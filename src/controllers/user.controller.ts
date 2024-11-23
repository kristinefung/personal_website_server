import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { validateCreateUser, User } from '../schemas/user.schema';
import { Dto } from '../utils/dto';
import { ApiError } from '../utils/apiError';

const userService = new UserService();
const dto = new Dto();

export class UserController {
    async createUser(req: Request, res: Response) {
        try {
            console.log(req.body)
            // Step 1: Validate request and convert type
            const validateResult = validateCreateUser(req.body);
            if (!validateResult.success) {
                res.status(500).json(dto.dataToResp(10, validateResult.errors?.[0] ?? "", {}));
                return;
            }
            const user = validateResult.data!;

            // Step 2: Call service to handle business logic
            const createdUser = await userService.createUser(user);

            // Step 3: return success response
            res.status(200).json(dto.dataToResp(0, "Success", { user: createdUser }));
            return;
        } catch (err) {
            if (err instanceof ApiError) {
                res.status(500).json(dto.dataToResp(err.status, err.message, {}));
                return;
            }
            else {
                res.status(500).json(dto.dataToResp(-1, "Unknown error", {}));
                return;
            }
        }
    }

    async getUserById(req: Request, res: Response) {
        const userId = parseInt(req.params.id);
        const user = await userService.getUserById(userId);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    }

    async getAllUsers(req: Request, res: Response) {
        const users = await userService.getAllUsers();
        res.json(users);
    }
}