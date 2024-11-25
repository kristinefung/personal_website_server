import { PrismaClient } from '@prisma/client';
import { Work } from '../entities/work.entity';

export interface IWorkRepository {
    createWork(work: Work): Promise<Work>;
    getWorkById(id: number): Promise<Work | null>;
    getAllWorks(): Promise<Work[]>;
    deleteWorkById(id: number): Promise<void>;
    updateWorkById(id: number, work: Work): Promise<Work>;
}

export class WorkRepository implements IWorkRepository {
    constructor(
        private prismaClient: PrismaClient
    ) { }

    async createWork(work: Work): Promise<Work> {
        const createdWork = await this.prismaClient.workModel.create({
            data: {
                title: work.title ?? "",
                company_name: work.company_name ?? "",
                description: work.description ?? "",
                start_month: work.start_month ?? 0,
                start_year: work.start_year ?? 0,
                end_month: work.end_month ?? 0,
                end_year: work.end_year ?? 0,
                is_current: work.is_current ?? 0,

                created_at: work.created_at ?? new Date(),
                created_by: work.created_by ?? 0,
                updated_at: work.updated_at ?? new Date(),
                updated_by: work.updated_by ?? 0,
                deleted: work.deleted ?? 0,
            },
        });

        return new Work(createdWork);
    }

    async updateWorkById(id: number, work: Work): Promise<Work> {
        const updatedWork = await this.prismaClient.workModel.update({
            where: {
                id: id,
                deleted: 0,
            },
            data: {
                title: work.title ?? undefined,
                company_name: work.company_name ?? undefined,
                description: work.description ?? undefined,
                start_month: work.start_month ?? undefined,
                start_year: work.start_year ?? undefined,
                end_month: work.end_month ?? undefined,
                end_year: work.end_year ?? undefined,
                is_current: work.is_current ?? undefined,

                created_at: work.created_at ?? undefined,
                created_by: work.created_by ?? undefined,
                updated_at: work.updated_at ?? undefined,
                updated_by: work.updated_by ?? undefined,
                deleted: work.deleted ?? undefined,
            },
        });

        return new Work(updatedWork);
    }

    async getWorkById(id: number): Promise<Work | null> {
        const work = await this.prismaClient.workModel.findUnique({
            where: {
                id: id,
                deleted: 0
            },
        });
        return work ? new Work(work) : null;
    }

    async getAllWorks(): Promise<Work[]> {
        const works = await this.prismaClient.workModel.findMany({
            where: {
                deleted: 0
            },
        });
        return works.map(work => new Work(work));
    }

    async deleteWorkById(id: number): Promise<void> {
        const work = await this.prismaClient.workModel.update({
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