import { PrismaClient, Work } from '@prisma/client';

export type WorkQueryParams = {
    offset?: number;
    limit?: number;
    orderBy?: keyof Work;
    orderDirection?: 'asc' | 'desc';
}

export interface IWorkRepository {
    createWork(work: Partial<Work>): Promise<number>;
    getAllWorks(params?: WorkQueryParams): Promise<{ works: Work[], total: number }>;
    getWorkById(id: number): Promise<Work | null>;
    deleteWorkById(id: number): Promise<void>;
    updateWorkById(id: number, work: Partial<Work>): Promise<Work>;
}

export class WorkRepository implements IWorkRepository {
    constructor(
        private prismaClient: PrismaClient
    ) { }

    async createWork(work: Partial<Work>): Promise<number> {
        const createdWork = await this.prismaClient.work.create({
            data: {
                title: work.title!,
                companyName: work.companyName!,
                description: work.description!,
                startMonth: work.startMonth!,
                startYear: work.startYear!,
                endMonth: work.endMonth,
                endYear: work.endYear,
                isCurrent: work.isCurrent!,
                createdAt: new Date(),
                createdBy: work.createdBy!,
                deleted: false,
            },
        });

        return createdWork.id;
    }

    async getAllWorks(params?: WorkQueryParams): Promise<{ works: Work[], total: number }> {
        const where = {
            deleted: false
        };

        const works = await this.prismaClient.work.findMany({
            where: where,
            skip: params?.offset,
            take: params?.limit,
            orderBy: params?.orderBy ? {
                [params.orderBy]: params.orderDirection || 'asc'
            } : undefined,
        });

        const total = await this.prismaClient.work.count({
            where: where,
        });

        return {
            works: works,
            total: total,
        };
    }

    async getWorkById(id: number): Promise<Work | null> {
        const work = await this.prismaClient.work.findUnique({
            where: {
                id: id,
                deleted: false
            },
        });
        return work;
    }

    async deleteWorkById(id: number): Promise<void> {
        await this.prismaClient.work.update({
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

    async updateWorkById(id: number, work: Partial<Work>): Promise<Work> {
        const updatedWork = await this.prismaClient.work.update({
            where: {
                id: id,
                deleted: false,
            },
            data: {
                title: work.title,
                companyName: work.companyName,
                description: work.description,
                startMonth: work.startMonth,
                startYear: work.startYear,
                endMonth: work.endMonth,
                endYear: work.endYear,
                isCurrent: work.isCurrent,
                updatedAt: new Date(),
                updatedBy: work.updatedBy,
            },
        });

        return updatedWork;
    }
}