import { v4 as uuidv4 } from 'uuid';
import { Request, Response } from 'express';
import { UserService } from 'src/services/user.service';
import { AuthService } from 'src/services/auth.service';
import { jsonResponse } from 'src/utils/jsonResponse';
import { User, UserRole } from '@prisma/client';
import { CreateUserRequestDto, GetUserByIdRequestDto, GetAllUsersRequestDto, DeleteUserRequestDto, UpdateUserByIdRequestDto, LoginRequestDto } from 'src/dtos/user.dto';


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
            const data = await this.userServ.createUser(userReq, 1);

            // Step 2: return success response
            return jsonResponse(req, res, traceId, data, null);
        } catch (err) {
            return jsonResponse(req, res, traceId, {}, err);
        }
    }

    async getUserById(req: Request, res: Response) {
        const traceId = uuidv4();
        try {
            const actionUserId = await this.authServ.authUser([UserRole.ADMIN], req.headers.authorization);

            // Step 1: Call service to handle business logic
            const userId = parseInt(req.params.id);
            const userReq = new GetUserByIdRequestDto({ id: userId });
            const data = await this.userServ.getUserById(userReq);

            // Step 2: return success response
            return jsonResponse(req, res, traceId, data, null);
        } catch (err) {
            return jsonResponse(req, res, traceId, {}, err);
        }
    }

    async getAllUsers(req: Request, res: Response) {
        const traceId = uuidv4();
        try {
            const actionUserId = await this.authServ.authUser([UserRole.ADMIN], req.headers.authorization);
            console.log(req.query);
            const usersReq = new GetAllUsersRequestDto({
                limit: req.query.limit ? parseInt(req.params.limit) : undefined,
                offset: req.query.offset ? parseInt(req.params.offset) : undefined,
                orderBy: {
                    field: req.query.orderBy as keyof User || undefined,
                    direction: req.query.orderDirection as 'asc' | 'desc' || undefined
                }
            });
            const data = await this.userServ.getAllUsers(usersReq);
            return jsonResponse(req, res, traceId, data, null);
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
            const data = await this.userServ.updateUserById(updateUserReq, actionUserId);
            return jsonResponse(req, res, traceId, data, null);
        } catch (err) {
            return jsonResponse(req, res, traceId, {}, err);
        }
    }

    async login(req: Request, res: Response) {
        const traceId = uuidv4();
        try {
            const loginReq = new LoginRequestDto({
                ...req.body,
                ipAddress: req.ip,
                userAgent: req.get('user-agent')
            });
            const data = await this.userServ.login(loginReq);
            return jsonResponse(req, res, traceId, data, null);
        } catch (err) {
            return jsonResponse(req, res, traceId, {}, err);
        }
    }
}