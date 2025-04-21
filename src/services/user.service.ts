import { UserRepository } from '../repositories/user.repository';
import { AuthService } from './auth.service';
import { CreateUserRequestDto, CreateUserResponseDto, GetUserByIdRequestDto, GetUserByIdResponseDto, GetAllUsersRequestDto, GetAllUsersResponseDto, DeleteUserRequestDto, DeleteUserResponseDto, UpdateUserByIdRequestDto, UpdateUserByIdResponseDto, LoginRequestDto, LoginResponseDto } from '../dtos/user.dto';

import { ApiError } from 'src/utils/err';
import { genRandomString } from 'src/utils/common';
import { ApiStatusCode } from 'src/utils/enum';
import { hashPassword, verifyPassword, generateUserSessionToken } from 'src/utils/security';
import { UserLoginLogRepository } from '../repositories/user_login_log.repository';

export interface IUserService {
    createUser(req: CreateUserRequestDto, actionUserId: number): Promise<CreateUserResponseDto>;
    getUserById(req: GetUserByIdRequestDto): Promise<GetUserByIdResponseDto>;
    getAllUsers(req: GetAllUsersRequestDto): Promise<GetAllUsersResponseDto>;
    deleteUserById(req: DeleteUserRequestDto, actionUserId: number): Promise<DeleteUserResponseDto>;
    updateUserById(req: UpdateUserByIdRequestDto, actionUserId: number): Promise<UpdateUserByIdResponseDto>;

    login(req: LoginRequestDto): Promise<LoginResponseDto>;
}

export class UserService implements IUserService {
    constructor(
        private userRepo: UserRepository,
        private authServ: AuthService,
        private userLoginLogRepo: UserLoginLogRepository
    ) { }

    async createUser(req: CreateUserRequestDto, actionUserId: number): Promise<CreateUserResponseDto> {
        // Step 0: Data validation
        let validatedReq = req.validate();

        // Step 1: Check user email not existed in database
        const dbUser = await this.userRepo.getUserByEmail(validatedReq.email)
        if (dbUser) {
            throw new ApiError("User existed", ApiStatusCode.INVALID_ARGUMENT, 400);
        }

        // Step 2: Hash user password
        const salt = genRandomString(20);
        const hashedPassword = await hashPassword(validatedReq.password, salt);

        // Step 4: Insert user into database
        const createdUserId = await this.userRepo.createUser({
            name: validatedReq.name,
            email: validatedReq.email,
            roleId: validatedReq.roleId,
            statusId: validatedReq.statusId,
            hashedPassword: hashedPassword,
            passwordSalt: salt,
            createdBy: actionUserId,
        });

        // TODO: Step 5: Generate 6-digit OTP
        // TODO: Step 6: Send confirmation email with OTP

        return new CreateUserResponseDto({
            id: createdUserId,
        });
    }

    async getUserById(req: GetUserByIdRequestDto): Promise<GetUserByIdResponseDto> {
        // Step 0: Data validation
        let validatedReq = req.validate();

        // Step 1: Get user from database
        const user = await this.userRepo.getUserById(validatedReq.id);
        if (!user) {
            throw new ApiError("User not existed", ApiStatusCode.INVALID_ARGUMENT, 400);
        }

        return new GetUserByIdResponseDto({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                roleId: user.roleId,
                statusId: user.statusId,
            }
        });
    }

    async getAllUsers(req: GetAllUsersRequestDto): Promise<GetAllUsersResponseDto> {
        // Step 0: Data validation
        let validatedReq = req.validate();

        // Step 1: Get all users from database
        const dbRes = await this.userRepo.getAllUsers({
            offset: validatedReq.offset,
            limit: validatedReq.limit,
            orderBy: validatedReq.orderBy ? validatedReq.orderBy.field : undefined,
            orderDirection: validatedReq.orderBy?.direction,
        });

        return new GetAllUsersResponseDto({
            users: dbRes.users.map((user) => ({
                id: user.id,
                name: user.name,
                email: user.email,
                roleId: user.roleId,
                statusId: user.statusId,
            })),
            total: dbRes.total,
        });
    }

    async deleteUserById(req: DeleteUserRequestDto, actionUserId: number): Promise<DeleteUserResponseDto> {
        // Step 0: Data validation
        let validatedReq = req.validate();

        // Step 1: Delete user from database
        await this.userRepo.deleteUserById(validatedReq.id);

        return new DeleteUserResponseDto({
            id: validatedReq.id,
        });
    }

    async updateUserById(req: UpdateUserByIdRequestDto, actionUserId: number): Promise<UpdateUserByIdResponseDto> {
        // Step 0: Data validation
        let validatedReq = req.validate();

        // Step 1: Update user into database
        const userRes = await this.userRepo.updateUserById(
            validatedReq.id,
            { ...validatedReq.user, updatedBy: actionUserId });

        return new UpdateUserByIdResponseDto({});
    }

    async login(req: LoginRequestDto): Promise<LoginResponseDto> {
        // Step 0: Data validation
        let validatedReq = req.validate();

        // Step 1: Check if email and password are correct
        const dbUser = await this.userRepo.getUserByEmail(validatedReq.email)
        if (!dbUser) {
            throw new ApiError("Email or password incorrect", ApiStatusCode.INVALID_ARGUMENT, 400);
        }

        // Step 2: Check if user has too many login attempts
        const topUserLoginLog = await this.userLoginLogRepo.findTopUserLoginLogByUserId(dbUser.id);
        if (topUserLoginLog) {
            if (topUserLoginLog.failAttempts === 5 && topUserLoginLog.createdAt.getTime() < Date.now() - 1000 * 60 * 60 * 12) {
                await this.userLoginLogRepo.createUserLoginLog({
                    userId: dbUser.id,
                    ipAddress: validatedReq.ipAddress,
                    userAgent: validatedReq.userAgent,
                    failAttempts: topUserLoginLog.failAttempts,
                    createdBy: 0,
                });
                throw new ApiError("Too many login attempts. Account has been locked for 12 hours", ApiStatusCode.INVALID_ARGUMENT, 400);
            }
        }

        // Step 3: Verify password
        const correct = await verifyPassword(validatedReq.password, dbUser.passwordSalt, dbUser.hashedPassword)
        if (!correct) {
            await this.userLoginLogRepo.createUserLoginLog({
                userId: dbUser.id,
                ipAddress: validatedReq.ipAddress,
                userAgent: validatedReq.userAgent,
                failAttempts: topUserLoginLog ? topUserLoginLog.failAttempts + 1 : 1,
                createdBy: 0,
            });
            throw new ApiError("Email or password incorrect", ApiStatusCode.INVALID_ARGUMENT, 400);
        }

        // Step 4: Generate user session token
        const token = await generateUserSessionToken(dbUser.id);
        const dbUserLoginLog = await this.userLoginLogRepo.createUserLoginLog({
            userId: dbUser.id,
            ipAddress: validatedReq.ipAddress,
            userAgent: validatedReq.userAgent,
            failAttempts: 0,
            sessionToken: token
        });

        return new LoginResponseDto({
            token: token,
        });
    }
}