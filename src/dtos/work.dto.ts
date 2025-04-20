import { z } from 'zod';
import { Work } from '@prisma/client';

type WorkResponse = {
    id: number;
    title: string;
    companyName: string;
    description: string;
    startMonth: number;
    startYear: number;
    endMonth?: number;
    endYear?: number;
    isCurrent: number;
}

// Create Work
const CreateWorkRequestSchema = z.object({
    title: z.string(),
    companyName: z.string(),
    description: z.string(),
    startMonth: z.number().min(1).max(12),
    startYear: z.number().min(1900).max(new Date().getFullYear()),
    endMonth: z.number().min(1).max(12).optional(),
    endYear: z.number().min(1900).max(new Date().getFullYear()).optional(),
    isCurrent: z.number().min(0).max(1),
});

type CreateWorkRequestType = z.infer<typeof CreateWorkRequestSchema>;

export class CreateWorkRequestDto {
    title?: string;
    companyName?: string;
    description?: string;
    startMonth?: number;
    startYear?: number;
    endMonth?: number;
    endYear?: number;
    isCurrent?: number;

    constructor(data: Partial<CreateWorkRequestDto> = {}) {
        Object.assign(this, data);
    }

    validate(): CreateWorkRequestType {
        const result = CreateWorkRequestSchema.safeParse(this);
        if (!result.success) {
            throw result.error;
        }
        return result.data;
    }
}

export class CreateWorkResponseDto {
    id: number = 0;

    constructor(data: Partial<CreateWorkResponseDto> = {}) {
        Object.assign(this, data);
    }
}

// Get Work by ID
const GetWorkByIdRequestSchema = z.object({
    id: z.number(),
});

type GetWorkByIdRequestType = z.infer<typeof GetWorkByIdRequestSchema>;

export class GetWorkByIdRequestDto {
    id?: number;

    constructor(data: Partial<GetWorkByIdRequestDto> = {}) {
        Object.assign(this, data);
    }

    validate(): GetWorkByIdRequestType {
        const result = GetWorkByIdRequestSchema.safeParse(this);
        if (!result.success) {
            throw result.error;
        }
        return result.data;
    }
}

export class GetWorkByIdResponseDto {
    work?: WorkResponse;

    constructor(data: Partial<GetWorkByIdResponseDto> = {}) {
        Object.assign(this, data);
    }
}

// Get All Works
const GetAllWorksRequestSchema = z.object({
    limit: z.number().optional(),
    offset: z.number().optional(),
    orderBy: z.object({
        field: z.enum(['id', 'title', 'companyName', 'startYear', 'startMonth', 'endYear', 'endMonth', 'isCurrent']),
        direction: z.enum(['asc', 'desc'])
    }).optional()
});

type GetAllWorksRequestType = z.infer<typeof GetAllWorksRequestSchema>;

export class GetAllWorksRequestDto {
    limit?: number;
    offset?: number;
    orderBy?: {
        field: keyof Work;
        direction: 'asc' | 'desc';
    };

    constructor(data: Partial<GetAllWorksRequestDto> = {}) {
        Object.assign(this, data);
    }

    validate(): GetAllWorksRequestType {
        const result = GetAllWorksRequestSchema.safeParse(this);
        if (!result.success) {
            throw result.error;
        }
        return result.data;
    }
}

export class GetAllWorksResponseDto {
    works: WorkResponse[] = [];
    total: number = 0;

    constructor(data: Partial<GetAllWorksResponseDto> = {}) {
        Object.assign(this, data);
    }
}

// Delete Work
const DeleteWorkRequestSchema = z.object({
    id: z.number(),
});

type DeleteWorkRequestType = z.infer<typeof DeleteWorkRequestSchema>;

export class DeleteWorkRequestDto {
    id?: number;

    constructor(data: Partial<DeleteWorkRequestDto> = {}) {
        Object.assign(this, data);
    }

    validate(): DeleteWorkRequestType {
        const result = DeleteWorkRequestSchema.safeParse(this);
        if (!result.success) {
            throw result.error;
        }
        return result.data;
    }
}

export class DeleteWorkResponseDto {
    id: number = 0;

    constructor(data: Partial<DeleteWorkResponseDto> = {}) {
        Object.assign(this, data);
    }
}

// Update Work
const UpdateWorkByIdRequestSchema = z.object({
    id: z.number(),
    work: z.object({
        title: z.string().optional(),
        companyName: z.string().optional(),
        description: z.string().optional(),
        startMonth: z.number().min(1).max(12).optional(),
        startYear: z.number().min(1900).max(new Date().getFullYear()).optional(),
        endMonth: z.number().min(1).max(12).optional(),
        endYear: z.number().min(1900).max(new Date().getFullYear()).optional(),
        isCurrent: z.number().min(0).max(1).optional(),
    })
});

type UpdateWorkByIdRequestType = z.infer<typeof UpdateWorkByIdRequestSchema>;

export class UpdateWorkByIdRequestDto {
    id?: number;
    work?: {
        title?: string;
        companyName?: string;
        description?: string;
        startMonth?: number;
        startYear?: number;
        endMonth?: number;
        endYear?: number;
        isCurrent?: number;
    };

    constructor(data: Partial<UpdateWorkByIdRequestDto> = {}) {
        Object.assign(this, data);
    }

    validate(): UpdateWorkByIdRequestType {
        const result = UpdateWorkByIdRequestSchema.safeParse(this);
        if (!result.success) {
            throw result.error;
        }
        return result.data;
    }
}

export class UpdateWorkByIdResponseDto {

    constructor(data: Partial<UpdateWorkByIdResponseDto> = {}) {
        Object.assign(this, data);
    }
} 