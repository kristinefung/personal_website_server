import { z } from 'zod';
import { Enquiry, EnquiryStatus } from '@prisma/client';

type EnquiryResponse = {
    id: number;
    name: string;
    email: string;
    companyName: string | null;
    phoneNo: string | null;
    comment: string;
    statusId: EnquiryStatus;
}

// Create Enquiry
const CreateEnquiryRequestSchema = z.object({
    name: z.string({ required_error: "name is required" }).min(1, "name is required"),
    email: z.string({ required_error: "email is required" }).email("Invalid email address"),
    companyName: z.string().optional().nullable(),
    phoneNo: z.string().optional().nullable(),
    comment: z.string({ required_error: "comment is required" }).min(1, "comment is required"),
});

type CreateEnquiryRequestType = z.infer<typeof CreateEnquiryRequestSchema>;

export class CreateEnquiryRequestDto {
    name?: string;
    email?: string;
    companyName?: string;
    phoneNo?: string;
    comment?: string;

    constructor(data: Partial<CreateEnquiryRequestDto> = {}) {
        Object.assign(this, data);
    }

    validate(): CreateEnquiryRequestType {
        const result = CreateEnquiryRequestSchema.safeParse(this);
        if (!result.success) {
            throw result.error;
        }
        return result.data;
    }
}

export class CreateEnquiryResponseDto {
    id?: number;

    constructor(data: Partial<CreateEnquiryResponseDto> = {}) {
        Object.assign(this, data);
    }
}

// Get Enquiry by ID
const GetEnquiryByIdRequestSchema = z.object({
    id: z.number(),
});

type GetEnquiryByIdRequestType = z.infer<typeof GetEnquiryByIdRequestSchema>;

export class GetEnquiryByIdRequestDto {
    id?: number;

    constructor(data: Partial<GetEnquiryByIdRequestDto> = {}) {
        Object.assign(this, data);
    }

    validate(): GetEnquiryByIdRequestType {
        const result = GetEnquiryByIdRequestSchema.safeParse(this);
        if (!result.success) {
            throw result.error;
        }
        return result.data;
    }
}

export class GetEnquiryByIdResponseDto {
    enquiry?: EnquiryResponse;

    constructor(data: Partial<GetEnquiryByIdResponseDto> = {}) {
        Object.assign(this, data);
    }
}

// Get All Enquiries
const GetAllEnquiriesRequestSchema = z.object({
    limit: z.number().optional(),
    offset: z.number().optional(),
    orderBy: z.object({
        field: z.enum(['id', 'name', 'email', 'companyName', 'statusId', 'createdAt']),
        direction: z.enum(['asc', 'desc'])
    }).optional()
});

type GetAllEnquiriesRequestType = z.infer<typeof GetAllEnquiriesRequestSchema>;

export class GetAllEnquiriesRequestDto {
    limit?: number;
    offset?: number;
    orderBy?: {
        field: keyof Enquiry;
        direction: 'asc' | 'desc';
    };

    constructor(data: Partial<GetAllEnquiriesRequestDto> = {}) {
        Object.assign(this, data);
    }

    validate(): GetAllEnquiriesRequestType {
        const result = GetAllEnquiriesRequestSchema.safeParse(this);
        if (!result.success) {
            throw result.error;
        }
        return result.data;
    }
}

export class GetAllEnquiriesResponseDto {
    enquiries: EnquiryResponse[] = [];
    total: number = 0;

    constructor(data: Partial<GetAllEnquiriesResponseDto> = {}) {
        Object.assign(this, data);
    }
}

// Delete Enquiry
const DeleteEnquiryRequestSchema = z.object({
    id: z.number(),
});

type DeleteEnquiryRequestType = z.infer<typeof DeleteEnquiryRequestSchema>;

export class DeleteEnquiryRequestDto {
    id?: number;

    constructor(data: Partial<DeleteEnquiryRequestDto> = {}) {
        Object.assign(this, data);
    }

    validate(): DeleteEnquiryRequestType {
        const result = DeleteEnquiryRequestSchema.safeParse(this);
        if (!result.success) {
            throw result.error;
        }
        return result.data;
    }
}

export class DeleteEnquiryResponseDto {
    id: number = 0;

    constructor(data: Partial<DeleteEnquiryResponseDto> = {}) {
        Object.assign(this, data);
    }
}

// Update Enquiry
const UpdateEnquiryByIdRequestSchema = z.object({
    id: z.number(),
    enquiry: z.object({
        name: z.string().optional(),
        email: z.string().email("Invalid email address").optional(),
        companyName: z.string().optional().nullable(),
        phoneNo: z.string().optional().nullable(),
        comment: z.string().optional(),
        statusId: z.nativeEnum(EnquiryStatus).optional(),
    })
});

type UpdateEnquiryByIdRequestType = z.infer<typeof UpdateEnquiryByIdRequestSchema>;

export class UpdateEnquiryByIdRequestDto {
    id?: number;
    enquiry?: {
        name?: string;
        email?: string;
        companyName?: string | null;
        phoneNo?: string | null;
        comment?: string;
        statusId?: EnquiryStatus;
    };

    constructor(data: Partial<UpdateEnquiryByIdRequestDto> = {}) {
        Object.assign(this, data);
    }

    validate(): UpdateEnquiryByIdRequestType {
        const result = UpdateEnquiryByIdRequestSchema.safeParse(this);
        if (!result.success) {
            throw result.error;
        }
        return result.data;
    }
}

export class UpdateEnquiryByIdResponseDto {

    constructor(data: Partial<UpdateEnquiryByIdResponseDto> = {}) {
        Object.assign(this, data);
    }
} 