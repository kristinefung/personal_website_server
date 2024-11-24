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
        const createdEducation = await this.prismaClient.educationModel.create({
            data: {
                degree: education.degree || "",
                subject: education.subject || "",
                school_name: education.school_name || "",
                description: education.description || "",
                start_month: education.start_month || 0,
                start_year: education.start_year || 0,
                end_month: education.end_month || 0,
                end_year: education.end_year || 0,
                is_current: education.is_current || 0,

                created_at: education.created_at || new Date(),
                created_by: education.created_by || 0,
                updated_at: education.updated_at || new Date(),
                updated_by: education.updated_by || 0,
                deleted: education.deleted || 0,
            },
        });

        return new Education(createdEducation);
    }

    async updateEducationById(id: number, education: Education): Promise<Education> {
        const updatedEducation = await this.prismaClient.educationModel.update({
            where: {
                id: id,
                deleted: 0,
            },
            data: {
                degree: education.degree || undefined,
                subject: education.subject || undefined,
                school_name: education.school_name || undefined,
                description: education.description || undefined,
                start_month: education.start_month || undefined,
                start_year: education.start_year || undefined,
                end_month: education.end_month || undefined,
                end_year: education.end_year || undefined,
                is_current: education.is_current || undefined,

                created_at: education.created_at || undefined,
                created_by: education.created_by || undefined,
                updated_at: education.updated_at || undefined,
                updated_by: education.updated_by || undefined,
                deleted: education.deleted || undefined,
            },
        });

        return new Education(updatedEducation);
    }

    async getEducationById(id: number): Promise<Education | null> {
        const education = await this.prismaClient.educationModel.findUnique({
            where: {
                id: id,
                deleted: 0
            },
        });
        return education ? new Education(education) : null;
    }

    async getAllEducations(): Promise<Education[]> {
        const educations = await this.prismaClient.educationModel.findMany({
            where: {
                deleted: 0
            },
        });
        return educations.map(education => new Education(education));
    }

    async deleteEducationById(id: number): Promise<void> {
        const education = await this.prismaClient.educationModel.update({
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