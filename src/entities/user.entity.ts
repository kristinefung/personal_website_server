import { z } from 'zod';

import { ValidationResult } from '../utils/validationResult';
import { genRandomString } from '../utils/common';
import { UserRole, UserStatus, ApiStatusCode } from '../utils/enum';
import { ApiError } from '../utils/err';

import bcrypt from 'bcrypt';

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

    hideSensitive(): User {
        const hiddenWord = "********";

        this.password = hiddenWord;
        this.password_salt = hiddenWord;
        return this;
    }

    async hashPassword(): Promise<User> {
        const salt = genRandomString(20);
        const pwWithSalt = this.password! + salt;
        const hashedPw = await bcrypt.hash(pwWithSalt, 10);

        this.password_salt = salt;
        this.password = hashedPw;

        return this;
    }

    async verifyPassword(dbUser: User): Promise<User> {
        const pw = this.password + dbUser.password_salt!;

        const correct = await bcrypt.compare(pw, dbUser.password!)
        if (!correct) {
            new ApiError("Email or password incorrect", ApiStatusCode.INVALID_ARGUMENT, 400);
        }

        return this;
    }

    createInputToUser(): User {
        const user = this._validateInput(z.object(
            {
                name: z.string({ required_error: "name is required" }).min(1, "name is required"),
                email: z.string({ required_error: "email is required" }).email("Invalid email address"),
                password: z.string({ required_error: "password is required" }).min(1, "password is required"),
            }
        ));
        Object.assign(this, user);

        this.role_id = UserRole.USER;
        this.status_id = UserStatus.UNVERIFIED;

        this.created_at = new Date();
        this.created_by = 9999;

        return this;
    }

    updateInputToUser(): User {
        const user = this._validateInput(z.object(
            {
                name: z.string().optional().nullable(),
                email: z.string().email("Invalid email address").optional().nullable(),
                password: z.string().optional().nullable(),
            }
        ));
        Object.assign(this, user);

        this.updated_at = new Date();
        this.updated_by = 9999;
        return this;
    }

    loginInputToUser(): User {
        const user = this._validateInput(z.object(
            {
                email: z.string({ required_error: "email is required" }).email("Invalid email address"),
                password: z.string({ required_error: "password is required" }),
            }
        ));
        Object.assign(this, user);
        return this;
    }

    private _validateInput(schema: z.ZodSchema): User {
        const result = schema.safeParse(this);

        if (!result.success) {
            const firstError = result.error.errors[0].message;
            throw new ApiError(firstError, ApiStatusCode.INVALID_ARGUMENT, 400);
        }

        return result.data;
    }
}
