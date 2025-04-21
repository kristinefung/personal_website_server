import { v4 as uuidv4 } from 'uuid';
import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { jsonResponse } from '../utils/jsonResponse';
import { UserRole } from '@prisma/client';
import { CreateUserRequestDto, GetUserByIdRequestDto, GetAllUsersRequestDto, DeleteUserRequestDto, UpdateUserByIdRequestDto, LoginRequestDto } from '../dtos/user.dto';


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
        private userServ: UserService,
        private authServ: AuthService
    ) { }
    async createUser(req: Request, res: Response) {
        const traceId = uuidv4();
        try {
            const actionUserId = await this.authServ.authUser([UserRole.ADMIN], req.headers.authorization);

            // Step 1: Call service to handle business logic
            const userReq = new CreateUserRequestDto(req.body);
            const createdUser = await this.userServ.createUser(userReq, actionUserId);

            // Step 2: return success response
            return jsonResponse(req, res, traceId, { user: createdUser }, null);
        } catch (err) {
            return jsonResponse(req, res, traceId, {}, err);
        }
    }

    async getUserById(req: Request, res: Response) {
        const traceId = uuidv4();
        try {
            await this.authServ.authUser([UserRole.ADMIN], req.headers.authorization);

            // Step 1: Call service to handle business logic
            const userId = parseInt(req.params.id);
            const userReq = new GetUserByIdRequestDto({ id: userId });
            const user = await this.userServ.getUserById(userReq);

            // Step 2: return success response
            return jsonResponse(req, res, traceId, { user: user }, null);
        } catch (err) {
            return jsonResponse(req, res, traceId, {}, err);
        }
    }

    async getAllUsers(req: Request, res: Response) {
        const traceId = uuidv4();
        try {
            await this.authServ.authUser([UserRole.ADMIN], req.headers.authorization);

            const usersReq = new GetAllUsersRequestDto(req.body);
            const users = await this.userServ.getAllUsers(usersReq);
            return jsonResponse(req, res, traceId, { users: users }, null);
        } catch (err) {
            return jsonResponse(req, res, traceId, {}, err);
        }
    }

    async deleteUserById(req: Request, res: Response) {
        const traceId = uuidv4();
        try {
            const actionUserId = await this.authServ.authUser([UserRole.ADMIN], req.headers.authorization);

            const userId = parseInt(req.params.id);
            const deleteUserReq = new DeleteUserRequestDto({ id: userId });
            await this.userServ.deleteUserById(deleteUserReq, actionUserId);
            return jsonResponse(req, res, traceId, {}, null);
        } catch (err) {
            return jsonResponse(req, res, traceId, {}, err);
        }
    }

    async updateUserById(req: Request, res: Response) {
        const traceId = uuidv4();
        try {
            const actionUserId = await this.authServ.authUser([UserRole.ADMIN], req.headers.authorization);

            const userId = parseInt(req.params.id);
            const updateUserReq = new UpdateUserByIdRequestDto({ id: userId, user: req.body });
            const user = await this.userServ.updateUserById(updateUserReq, actionUserId);
            return jsonResponse(req, res, traceId, { user: user }, null);
        } catch (err) {
            return jsonResponse(req, res, traceId, {}, err);
        }
    }

    async login(req: Request, res: Response) {
        const traceId = uuidv4();
        try {
            const loginReq = new LoginRequestDto(req.body);
            const token = await this.userServ.login(loginReq);
            return jsonResponse(req, res, traceId, { userSessionToken: token }, null);
        } catch (err) {
            return jsonResponse(req, res, traceId, {}, err);
        }
    }
}