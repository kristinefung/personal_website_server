import { ApiError } from '../utils/apiError';
import { z } from 'zod';
import { Dto } from '../utils/dto';

const dto = new Dto();

const sourceName = "UserSchema";

class ValidationResult<T> {
    public success: boolean;
    public data?: T;
    public errors?: string[];

    constructor(success: boolean, data?: T, errors?: string[]) {
        this.success = success;
        this.data = data;
        this.errors = errors;
    }
}

export type User = {
    id?: number,
    email?: string,
    name?: string,
    password?: string,
    password_salt?: string,
    role_id?: number,
    status_id?: number,
    created_at?: Date,
    created_by?: number,
    updated_at?: Date,
    updated_by?: number,
    deleted?: number,
}

export function validateCreateUser(reqBody: unknown): ValidationResult<User | undefined> {
    // Step 1: Validate request body
    const createUserSchema = z.object({
        name: z.string().min(1, "Name is required"),
        email: z.string().email("Invalid email address"),
        password: z.string(),
    });

    const result = createUserSchema.safeParse(reqBody);

    // Step 2: If input invalid, return false
    if (!result.success) {
        const errors = result.error.errors.map(e => e.message);
        return new ValidationResult(false, undefined, errors);
    }

    // Step 2: If input valid, return true
    const validatedData: User = {
        email: result.data.email,
        name: result.data.name,
        password: result.data.password,
    };
    return new ValidationResult(true, validatedData);
}