import { z } from 'zod';
import { ApiStatusCode, UserRole } from '../utils/enum';
import { ApiError } from '../utils/err';

export class Work {
    id?: number;
    title?: string;
    company_name?: string;
    description?: string;
    start_month?: number;
    start_year?: number;
    end_month?: number;
    end_year?: number;
    is_current?: number;

    created_at?: Date;
    created_by?: UserRole;
    updated_at?: Date;
    updated_by?: UserRole;
    deleted?: number;


    constructor(data: Partial<Work> = {}) {
        Object.assign(this, data);
    }

    createWork(): Work {
        const user = this._validateInput(z.object(
            {
                title: z.string({ required_error: "title is required" }).min(1, "title is required"),
                company_name: z.string({ required_error: "company_name is required" }).min(1, "company_name is required"),
                description: z.string().optional().nullable(),
                start_month: z.number({ required_error: "start_month is required", message: "start_month must be in range of 1 - 12" }).min(1).max(12),
                start_year: z.number({ required_error: "start_year is required", message: "start_year must be in range of 1900 - now" }).min(1900).max(new Date().getFullYear()),
                end_month: z
                    .number({ message: "start_month must be in range of 1 - 12" })
                    .min(1)
                    .max(12)
                    .optional()
                    .nullable(),
                end_year: z
                    .number({ message: "start_year must be in range of 1900 - now" })
                    .min(1900)
                    .max(new Date().getFullYear())
                    .optional()
                    .nullable(),
                is_current: z.number({ required_error: "is_current is required", message: "is_current must be 0 or 1" }).min(0).max(1),
            }
        ));
        Object.assign(this, user);

        this.created_at = new Date();
        this.created_by = 9999;

        return this;
    }

    updateWork(): Work {
        const user = this._validateInput(z.object(
            {
                title: z.string({ required_error: "title is required" }).min(1, "title is required").optional().nullable(),
                company_name: z.string({ required_error: "company_name is required" }).min(1, "company_name is required").optional().nullable(),
                school_name: z.string({ required_error: "school_name is required" }).min(1, "school_name is required").optional().nullable(),
                description: z.string().optional().nullable(),
                start_month: z.number({ required_error: "start_month is required", message: "start_month must be in range of 1 - 12" }).min(1).max(12).optional().nullable(),
                start_year: z.number({ required_error: "start_year is required", message: "start_year must be in range of 1900 - now" }).min(1900).max(new Date().getFullYear()).optional().nullable(),
                end_month: z
                    .number({ message: "start_month must be in range of 1 - 12" })
                    .min(1)
                    .max(12)
                    .optional()
                    .nullable(),
                end_year: z
                    .number({ message: "start_year must be in range of 1900 - now" })
                    .min(1900)
                    .max(new Date().getFullYear())
                    .optional()
                    .nullable(),
                is_current: z.number({ required_error: "is_current is required", message: "is_current must be 0 or 1" }).min(0).max(1).optional().nullable(),
            }
        ));
        Object.assign(this, user);

        this.updated_at = new Date();
        this.updated_by = 9999;
        return this;
    }

    private _validateInput(schema: z.ZodSchema): Work {
        const result = schema.safeParse(this);

        if (!result.success) {
            const firstError = result.error.errors[0].message;
            throw new ApiError(firstError, ApiStatusCode.INVALID_ARGUMENT, 400);
        }

        return result.data;
    }
}
