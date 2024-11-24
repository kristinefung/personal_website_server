import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { jsonResponse } from '../utils/jsonResponse';
import { User } from '../entities/user.entity';

export interface IUserController {
    createUser(req: Request, res: Response): void;
    getUserById(req: Request, res: Response): void;
    getAllUsers(req: Request, res: Response): void;
    deleteUserById(req: Request, res: Response): void;
    updateUserById(req: Request, res: Response): void;

    login(req: Request, res: Response): void;
}

export class UserController implements IUserController {
    constructor(
        private userServ: UserService
    ) { }
    async createUser(req: Request, res: Response) {
        try {
            // Step 1: Call service to handle business logic
            const userReq = new User(req.body);
            const createdUser = await this.userServ.createUser(userReq);

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
            const user = await this.userServ.getUserById(userId);

            // Step 2: return success response
            return jsonResponse(res, { user: user }, null);
        } catch (err) {
            return jsonResponse(res, {}, err);
        }
    }

    async getAllUsers(req: Request, res: Response) {
        try {
            const users = await this.userServ.getAllUsers();
            return jsonResponse(res, { users: users }, null);
        } catch (err) {
            return jsonResponse(res, {}, err);
        }
    }

    async deleteUserById(req: Request, res: Response) {
        try {
            const userId = parseInt(req.params.id);
            await this.userServ.deleteUserById(userId);
            return jsonResponse(res, {}, null);
        } catch (err) {
            return jsonResponse(res, {}, err);
        }
    }

    async updateUserById(req: Request, res: Response) {
        try {
            const userReq = new User(req.body);
            const userId = parseInt(req.params.id);
            const user = await this.userServ.updateUserById(userId, userReq);
            return jsonResponse(res, { user: user }, null);
        } catch (err) {
            return jsonResponse(res, {}, err);
        }
    }

    async login(req: Request, res: Response) {
        try {
            const userReq = new User(req.body);
            const token = await this.userServ.login(userReq);
            return jsonResponse(res, { user_session_token: token }, null);
        } catch (err) {
            return jsonResponse(res, {}, err);
        }
    }

}