import { z } from 'zod';
import { ApiStatusCode, UserRole } from '../utils/enum';
import { ApiError } from '../utils/err';

export class Work {
    id?: number;
    title?: string;
    companyName?: string;
    description?: string;
    startMonth?: number;
    startYear?: number;
    endMonth?: number;
    endYear?: number;
    isCurrent?: number;

    createdAt?: Date;
    createdBy?: UserRole;
    updatedAt?: Date;
    updatedBy?: UserRole;
    deleted?: number;


    constructor(data: Partial<Work> = {}) {
        Object.assign(this, data);
    }

    createWork(): Work {
        const user = this._validateInput(z.object(
            {
                title: z.string({ required_error: "title is required" }).min(1, "title is required"),
                companyName: z.string({ required_error: "companyName is required" }).min(1, "companyName is required"),
                description: z.string().optional().nullable(),
                startMonth: z.number({ required_error: "startMonth is required", message: "startMonth must be in range of 1 - 12" }).min(1).max(12),
                startYear: z.number({ required_error: "startYear is required", message: "startYear must be in range of 1900 - now" }).min(1900).max(new Date().getFullYear()),
                endMonth: z
                    .number({ message: "endMonth must be in range of 1 - 12" })
                    .min(1)
                    .max(12)
                    .optional()
                    .nullable(),
                endYear: z
                    .number({ message: "endYear must be in range of 1900 - now" })
                    .min(1900)
                    .max(new Date().getFullYear())
                    .optional()
                    .nullable(),
                isCurrent: z.number({ required_error: "isCurrent is required", message: "isCurrent must be 0 or 1" }).min(0).max(1),
            }
        ));
        Object.assign(this, user);

        this.createdAt = new Date();
        this.createdBy = 9999;

        return this;
    }

    updateWork(): Work {
        const user = this._validateInput(z.object(
            {
                title: z.string({ required_error: "title is required" }).min(1, "title is required").optional().nullable(),
                companyName: z.string({ required_error: "companyName is required" }).min(1, "companyName is required").optional().nullable(),
                schoolName: z.string({ required_error: "schoolName is required" }).min(1, "schoolName is required").optional().nullable(),
                description: z.string().optional().nullable(),
                startMonth: z.number({ required_error: "startMonth is required", message: "startMonth must be in range of 1 - 12" }).min(1).max(12).optional().nullable(),
                startYear: z.number({ required_error: "startYear is required", message: "startYear must be in range of 1900 - now" }).min(1900).max(new Date().getFullYear()).optional().nullable(),
                endMonth: z
                    .number({ message: "endMonth must be in range of 1 - 12" })
                    .min(1)
                    .max(12)
                    .optional()
                    .nullable(),
                endYear: z
                    .number({ message: "endYear must be in range of 1900 - now" })
                    .min(1900)
                    .max(new Date().getFullYear())
                    .optional()
                    .nullable(),
                isCurrent: z.number({ required_error: "isCurrent is required", message: "isCurrent must be 0 or 1" }).min(0).max(1).optional().nullable(),
            }
        ));
        Object.assign(this, user);

        this.updatedAt = new Date();
        this.updatedBy = 9999;
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
