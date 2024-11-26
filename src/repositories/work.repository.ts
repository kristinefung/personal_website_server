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
        const createdWork = await this.prismaClient.work.create({
            data: {
                title: work.title ?? "",
                companyName: work.companyName ?? "",
                description: work.description ?? "",
                startMonth: work.startMonth ?? 0,
                startYear: work.startYear ?? 0,
                endMonth: work.endMonth ?? 0,
                endYear: work.endYear ?? 0,
                isCurrent: work.isCurrent ?? 0,

                createdAt: work.createdAt ?? new Date(),
                createdBy: work.createdBy ?? 0,
                updatedAt: work.updatedAt ?? new Date(),
                updatedBy: work.updatedBy ?? 0,
                deleted: work.deleted ?? 0,
            },
        });

        return new Work(createdWork);
    }

    async updateWorkById(id: number, work: Work): Promise<Work> {
        const updatedWork = await this.prismaClient.work.update({
            where: {
                id: id,
                deleted: 0,
            },
            data: {
                title: work.title ?? undefined,
                companyName: work.companyName ?? undefined,
                description: work.description ?? undefined,
                startMonth: work.startMonth ?? undefined,
                startYear: work.startYear ?? undefined,
                endMonth: work.endMonth ?? undefined,
                endYear: work.endYear ?? undefined,
                isCurrent: work.isCurrent ?? undefined,

                createdAt: work.createdAt ?? undefined,
                createdBy: work.createdBy ?? undefined,
                updatedAt: work.updatedAt ?? undefined,
                updatedBy: work.updatedBy ?? undefined,
                deleted: work.deleted ?? undefined,
            },
        });

        return new Work(updatedWork);
    }

    async getWorkById(id: number): Promise<Work | null> {
        const work = await this.prismaClient.work.findUnique({
            where: {
                id: id,
                deleted: 0
            },
        });
        return work ? new Work(work) : null;
    }

    async getAllWorks(): Promise<Work[]> {
        const works = await this.prismaClient.work.findMany({
            where: {
                deleted: 0
            },
        });
        return works.map(work => new Work(work));
    }

    async deleteWorkById(id: number): Promise<void> {
        const work = await this.prismaClient.work.update({
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