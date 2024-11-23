import { Request, Response } from 'express';

import { UserService } from '../services/user.service';
import { jsonResponse } from '../utils/jsonResponse';

const userService = new UserService();

export class UserController {
    async createUser(req: Request, res: Response) {
        try {
            // Step 1: Call service to handle business logic
            const createdUser = await userService.createUser(req.body);

            // Step 2: return success response
            return jsonResponse(res, { user: createdUser }, null);
        } catch (err) {
            return jsonResponse(res, {}, err);
        }
    }

    async getUserById(req: Request, res: Response) {
        try {
            // Step 1: Call service to handle business logic
            const user = await userService.getUserById(req.params);

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
            const user = await userService.deleteUserById(req.params);
            return jsonResponse(res, {}, null);
        } catch (err) {
            return jsonResponse(res, {}, err);
        }
    }

    async updateUserById(req: Request, res: Response) {
        try {
            const user = await userService.updateUserById(req.params, req.body);
            return jsonResponse(res, { user: user }, null);
        } catch (err) {
            return jsonResponse(res, {}, err);
        }
    }
}