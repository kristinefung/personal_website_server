import { Request, Response } from 'express';

import { UserService } from '../services/user.service';
import { jsonResponse } from '../utils/jsonResponse';
import { User } from '../entities/user.entity';

const userService = new UserService();

export class UserController {
    async createUser(req: Request, res: Response) {
        try {
            // Step 1: Call service to handle business logic
            const userReq = new User(req.body);
            const createdUser = await userService.createUser(userReq);

            // Step 2: return success response
            return jsonResponse(res, { user: createdUser }, null);
        } catch (err) {
            return jsonResponse(res, {}, err);
        }
    }

    async getUserById(req: Request, res: Response) {
        try {
            // Step 1: Call service to handle business logic
            const userId = parseInt(req.params.id);
            const user = await userService.getUserById(userId);

            // Step 2: return success response
            return jsonResponse(res, { user: user }, null);
        } catch (err) {
            return jsonResponse(res, {}, err);
        }
    }

    async getAllUsers(req: Request, res: Response) {
        try {
            const users = await userService.getAllUsers();
            return jsonResponse(res, { users: users }, null);
        } catch (err) {
            return jsonResponse(res, {}, err);
        }
    }

    async deleteUserById(req: Request, res: Response) {
        try {
            const userId = parseInt(req.params.id);
            const user = await userService.deleteUserById(userId);
            return jsonResponse(res, {}, null);
        } catch (err) {
            return jsonResponse(res, {}, err);
        }
    }

    async updateUserById(req: Request, res: Response) {
        try {
            const userReq = new User(req.body);
            const userId = parseInt(req.params.id);
            const user = await userService.updateUserById(userId, userReq);
            return jsonResponse(res, { user: user }, null);
        } catch (err) {
            return jsonResponse(res, {}, err);
        }
    }

}