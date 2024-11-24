import { z } from 'zod';

import { ValidationResult } from '../utils/validationResult';

export class User {
    id?: number;
    email?: string;
    name?: string;
    password?: string;
    password_salt?: string;
    role_id?: number;
    status_id?: number;
    created_at?: Date;
    created_by?: number;
    updated_at?: Date;
    updated_by?: number;
    deleted?: number;

    constructor(data: Partial<User> = {}) {
        Object.assign(this, data);
    }

    hideSensitive() {
        const hiddenWord = "********";

        this.password = hiddenWord;
        this.password_salt = hiddenWord;
        return this;
    }

    validateCreateInput(): ValidationResult<User | undefined> {
        // Step 1: Validate request body
        const createUserSchema = z.object({
            name: z
                .string({ required_error: "name is required" })
                .min(1, "name is required"),
            email: z
                .string({ required_error: "email is required" })
                .email("Invalid email address"),
            password: z
                .string({ required_error: "password is required" })
                .min(1, "password is required"),
        });

        const result = createUserSchema.safeParse(this);

        // Step 2: If input invalid, return false
        if (!result.success) {
            const errors = result.error.errors.map(e => e.message);
            return new ValidationResult(false, undefined, errors);
        }

        // Step 2: If input valid, return true
        this.email = result.data.email;
        this.name = result.data.name;
        this.password = result.data.password;

        const validatedData = this;
        return new ValidationResult(true, validatedData);
    }

    validateUpdateInput(): ValidationResult<User | undefined> {
        // Step 1: Validate request body
        const updateUserSchema = z.object({
            name: z
                .string()
                .optional()
                .nullable(),
            email: z
                .string()
                .email("Invalid email address")
                .optional()
                .nullable(),
            password: z
                .string()
                .optional()
                .nullable(),
        });

        const result = updateUserSchema.safeParse(this);

        // Step 2: If input invalid, return false
        if (!result.success) {
            const errors = result.error.errors.map(e => e.message);
            return new ValidationResult(false, undefined, errors);
        }

        // Step 2: If input valid, return true
        this.email = result.data.email || undefined;
        this.name = result.data.name || undefined;
        this.password = result.data.password || undefined;

        const validatedData = this;
        return new ValidationResult(true, validatedData);
    }
}
