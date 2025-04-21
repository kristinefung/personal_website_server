import { PrismaClient, Enquiry } from '@prisma/client';

export type EnquiryQueryParams = {
    offset?: number;
    limit?: number;
    orderBy?: keyof Enquiry;
    orderDirection?: 'asc' | 'desc';
}
export interface IEnquiryRepository {
    createEnquiry(enquiry: Partial<Enquiry>): Promise<number>;
    getEnquiryById(id: number): Promise<Enquiry | null>;
    getAllEnquiries(params?: EnquiryQueryParams): Promise<{ enquiries: Enquiry[], total: number }>;
    searchEnquiries(enquiry: Enquiry): Promise<Enquiry[]>
    deleteEnquiryById(id: number): Promise<void>;
    updateEnquiryById(id: number, enquiry: Enquiry): Promise<Enquiry>;
}

export class EnquiryRepository implements IEnquiryRepository {
    constructor(
        private prismaClient: PrismaClient
    ) { }

    async createEnquiry(enquiry: Partial<Enquiry>): Promise<number> {
        const createdEnquiry = await this.prismaClient.enquiry.create({
            data: {
                name: enquiry.name!,
                email: enquiry.email!,
                companyName: enquiry.companyName!,
                phoneNo: enquiry.phoneNo!,
                comment: enquiry.comment!,
                statusId: enquiry.statusId!,

                createdAt: new Date(),
                createdBy: enquiry.createdBy!,
            },
        });

        return createdEnquiry.id;
    }

    async getEnquiryById(id: number): Promise<Enquiry | null> {
        const enquiry = await this.prismaClient.enquiry.findUnique({
            where: {
                id: id,
                deleted: 0
            },
        });
        return enquiry;
    }

    async getAllEnquiries(params?: EnquiryQueryParams): Promise<{ enquiries: Enquiry[], total: number }> {
        const where = {
            deleted: 0
        };

        const enquiries = await this.prismaClient.enquiry.findMany({
            where: where,
            skip: params?.offset,
            take: params?.limit,
            orderBy: params?.orderBy ? {
                [params.orderBy]: params.orderDirection || 'asc'
            } : undefined,
        });

        const total = await this.prismaClient.enquiry.count({
            where: where,
        });

        return { enquiries: enquiries, total: total };
    }

    async searchEnquiries(enquiry: Enquiry): Promise<Enquiry[]> {
        const conditions: any[] = [];

        // Helper function to add conditions
        const addCondition = (field: string, value: any) => {
            if (value) {
                conditions.push({
                    [field]: {
                        contains: value,
                    },
                });
            }
        };

        addCondition('name', enquiry.name);
        addCondition('email', enquiry.email);
        addCondition('phone_no', enquiry.phoneNo);
        addCondition('status_id', enquiry.statusId);

        const enquiries = await this.prismaClient.enquiry.findMany({
            where: {
                AND: conditions,
            },
        });

        return enquiries;
    }

    async deleteEnquiryById(id: number): Promise<void> {
        const enquiry = await this.prismaClient.enquiry.update({
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

    async updateEnquiryById(id: number, enquiry: Enquiry): Promise<Enquiry> {
        const updatedEnquiry = await this.prismaClient.enquiry.update({
            where: {
                id: id,
                deleted: 0,
            },
            data: {
                name: enquiry.name,
                email: enquiry.email,
                companyName: enquiry.companyName,
                phoneNo: enquiry.phoneNo,
                comment: enquiry.comment,
                statusId: enquiry.statusId,
                updatedAt: enquiry.updatedAt,
                updatedBy: enquiry.updatedBy,
                deleted: enquiry.deleted,
            },
        });

        return updatedEnquiry;
    }
}