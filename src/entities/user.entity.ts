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
        return this._validateInput(z.object(
            {
                name: z.string({ required_error: "name is required" }).min(1, "name is required"),
                email: z.string({ required_error: "email is required" }).email("Invalid email address"),
                password: z.string({ required_error: "password is required" }).min(1, "password is required"),
            }
        ));
    }

    validateUpdateInput(): ValidationResult<User | undefined> {
        return this._validateInput(z.object(
            {
                name: z.string().optional().nullable(),
                email: z.string().email("Invalid email address").optional().nullable(),
                password: z.string().optional().nullable(),
            }
        ));
    }

    validateLoginInput(): ValidationResult<User | undefined> {
        return this._validateInput(z.object(
            {
                email: z.string({ required_error: "email is required" }).email("Invalid email address"),
                password: z.string({ required_error: "password is required" }),
            }
        ));
    }

    private _validateInput(schema: z.ZodSchema): ValidationResult<User | undefined> {
        const result = schema.safeParse(this);

        if (!result.success) {
            const errors = result.error.errors.map(e => e.message);
            return new ValidationResult(false, undefined, errors);
        }

        // Update fields with validated data
        Object.assign(this, result.data);
        return new ValidationResult(true, this);
    }
}
