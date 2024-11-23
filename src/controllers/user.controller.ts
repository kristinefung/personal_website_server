import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { userSchema, User } from '../schemas/user.schema';

const userService = new UserService();

export class UserController {
    async createUser(req: Request, res: Response) {
        try {
            console.log(req.body)
            const user: User = userSchema.parse(req.body);
            console.log(user);

            const createdUser = await userService.createUser(user);
            res.status(200).json(user);
        } catch (err) {
            if (err instanceof Error) {
                console.log(err.message);
                res.status(500).json({ error: `User creation failed: ${err.message}` });
            }
            else {
                res.status(500).json({ error: 'User creation failed' });
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