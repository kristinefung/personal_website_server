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
        const createdEnquiry = await this.prismaClient.enquiryModel.create({
            data: {
                name: enquiry.name || "",
                email: enquiry.email || "",
                company_name: enquiry.company_name || "",
                phone_no: enquiry.phone_no || "",
                comment: enquiry.comment || "",
                status_id: enquiry.status_id || 0,

                created_at: enquiry.created_at || new Date(),
                created_by: enquiry.created_by || 0,
                updated_at: enquiry.updated_at || new Date(),
                updated_by: enquiry.updated_by || 0,
                deleted: enquiry.deleted || 0,
            },
        });

        return new Enquiry(createdEnquiry);
    }

    async getEnquiryById(id: number): Promise<Enquiry | null> {
        const enquiry = await this.prismaClient.enquiryModel.findUnique({
            where: {
                id: id,
                deleted: 0
            },
        });
        return enquiry ? new Enquiry(enquiry) : null;
    }

    async getAllEnquiries(): Promise<Enquiry[]> {
        const enquirys = await this.prismaClient.enquiryModel.findMany({
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
                        mode: 'insensitive',
                    },
                });
            }
        };

        addCondition('name', enquiry.name);
        addCondition('email', enquiry.email);
        addCondition('phone_no', enquiry.phone_no);
        addCondition('status_id', enquiry.status_id);

        const enquirys = await this.prismaClient.enquiryModel.findMany({
            where: {
                AND: conditions,
            },
        });

        return enquirys.map(enquiry => new Enquiry(enquiry));
    }

    async deleteEnquiryById(id: number): Promise<void> {
        const enquiry = await this.prismaClient.enquiryModel.update({
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
        const updatedEnquiry = await this.prismaClient.enquiryModel.update({
            where: {
                id: id,
                deleted: 0,
            },
            data: {
                name: enquiry.name || undefined,
                email: enquiry.email || undefined,
                company_name: enquiry.company_name || undefined,
                phone_no: enquiry.phone_no || undefined,
                comment: enquiry.comment || undefined,
                status_id: enquiry.status_id || undefined,
                created_at: enquiry.created_at || undefined,
                created_by: enquiry.created_by || undefined,
                updated_at: enquiry.updated_at || undefined,
                updated_by: enquiry.updated_by || undefined,
                deleted: enquiry.deleted || undefined,
            },
        });

        return new Enquiry(updatedEnquiry);
    }
}