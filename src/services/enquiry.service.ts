import { EnquiryRepository } from '../repositories/enquiry.repository';
import { Enquiry } from '../entities/enquiry.entity';

import { ApiError } from '../utils/err';
import { ApiStatusCode } from '../utils/enum';

export interface IEnquiryService {
    createEnquiry(enquiryReq: Enquiry): Promise<Enquiry>;
    getEnquiryById(enquiryId: number): Promise<Enquiry>;
    getAllEnquiries(): Promise<Enquiry[]>;
    deleteEnquiryById(enquiryId: number): Promise<void>;
    updateEnquiryById(enquiryId: number, enquiryReq: Enquiry): Promise<Enquiry>;
    searchEnquiries(enquiryReq: Enquiry): Promise<Enquiry[]>;
}

export class EnquiryService implements IEnquiryService {
    constructor(
        private enquiryRepo: EnquiryRepository,
    ) { }

    async createEnquiry(enquiryReq: Enquiry): Promise<Enquiry> {
        // Step 1: Validate input
        let enquiry = enquiryReq.createEnquiry();

        // Step 2: Insert enquiry into database
        const enquiryRes = await this.enquiryRepo.createEnquiry(enquiry);

        // TODO: Step 3: Send notification email to admin

        return enquiryRes;
    }

    async getEnquiryById(enquiryId: number): Promise<Enquiry> {
        const enquiry = await this.enquiryRepo.getEnquiryById(enquiryId);
        if (!enquiry) {
            throw new ApiError("Enquiry not existed", ApiStatusCode.INVALID_ARGUMENT, 400);
        }
        return enquiry;
    }

    async getAllEnquiries(): Promise<Enquiry[]> {
        const enquiries = await this.enquiryRepo.getAllEnquiries();
        return enquiries;
    }

    async deleteEnquiryById(enquiryId: number): Promise<void> {
        await this.enquiryRepo.deleteEnquiryById(enquiryId);
        return;
    }

    async updateEnquiryById(enquiryId: number, enquiryReq: Enquiry): Promise<Enquiry> {
        // Step 0: Data validation
        let enquiry = enquiryReq.updateEnquiry();

        // Step 1: Update enquiry into database
        const enquiryRes = await this.enquiryRepo.updateEnquiryById(enquiryId, enquiry);

        return enquiryRes;
    }

    async searchEnquiries(enquiryReq: Enquiry): Promise<Enquiry[]> {
        const enquiries = await this.enquiryRepo.searchEnquiries(enquiryReq);
        return enquiries;
    }
}