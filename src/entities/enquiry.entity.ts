import { z } from 'zod';
import { ApiStatusCode, EnquiryStatus } from '../utils/enum';
import { ApiError } from '../utils/err';

export class Enquiry {
    id?: number;
    name?: string;
    email?: string;
    company_name?: string;
    phone_no?: string;
    comment?: string;
    status_id?: EnquiryStatus;
    created_at?: Date;
    created_by?: number;
    updated_at?: Date;
    updated_by?: number;
    deleted?: number;

    constructor(data: Partial<Enquiry> = {}) {
        Object.assign(this, data);
    }

    createEnquiry(): Enquiry {
        const user = this._validateInput(z.object(
            {
                name: z.string({ required_error: "name is required" }).min(1, "name is required"),
                email: z.string({ required_error: "email is required" }).email("Invalid email address"),
                company_name: z.string().optional().nullable(),
                phone_no: z.string().optional().nullable(),
                comment: z.string({ required_error: "comment is required" }).min(1, "comment is required"),
            }
        ));
        Object.assign(this, user);

        this.status_id = EnquiryStatus.UNHANDLED;

        this.created_at = new Date();
        this.created_by = 9999;

        return this;
    }

    updateEnquiry(): Enquiry {
        const user = this._validateInput(z.object(
            {
                name: z.string().optional().nullable(),
                email: z.string().email("Invalid email address").optional().nullable(),
                company_name: z.string().optional().nullable(),
                phone_no: z.string().optional().nullable(),
                status_id: z.number().optional().nullable(),
                comment: z.string().optional().nullable(),
            }
        ));
        Object.assign(this, user);

        this.updated_at = new Date();
        this.updated_by = 9999;
        return this;
    }

    private _validateInput(schema: z.ZodSchema): Enquiry {
        const result = schema.safeParse(this);

        if (!result.success) {
            const firstError = result.error.errors[0].message;
            throw new ApiError(firstError, ApiStatusCode.INVALID_ARGUMENT, 400);
        }

        return result.data;
    }
}
