import { PrismaClient, Education } from '@prisma/client';

export type EducationQueryParams = {
    offset?: number;
    limit?: number;
    orderBy?: keyof Education;
    orderDirection?: 'asc' | 'desc';
}

export interface IEducationRepository {
    createEducation(education: Partial<Education>): Promise<number>;
    getAllEducations(params?: EducationQueryParams): Promise<{ educations: Education[], total: number }>;
    getEducationById(id: number): Promise<Education | null>;
    deleteEducationById(id: number): Promise<void>;
    updateEducationById(id: number, education: Partial<Education>): Promise<Education>;
}

export class EducationRepository implements IEducationRepository {
    constructor(
        private prismaClient: PrismaClient
    ) { }

    async createEducation(education: Partial<Education>): Promise<number> {
        const createdEducation = await this.prismaClient.education.create({
            data: {
                degree: education.degree!,
                subject: education.subject!,
                schoolName: education.schoolName!,
                description: education.description!,
                startMonth: education.startMonth!,
                startYear: education.startYear!,
                endMonth: education.endMonth,
                endYear: education.endYear,
                isCurrent: education.isCurrent!,
                createdAt: new Date(),
                createdBy: education.createdBy!,
                deleted: false,
            },
        });

        return createdEducation.id;
    }

    async getAllEducations(params?: EducationQueryParams): Promise<{ educations: Education[], total: number }> {
        const where = {
            deleted: false
        };

        const educations = await this.prismaClient.education.findMany({
            where: where,
            skip: params?.offset,
            take: params?.limit,
            orderBy: params?.orderBy ? {
                [params.orderBy]: params.orderDirection || 'asc'
            } : undefined,
        });

        const total = await this.prismaClient.education.count({
            where: where,
        });

        return {
            educations: educations,
            total: total,
        };
    }

    async getEducationById(id: number): Promise<Education | null> {
        const education = await this.prismaClient.education.findUnique({
            where: {
                id: id,
                deleted: false
            },
        });
        return education;
    }

    async deleteEducationById(id: number): Promise<void> {
        await this.prismaClient.education.update({
            where: {
                id: id,
                deleted: false
            },
            data: {
                deleted: true
            },
        });
        return;
    }

    async updateEducationById(id: number, education: Partial<Education>): Promise<Education> {
        const updatedEducation = await this.prismaClient.education.update({
            where: {
                id: id,
                deleted: false,
            },
            data: {
                degree: education.degree,
                subject: education.subject,
                schoolName: education.schoolName,
                description: education.description,
                startMonth: education.startMonth,
                startYear: education.startYear,
                endMonth: education.endMonth,
                endYear: education.endYear,
                isCurrent: education.isCurrent,
                updatedAt: new Date(),
                updatedBy: education.updatedBy,
            },
        });

        return updatedEducation;
    }
}