import { z } from 'zod';
import { ApiStatusCode, EnquiryStatus } from '../utils/enum';
import { ApiError } from '../utils/err';

export class Enquiry {
    id?: number;
    name?: string;
    email?: string;
    companyName?: string;
    phoneNo?: string;
    comment?: string;
    statusId?: EnquiryStatus;
    createdAt?: Date;
    createdBy?: number;
    updatedAt?: Date;
    updatedBy?: number;
    deleted?: number;

    constructor(data: Partial<Enquiry> = {}) {
        Object.assign(this, data);
    }

    createEnquiry(): Enquiry {
        const user = this._validateInput(z.object(
            {
                name: z.string({ required_error: "name is required" }).min(1, "name is required"),
                email: z.string({ required_error: "email is required" }).email("Invalid email address"),
                companyName: z.string().optional().nullable(),
                phoneNo: z.string().optional().nullable(),
                comment: z.string({ required_error: "comment is required" }).min(1, "comment is required"),
            }
        ));
        Object.assign(this, user);

        this.statusId = EnquiryStatus.UNHANDLED;

        this.createdAt = new Date();
        this.createdBy = 9999;

        return this;
    }

    updateEnquiry(): Enquiry {
        const user = this._validateInput(z.object(
            {
                name: z.string().optional().nullable(),
                email: z.string().email("Invalid email address").optional().nullable(),
                companyName: z.string().optional().nullable(),
                phoneNo: z.string().optional().nullable(),
                statusId: z.number().optional().nullable(),
                comment: z.string().optional().nullable(),
            }
        ));
        Object.assign(this, user);

        this.updatedAt = new Date();
        this.updatedBy = 9999;
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
