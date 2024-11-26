import { PrismaClient } from '@prisma/client';
import { Enquiry } from '../entities/enquiry.entity';

export interface IEnquiryRepository {
    createEnquiry(enquiry: Enquiry): Promise<Enquiry>;
    getEnquiryById(id: number): Promise<Enquiry | null>;
    getAllEnquiries(): Promise<Enquiry[]>;
    searchEnquiries(enquiry: Enquiry): Promise<Enquiry[]>
    deleteEnquiryById(id: number): Promise<void>;
    updateEnquiryById(id: number, enquiry: Enquiry): Promise<Enquiry>;
}

export class EnquiryRepository implements IEnquiryRepository {
    constructor(
        private prismaClient: PrismaClient
    ) { }

    async createEnquiry(enquiry: Enquiry): Promise<Enquiry> {
        const createdEnquiry = await this.prismaClient.enquiry.create({
            data: {
                name: enquiry.name ?? "",
                email: enquiry.email ?? "",
                companyName: enquiry.companyName ?? "",
                phoneNo: enquiry.phoneNo ?? "",
                comment: enquiry.comment ?? "",
                statusId: enquiry.statusId ?? 0,

                createdAt: enquiry.createdAt ?? new Date(),
                createdBy: enquiry.createdBy ?? 0,
                updatedAt: enquiry.updatedAt ?? new Date(),
                updatedBy: enquiry.updatedBy ?? 0,
                deleted: enquiry.deleted ?? 0,
            },
        });

        return new Enquiry(createdEnquiry);
    }

    async getEnquiryById(id: number): Promise<Enquiry | null> {
        const enquiry = await this.prismaClient.enquiry.findUnique({
            where: {
                id: id,
                deleted: 0
            },
        });
        return enquiry ? new Enquiry(enquiry) : null;
    }

    async getAllEnquiries(): Promise<Enquiry[]> {
        const enquirys = await this.prismaClient.enquiry.findMany({
            where: {
                deleted: 0
            },
        });
        return enquirys.map(enquiry => new Enquiry(enquiry));
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

        const enquirys = await this.prismaClient.enquiry.findMany({
            where: {
                AND: conditions,
            },
        });

        return enquirys.map(enquiry => new Enquiry(enquiry));
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
                name: enquiry.name ?? undefined,
                email: enquiry.email ?? undefined,
                companyName: enquiry.companyName ?? undefined,
                phoneNo: enquiry.phoneNo ?? undefined,
                comment: enquiry.comment ?? undefined,
                statusId: enquiry.statusId ?? undefined,
                createdAt: enquiry.createdAt ?? undefined,
                createdBy: enquiry.createdBy ?? undefined,
                updatedAt: enquiry.updatedAt ?? undefined,
                updatedBy: enquiry.updatedBy ?? undefined,
                deleted: enquiry.deleted ?? undefined,
            },
        });

        return new Enquiry(updatedEnquiry);
    }
}