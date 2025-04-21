import { UserService } from 'src/services/user.service';
import { UserRepository } from 'src/repositories/user.repository';
import { AuthService } from 'src/services/auth.service';
import { UserLoginLogRepository } from 'src/repositories/user_login_log.repository';
import { CreateUserRequestDto } from 'src/dtos/user.dto';
import { UserRole, UserStatus } from '@prisma/client';
import { ApiError } from 'src/utils/err';
import { ApiStatusCode } from 'src/utils/enum';

// Mock the dependencies
jest.mock('../../repositories/user.repository');
jest.mock('../../services/auth.service');
jest.mock('../../repositories/user_login_log.repository');

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
}); 