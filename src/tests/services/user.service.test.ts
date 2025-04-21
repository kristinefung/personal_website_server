import { UserService } from 'src/services/user.service';
import { UserRepository } from 'src/repositories/user.repository';
import { AuthService } from 'src/services/auth.service';
import { UserLoginLogRepository } from 'src/repositories/user_login_log.repository';
import { CreateUserRequestDto, GetUserByIdRequestDto, GetAllUsersRequestDto, DeleteUserRequestDto, UpdateUserByIdRequestDto, LoginRequestDto } from 'src/dtos/user.dto';
import { UserRole, UserStatus } from '@prisma/client';
import { ApiError } from 'src/utils/err';
import { ApiStatusCode } from 'src/utils/enum';

// Mock the dependencies
jest.mock('src/repositories/user.repository');
jest.mock('src/services/auth.service');
jest.mock('src/repositories/user_login_log.repository');

describe('UserService', () => {
    let userService: UserService;
    let mockUserRepo: jest.Mocked<UserRepository>;
    let mockAuthService: jest.Mocked<AuthService>;
    let mockUserLoginLogRepo: jest.Mocked<UserLoginLogRepository>;

    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();

        // Create mock instances
        mockUserRepo = new UserRepository({} as any) as jest.Mocked<UserRepository>;
        mockUserLoginLogRepo = new UserLoginLogRepository({} as any) as jest.Mocked<UserLoginLogRepository>;
        mockAuthService = new AuthService(mockUserLoginLogRepo, mockUserRepo) as jest.Mocked<AuthService>;

        // Initialize the service with mocked dependencies
        userService = new UserService(mockUserRepo, mockAuthService, mockUserLoginLogRepo);
    });

    describe('createUser', () => {
        it('should successfully create a new user', async () => {
            // Arrange
            const mockUserData = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'Test123!',
                roleId: UserRole.ADMIN,
                statusId: UserStatus.ACTIVE
            };
            const mockActionUserId = 1;
            const mockCreatedUserId = 123;

            // Mock the repository methods
            mockUserRepo.getUserByEmail.mockResolvedValue(null);
            mockUserRepo.createUser.mockResolvedValue(mockCreatedUserId);

            // Act
            const result = await userService.createUser(
                new CreateUserRequestDto(mockUserData),
                mockActionUserId
            );

            // Assert
            expect(mockUserRepo.getUserByEmail).toHaveBeenCalledWith(mockUserData.email);
            expect(mockUserRepo.createUser).toHaveBeenCalled();
            expect(result.id).toBe(mockCreatedUserId);
        });

        it('should throw an error when user email already exists', async () => {
            // Arrange
            const mockUserData = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'Test123!',
                roleId: UserRole.ADMIN,
                statusId: UserStatus.ACTIVE
            };
            const mockActionUserId = 1;
            const mockExistingUser = {
                id: 1,
                email: mockUserData.email,
                name: 'Existing User'
            };

            // Mock the repository to return an existing user
            mockUserRepo.getUserByEmail.mockResolvedValue(mockExistingUser as any);

            // Act & Assert
            await expect(userService.createUser(
                new CreateUserRequestDto(mockUserData),
                mockActionUserId
            )).rejects.toThrow(new ApiError("User existed", ApiStatusCode.INVALID_ARGUMENT, 400));
        });

        it('should throw an error when validation fails', async () => {
            // Arrange
            const invalidUserData = {
                name: '', // Invalid: empty name
                email: 'invalid-email', // Invalid email format
                password: 'weak', // Invalid: too short
                roleId: UserRole.ADMIN,
                statusId: UserStatus.ACTIVE
            };
            const mockActionUserId = 1;

            // Act & Assert
            await expect(userService.createUser(
                new CreateUserRequestDto(invalidUserData),
                mockActionUserId
            )).rejects.toThrow();
        });
    });

    describe('getUserById', () => {
        it('should successfully get a user by id', async () => {
            // Arrange
            const mockUserId = 1;
            const mockUser = {
                id: mockUserId,
                name: 'Test User',
                email: 'test@example.com',
                roleId: UserRole.ADMIN,
                statusId: UserStatus.ACTIVE
            };

            // Mock the repository method
            mockUserRepo.getUserById.mockResolvedValue(mockUser as any);

            // Act
            const result = await userService.getUserById(
                new GetUserByIdRequestDto({ id: mockUserId })
            );

            // Assert
            expect(mockUserRepo.getUserById).toHaveBeenCalledWith(mockUserId);
            expect(result.user?.id).toBe(mockUserId);
            expect(result.user?.name).toBe(mockUser.name);
            expect(result.user?.email).toBe(mockUser.email);
        });

        it('should throw an error when user not found', async () => {
            // Arrange
            const mockUserId = 1;

            // Mock the repository to return null
            mockUserRepo.getUserById.mockResolvedValue(null);

            // Act & Assert
            await expect(userService.getUserById(
                new GetUserByIdRequestDto({ id: mockUserId })
            )).rejects.toThrow(new ApiError("User not found", ApiStatusCode.INVALID_ARGUMENT, 400));
        });
    });

    describe('getAllUsers', () => {
        it('should successfully get all users', async () => {
            // Arrange
            const mockUsers = [
                {
                    id: 1,
                    name: 'User 1',
                    email: 'user1@example.com',
                    roleId: UserRole.ADMIN,
                    statusId: UserStatus.ACTIVE,
                    createdAt: new Date(),
                    createdBy: 1,
                    updatedAt: null,
                    updatedBy: null,
                    deleted: null,
                    hashedPassword: 'hashed1',
                    passwordSalt: 'salt1'
                },
                {
                    id: 2,
                    name: 'User 2',
                    email: 'user2@example.com',
                    roleId: UserRole.USER,
                    statusId: UserStatus.ACTIVE,
                    createdAt: new Date(),
                    createdBy: 1,
                    updatedAt: null,
                    updatedBy: null,
                    deleted: null,
                    hashedPassword: 'hashed2',
                    passwordSalt: 'salt2'
                }
            ];
            const mockTotal = 2;

            // Mock the repository method
            mockUserRepo.getAllUsers.mockResolvedValue({ users: mockUsers, total: mockTotal });

            // Act
            const result = await userService.getAllUsers(
                new GetAllUsersRequestDto({})
            );

            // Assert
            expect(mockUserRepo.getAllUsers).toHaveBeenCalled();
            expect(result.users?.length).toBe(mockTotal);
            expect(result.users?.[0].id).toBe(mockUsers[0].id);
            expect(result.users?.[1].id).toBe(mockUsers[1].id);
        });

        it('should handle empty user list', async () => {
            // Arrange
            const mockEmptyUsers = { users: [], total: 0 };

            // Mock the repository method
            mockUserRepo.getAllUsers.mockResolvedValue(mockEmptyUsers);

            // Act
            const result = await userService.getAllUsers(
                new GetAllUsersRequestDto({})
            );

            // Assert
            expect(mockUserRepo.getAllUsers).toHaveBeenCalled();
            expect(result.users?.length).toBe(0);
            expect(result.total).toBe(0);
        });
    });

    describe('deleteUserById', () => {
        it('should successfully delete a user', async () => {
            // Arrange
            const mockUserId = 1;
            const mockActionUserId = 2;

            // Mock the repository method
            mockUserRepo.deleteUserById.mockResolvedValue();

            // Act
            await userService.deleteUserById(
                new DeleteUserRequestDto({ id: mockUserId }),
                mockActionUserId
            );

            // Assert
            expect(mockUserRepo.deleteUserById).toHaveBeenCalledWith(mockUserId);
        });

        it('should throw an error when user not found', async () => {
            // Arrange
            const mockUserId = 1;
            const mockActionUserId = 2;

            // Mock the repository to throw an error
            mockUserRepo.deleteUserById.mockRejectedValue(new Error('User not found'));

            // Act & Assert
            await expect(userService.deleteUserById(
                new DeleteUserRequestDto({ id: mockUserId }),
                mockActionUserId
            )).rejects.toThrow();
        });
    });

    describe('updateUserById', () => {
        it('should successfully update a user', async () => {
            // Arrange
            const mockUserId = 1;
            const mockActionUserId = 2;
            const mockUpdateData = {
                id: mockUserId,
                name: 'Updated Name',
                email: 'updated@example.com',
                hashedPassword: 'hashed_password',
                passwordSalt: 'salt',
                roleId: UserRole.ADMIN,
                statusId: UserStatus.ACTIVE,
                createdAt: new Date(),
                createdBy: 1,
                updatedAt: new Date(),
                updatedBy: mockActionUserId,
                deleted: null
            };
            const mockUpdatedUser = {
                id: mockUserId,
                name: mockUpdateData.name,
                email: mockUpdateData.email,
                hashedPassword: mockUpdateData.hashedPassword,
                passwordSalt: mockUpdateData.passwordSalt,
                roleId: mockUpdateData.roleId,
                statusId: mockUpdateData.statusId,
                createdAt: mockUpdateData.createdAt,
                createdBy: mockUpdateData.createdBy,
                updatedAt: mockUpdateData.updatedAt,
                updatedBy: mockUpdateData.updatedBy,
                deleted: mockUpdateData.deleted
            };

            // Mock the repository method
            mockUserRepo.updateUserById.mockResolvedValue(mockUpdatedUser as any);

            // Act
            await userService.updateUserById(
                new UpdateUserByIdRequestDto({ id: mockUserId, user: mockUpdateData }),
                mockActionUserId
            );

            // Assert
            expect(mockUserRepo.updateUserById).toHaveBeenCalledWith(
                mockUserId,
                { ...mockUpdateData, updatedBy: mockActionUserId }
            );
        });

        it('should throw an error when user not found', async () => {
            // Arrange
            const mockUserId = 1;
            const mockActionUserId = 2;
            const mockUpdateData = {
                id: mockUserId,
                name: 'Updated Name',
                email: 'test@example.com',
                hashedPassword: 'hashed_password',
                passwordSalt: 'salt',
                roleId: UserRole.ADMIN,
                statusId: UserStatus.ACTIVE,
                createdAt: new Date(),
                createdBy: 1,
                updatedAt: new Date(),
                updatedBy: mockActionUserId,
                deleted: null
            };
            const mockUpdatedUser = {
                id: mockUserId,
                name: mockUpdateData.name,
                email: mockUpdateData.email,
                hashedPassword: mockUpdateData.hashedPassword,
                passwordSalt: mockUpdateData.passwordSalt,
                roleId: mockUpdateData.roleId,
                statusId: mockUpdateData.statusId,
                createdAt: mockUpdateData.createdAt,
                createdBy: mockUpdateData.createdBy,
                updatedAt: mockUpdateData.updatedAt,
                updatedBy: mockUpdateData.updatedBy,
                deleted: mockUpdateData.deleted
            };

            // Mock the repository to throw an error
            mockUserRepo.updateUserById.mockRejectedValue(new Error('User not found'));

            // Act & Assert
            await expect(userService.updateUserById(
                new UpdateUserByIdRequestDto({ id: mockUserId, user: mockUpdateData }),
                mockActionUserId
            )).rejects.toThrow();
        });
    });

    describe('login', () => {
        it('should successfully login a user', async () => {
            // Arrange
            const mockLoginData = {
                email: 'test@example.com',
                password: 'Test123!',
                ipAddress: '127.0.0.1',
                userAgent: 'test-agent'
            };
            const mockUser = {
                id: 1,
                email: mockLoginData.email,
                hashedPassword: 'hashed_password',
                passwordSalt: 'salt',
                roleId: UserRole.ADMIN,
                statusId: UserStatus.ACTIVE
            };
            const mockToken = 'mock_token';

            // Mock the repository methods
            mockUserRepo.getUserByEmail.mockResolvedValue(mockUser as any);
            mockUserLoginLogRepo.findTopUserLoginLogByUserId.mockResolvedValue(null);
            mockUserLoginLogRepo.createUserLoginLog.mockResolvedValue({} as any);

            // Mock the security functions
            jest.spyOn(require('src/utils/security'), 'verifyPassword').mockResolvedValue(true);
            jest.spyOn(require('src/utils/security'), 'generateUserSessionToken').mockResolvedValue(mockToken);

            // Act
            const result = await userService.login(
                new LoginRequestDto(mockLoginData)
            );

            // Assert
            expect(mockUserRepo.getUserByEmail).toHaveBeenCalledWith(mockLoginData.email);
            expect(result.token).toBe(mockToken);
        });

        it('should throw an error when email or password is incorrect', async () => {
            // Arrange
            const mockLoginData = {
                email: 'test@example.com',
                password: 'WrongPassword',
                ipAddress: '127.0.0.1',
                userAgent: 'test-agent'
            };

            // Mock the repository to return null (user not found)
            mockUserRepo.getUserByEmail.mockResolvedValue(null);

            // Act & Assert
            await expect(userService.login(
                new LoginRequestDto(mockLoginData)
            )).rejects.toThrow(new ApiError("Email or password incorrect", ApiStatusCode.INVALID_ARGUMENT, 400));
        });

        it('should throw an error when account is locked due to too many attempts', async () => {
            // Arrange
            const mockLoginData = {
                email: 'test@example.com',
                password: 'Test123!',
                ipAddress: '127.0.0.1',
                userAgent: 'test-agent'
            };
            const mockUser = {
                id: 1,
                email: mockLoginData.email,
                hashedPassword: 'hashed_password',
                passwordSalt: 'salt',
                roleId: UserRole.ADMIN,
                statusId: UserStatus.ACTIVE
            };
            const mockLoginLog = {
                failAttempts: 5,
                createdAt: new Date(Date.now() - 1000 * 60 * 60 * 11) // 11 hours ago
            };

            // Mock the repository methods
            mockUserRepo.getUserByEmail.mockResolvedValue(mockUser as any);
            mockUserLoginLogRepo.findTopUserLoginLogByUserId.mockResolvedValue(mockLoginLog as any);

            // Act & Assert
            await expect(userService.login(
                new LoginRequestDto(mockLoginData)
            )).rejects.toThrow(new ApiError("Too many login attempts. Account has been locked for 12 hours", ApiStatusCode.INVALID_ARGUMENT, 400));
        });
    });
}); 