import { PrismaClient } from '@prisma/client';
import { Education } from '../entities/education.entity';

export interface IEducationRepository {
    createEducation(education: Education): Promise<Education>;
    getEducationById(id: number): Promise<Education | null>;
    getAllEducations(): Promise<Education[]>;
    deleteEducationById(id: number): Promise<void>;
    updateEducationById(id: number, education: Education): Promise<Education>;
}

export class EducationRepository implements IEducationRepository {
    constructor(
        private prismaClient: PrismaClient
    ) { }

    async createEducation(education: Education): Promise<Education> {
        const createdEducation = await this.prismaClient.education.create({
            data: {
                degree: education.degree ?? "",
                subject: education.subject ?? "",
                schoolName: education.schoolName ?? "",
                description: education.description ?? "",
                startMonth: education.startMonth ?? 0,
                startYear: education.startMonth ?? 0,
                endMonth: education.endMonth ?? 0,
                endYear: education.endYear ?? 0,
                isCurrent: education.isCurrent ?? 0,

                createdAt: education.createdAt ?? new Date(),
                createdBy: education.createdBy ?? 0,
                updatedAt: education.updatedAt ?? new Date(),
                updatedBy: education.updatedBy ?? 0,
                deleted: education.deleted ?? 0,
            },
        });

        return new Education(createdEducation);
    }

    async updateEducationById(id: number, education: Education): Promise<Education> {
        const updatedEducation = await this.prismaClient.education.update({
            where: {
                id: id,
                deleted: 0,
            },
            data: {
                degree: education.degree ?? undefined,
                subject: education.subject ?? undefined,
                schoolName: education.schoolName ?? undefined,
                description: education.description ?? undefined,
                startMonth: education.startMonth ?? undefined,
                startYear: education.startYear ?? undefined,
                endMonth: education.endMonth ?? undefined,
                endYear: education.endYear ?? undefined,
                isCurrent: education.isCurrent ?? undefined,

                createdAt: education.createdAt ?? undefined,
                createdBy: education.createdBy ?? undefined,
                updatedAt: education.updatedAt ?? undefined,
                updatedBy: education.updatedBy ?? undefined,
                deleted: education.deleted ?? undefined,
            },
        });

        return new Education(updatedEducation);
    }

    async getEducationById(id: number): Promise<Education | null> {
        const education = await this.prismaClient.education.findUnique({
            where: {
                id: id,
                deleted: 0
            },
        });
        return education ? new Education(education) : null;
    }

    async getAllEducations(): Promise<Education[]> {
        const educations = await this.prismaClient.education.findMany({
            where: {
                deleted: 0
            },
        });
        return educations.map(education => new Education(education));
    }

    async deleteEducationById(id: number): Promise<void> {
        const education = await this.prismaClient.education.update({
            where: {
                id: id,
                deleted: 0
            },
            data: {
                deleted: 1
            },
        });
        return;
    }
}