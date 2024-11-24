import { z } from 'zod';
import { ApiStatusCode, UserRole } from '../utils/enum';
import { ApiError } from '../utils/err';

export class Education {
    id?: number;
    degree?: string;
    subject?: string;
    school_name?: string;
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


    constructor(data: Partial<Education> = {}) {
        Object.assign(this, data);
    }

    createEducation(): Education {
        const user = this._validateInput(z.object(
            {
                degree: z.string({ required_error: "degree is required" }).min(1, "degree is required"),
                subject: z.string({ required_error: "subject is required" }).min(1, "degree is required"),
                school_name: z.string({ required_error: "school_name is required" }).min(1, "school_name is required"),
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

    updateEducation(): Education {
        const user = this._validateInput(z.object(
            {
                degree: z.string({ required_error: "degree is required" }).min(1, "degree is required").optional().nullable(),
                subject: z.string({ required_error: "subject is required" }).min(1, "degree is required").optional().nullable(),
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

    private _validateInput(schema: z.ZodSchema): Education {
        const result = schema.safeParse(this);

        if (!result.success) {
            const firstError = result.error.errors[0].message;
            throw new ApiError(firstError, ApiStatusCode.INVALID_ARGUMENT, 400);
        }

        return result.data;
    }
}
