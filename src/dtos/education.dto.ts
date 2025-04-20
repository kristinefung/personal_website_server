import { z } from 'zod';
import { Education } from '@prisma/client';

type EducationResponse = {
    id: number;
    degree: string;
    subject: string;
    schoolName: string;
    description: string;
    startMonth: number;
    startYear: number;
    endMonth?: number;
    endYear?: number;
    isCurrent: number;
}

// Create Education
const CreateEducationRequestSchema = z.object({
    degree: z.string(),
    subject: z.string(),
    schoolName: z.string(),
    description: z.string(),
    startMonth: z.number().min(1).max(12),
    startYear: z.number().min(1900).max(new Date().getFullYear()),
    endMonth: z.number().min(1).max(12).optional(),
    endYear: z.number().min(1900).max(new Date().getFullYear()).optional(),
    isCurrent: z.number().min(0).max(1),
});

type CreateEducationRequestType = z.infer<typeof CreateEducationRequestSchema>;

export class CreateEducationRequestDto {
    degree?: string;
    subject?: string;
    schoolName?: string;
    description?: string;
    startMonth?: number;
    startYear?: number;
    endMonth?: number;
    endYear?: number;
    isCurrent?: number;

    constructor(data: Partial<CreateEducationRequestDto> = {}) {
        Object.assign(this, data);
    }

    validate(): CreateEducationRequestType {
        const result = CreateEducationRequestSchema.safeParse(this);
        if (!result.success) {
            throw result.error;
        }
        return result.data as CreateEducationRequestType;
    }
}

export class CreateEducationResponseDto {
    id: number = 0;

    constructor(data: Partial<CreateEducationResponseDto> = {}) {
        Object.assign(this, data);
    }
}

// Get Education by ID
const GetEducationByIdRequestSchema = z.object({
    id: z.number(),
});

type GetEducationByIdRequestType = z.infer<typeof GetEducationByIdRequestSchema>;

export class GetEducationByIdRequestDto {
    id?: number;

    constructor(data: Partial<GetEducationByIdRequestDto> = {}) {
        Object.assign(this, data);
    }

    validate(): GetEducationByIdRequestType {
        const result = GetEducationByIdRequestSchema.safeParse(this);
        if (!result.success) {
            throw result.error;
        }
        return result.data as GetEducationByIdRequestType;
    }
}

export class GetEducationByIdResponseDto {
    education?: EducationResponse;

    constructor(data: Partial<GetEducationByIdResponseDto> = {}) {
        Object.assign(this, data);
    }
}

// Get All Educations
const GetAllEducationsRequestSchema = z.object({
    limit: z.number().optional(),
    offset: z.number().optional(),
    orderBy: z.object({
        field: z.enum(['id', 'degree', 'subject', 'schoolName', 'startYear', 'startMonth', 'endYear', 'endMonth', 'isCurrent']),
        direction: z.enum(['asc', 'desc'])
    }).optional()
});

type GetAllEducationsRequestType = z.infer<typeof GetAllEducationsRequestSchema>;

export class GetAllEducationsRequestDto {
    limit?: number;
    offset?: number;
    orderBy?: {
        field: keyof Education;
        direction: 'asc' | 'desc';
    };

    constructor(data: Partial<GetAllEducationsRequestDto> = {}) {
        Object.assign(this, data);
    }

    validate(): GetAllEducationsRequestType {
        const result = GetAllEducationsRequestSchema.safeParse(this);
        if (!result.success) {
            throw result.error;
        }
        return result.data as GetAllEducationsRequestType;
    }
}

export class GetAllEducationsResponseDto {
    educations: EducationResponse[] = [];
    total: number = 0;

    constructor(data: Partial<GetAllEducationsResponseDto> = {}) {
        Object.assign(this, data);
    }
}

// Delete Education
const DeleteEducationRequestSchema = z.object({
    id: z.number(),
});

type DeleteEducationRequestType = z.infer<typeof DeleteEducationRequestSchema>;

export class DeleteEducationRequestDto {
    id?: number;

    constructor(data: Partial<DeleteEducationRequestDto> = {}) {
        Object.assign(this, data);
    }

    validate(): DeleteEducationRequestType {
        const result = DeleteEducationRequestSchema.safeParse(this);
        if (!result.success) {
            throw result.error;
        }
        return result.data as DeleteEducationRequestType;
    }
}

export class DeleteEducationResponseDto {
    id: number = 0;

    constructor(data: Partial<DeleteEducationResponseDto> = {}) {
        Object.assign(this, data);
    }
}

// Update Education
const UpdateEducationByIdRequestSchema = z.object({
    id: z.number(),
    education: z.object({
        degree: z.string().optional(),
        subject: z.string().optional(),
        schoolName: z.string().optional(),
        description: z.string().optional(),
        startMonth: z.number().min(1).max(12).optional(),
        startYear: z.number().min(1900).max(new Date().getFullYear()).optional(),
        endMonth: z.number().min(1).max(12).optional(),
        endYear: z.number().min(1900).max(new Date().getFullYear()).optional(),
        isCurrent: z.number().min(0).max(1).optional(),
    })
});

type UpdateEducationByIdRequestType = z.infer<typeof UpdateEducationByIdRequestSchema>;

export class UpdateEducationByIdRequestDto {
    id?: number;
    education?: {
        degree?: string;
        subject?: string;
        schoolName?: string;
        description?: string;
        startMonth?: number;
        startYear?: number;
        endMonth?: number;
        endYear?: number;
        isCurrent?: number;
    };

    constructor(data: Partial<UpdateEducationByIdRequestDto> = {}) {
        Object.assign(this, data);
    }

    validate(): UpdateEducationByIdRequestType {
        const result = UpdateEducationByIdRequestSchema.safeParse(this);
        if (!result.success) {
            throw result.error;
        }
        return result.data as UpdateEducationByIdRequestType;
    }
}

export class UpdateEducationByIdResponseDto {
    education?: EducationResponse;

    constructor(data: Partial<UpdateEducationByIdResponseDto> = {}) {
        Object.assign(this, data);
    }
} 