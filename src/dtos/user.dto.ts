import { z, ZodError } from 'zod';
import { UserRole, UserStatus, User } from '@prisma/client';

type UserResponse = {
    id: number;
    name: string;
    email: string;
    roleId: UserRole;
    statusId: UserStatus;
}

/*************************************************************
 *                       Create User
 ************************************************************/
const CreateUserRequestSchema = z.object({
    name: z.string({ required_error: "displayName is required" })
        .min(1, "displayName is required")
        .max(50, "displayName must be less than 50 characters"),
    email: z.string({ required_error: "email is required" })
        .email("Invalid email address"),
    password: z.string({ required_error: "password is required" })
        .min(8, "password must be at least 8 characters")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "password must contain at least one uppercase letter, one lowercase letter, and one number"),
    roleId: z.nativeEnum(UserRole, { required_error: "roleId is required" }),
    statusId: z.nativeEnum(UserStatus, { required_error: "statusId is required" })
});

type CreateUserRequestType = z.infer<typeof CreateUserRequestSchema>;

export class CreateUserRequestDto {
    name?: string;
    email?: string;
    password?: string;
    roleId?: UserRole;
    statusId?: UserStatus;

    constructor(data: Partial<CreateUserRequestDto> = {}) {
        Object.assign(this, data);
    }

    validate(): CreateUserRequestType {
        const result = CreateUserRequestSchema.safeParse(this);
        if (!result.success) {
            throw result.error;
        }
        return result.data as CreateUserRequestType;
    }
}

export class CreateUserResponseDto {
    id?: number;

    constructor(data: Partial<CreateUserResponseDto> = {}) {
        Object.assign(this, data);
    }
}

/*************************************************************
 *                       Get User
 ************************************************************/
const GetUserByIdRequestSchema = z.object({
    id: z.number({ required_error: "id is required" })
});

type GetUserByIdRequestType = z.infer<typeof GetUserByIdRequestSchema>;

export class GetUserByIdRequestDto {
    id?: number;

    constructor(data: Partial<GetUserByIdRequestDto> = {}) {
        Object.assign(this, data);
    }

    validate(): GetUserByIdRequestType {
        const result = GetUserByIdRequestSchema.safeParse(this);
        if (!result.success) {
            throw result.error;
        }
        return result.data as GetUserByIdRequestType;
    }
}

export class GetUserByIdResponseDto {
    user?: UserResponse;

    constructor(data: Partial<GetUserByIdResponseDto> = {}) {
        Object.assign(this, data);
    }
}

/*************************************************************
 *                       Get All User
 ************************************************************/
const GetAllUsersRequestSchema = z.object({
    limit: z.number().optional(),
    offset: z.number().optional(),
    orderBy: z.object({
        field: z.enum(['id', 'createdAt', 'updatedAt'] as const, { required_error: "orderBy is required" }),
        direction: z.enum(['asc', 'desc'])
    }).optional(),
});

type GetAllUsersRequestType = z.infer<typeof GetAllUsersRequestSchema>;

export class GetAllUsersRequestDto {
    limit?: number;
    offset?: number;
    orderBy?: {
        field: keyof User;
        direction: 'asc' | 'desc';
    };

    constructor(data: Partial<GetAllUsersRequestDto> = {}) {
        Object.assign(this, data);
    }

    validate(): GetAllUsersRequestType {
        const result = GetAllUsersRequestSchema.safeParse(this);
        if (!result.success) {
            throw result.error;
        }
        return result.data as GetAllUsersRequestType;
    }
}

export class GetAllUsersResponseDto {
    users?: UserResponse[];
    total?: number;

    constructor(data: Partial<GetAllUsersResponseDto> = {}) {
        Object.assign(this, data);
    }
}
/*************************************************************  
 *                       Update User
 ************************************************************/
const UpdateUserByIdRequestSchema = z.object({
    id: z.number({ required_error: "id is required" }),
    user: z.object({
        name: z.string().optional(),
        email: z.string().optional(),
        roleId: z.nativeEnum(UserRole).optional(),
        statusId: z.nativeEnum(UserStatus).optional(),
    })
});

type UpdateUserByIdRequestType = z.infer<typeof UpdateUserByIdRequestSchema>;

export class UpdateUserByIdRequestDto {
    id?: number;
    user?: User;

    constructor(data: Partial<UpdateUserByIdRequestDto> = {}) {
        Object.assign(this, data);
    }

    validate(): UpdateUserByIdRequestType {
        const result = UpdateUserByIdRequestSchema.safeParse(this);
        if (!result.success) {
            throw result.error;
        }
        return result.data as UpdateUserByIdRequestType;
    }
}

export class UpdateUserByIdResponseDto {

    constructor(data: Partial<UpdateUserByIdResponseDto> = {}) {
        Object.assign(this, data);
    }
}
/*************************************************************
 *                       Delete User
 ************************************************************/
const DeleteUserRequestSchema = z.object({
    id: z.number({ required_error: "id is required" })
});

type DeleteUserRequestType = z.infer<typeof DeleteUserRequestSchema>;

export class DeleteUserRequestDto {
    id?: number;

    constructor(data: Partial<DeleteUserRequestDto> = {}) {
        Object.assign(this, data);
    }

    validate(): DeleteUserRequestType {
        const result = DeleteUserRequestSchema.safeParse(this);
        if (!result.success) {
            throw result.error;
        }
        return result.data as DeleteUserRequestType;
    }
}

export class DeleteUserResponseDto {

    constructor(data: Partial<DeleteUserResponseDto> = {}) {
        Object.assign(this, data);
    }
}

/*************************************************************
 *                       Login
 ************************************************************/
const LoginRequestSchema = z.object({
    email: z.string({ required_error: "email is required" })
        .email("Invalid email address"),
    password: z.string({ required_error: "password is required" })
        .min(8, "password must be at least 8 characters")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "password must contain at least one uppercase letter, one lowercase letter, and one number"),
    ipAddress: z.string().optional(),
    userAgent: z.string().optional(),
});

type LoginRequestType = z.infer<typeof LoginRequestSchema>;

export class LoginRequestDto {
    email?: string;
    password?: string;
    ipAddress?: string;
    userAgent?: string;

    constructor(data: Partial<LoginRequestDto> = {}) {
        Object.assign(this, data);
    }

    validate(): LoginRequestType {
        const result = LoginRequestSchema.safeParse(this);
        if (!result.success) {
            throw result.error;
        }
        return result.data as LoginRequestType;
    }
}

export class LoginResponseDto {
    token?: string;

    constructor(data: Partial<LoginResponseDto> = {}) {
        Object.assign(this, data);
    }
}
