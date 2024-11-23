import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { Dto } from '../utils/dto';
import { ApiError } from '../utils/apiError';
import { API_STATUS_CODE } from '../utils/enum';

const userService = new UserService();
const dto = new Dto();

export class UserController {
    async createUser(req: Request, res: Response) {
        try {
            // Step 1: Call service to handle business logic
            const createdUser = await userService.createUser(req.body);

            // Step 2: return success response
            res.status(200).json(dto.dataToResp(API_STATUS_CODE.SUCCESS, "Success", { user: createdUser }));
            return;
        } catch (err) {
            if (err instanceof ApiError) {
                res.status(500).json(dto.dataToResp(err.status_code, err.message, {}));
                return;
            }
            res.status(500).json(dto.dataToResp(API_STATUS_CODE.UNKNOWN_ERROR, "Unknown error", {}));
            return;

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