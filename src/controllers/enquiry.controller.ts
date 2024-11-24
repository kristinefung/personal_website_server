import { Request, Response } from 'express';
import { EnquiryService } from '../services/enquiry.service';
import { AuthService } from '../services/auth.service';
import { jsonResponse } from '../utils/jsonResponse';
import { Enquiry } from '../entities/enquiry.entity';
import { UserRole } from '../utils/enum';

export interface IEnquiryController {
    createEnquiry(req: Request, res: Response): void;
    getEnquiryById(req: Request, res: Response): void;
    getAllEnquiries(req: Request, res: Response): void;
    deleteEnquiryById(req: Request, res: Response): void;
    updateEnquiryById(req: Request, res: Response): void;
    searchEnquiries(req: Request, res: Response): void;
}

export class EnquiryController implements IEnquiryController {
    constructor(
        private enquiryServ: EnquiryService,
        private authServ: AuthService
    ) { }

    async createEnquiry(req: Request, res: Response) {
        try {
            // Step 1: Call service to handle business logic
            const enquiryReq = new Enquiry(req.body);
            const createdEnquiry = await this.enquiryServ.createEnquiry(enquiryReq);

            // Step 2: return success response
            return jsonResponse(res, { enquiry: createdEnquiry }, null);
        } catch (err) {
            return jsonResponse(res, {}, err);
        }
    }

    async getEnquiryById(req: Request, res: Response) {
        try {
            await this.authServ.authUser([UserRole.ADMIN], req.headers.authorization);

            // Step 1: Call service to handle business logic
            const enquiryId = parseInt(req.params.id);
            const enquiry = await this.enquiryServ.getEnquiryById(enquiryId);

            // Step 2: return success response
            return jsonResponse(res, { enquiry: enquiry }, null);
        } catch (err) {
            return jsonResponse(res, {}, err);
        }
    }

    async getAllEnquiries(req: Request, res: Response) {
        try {
            await this.authServ.authUser([UserRole.ADMIN], req.headers.authorization);

            const enquiries = await this.enquiryServ.getAllEnquiries();
            return jsonResponse(res, { enquiries: enquiries }, null);
        } catch (err) {
            return jsonResponse(res, {}, err);
        }
    }

    async deleteEnquiryById(req: Request, res: Response) {
        try {
            await this.authServ.authUser([UserRole.ADMIN], req.headers.authorization);

            const enquiryId = parseInt(req.params.id);
            await this.enquiryServ.deleteEnquiryById(enquiryId);
            return jsonResponse(res, {}, null);
        } catch (err) {
            return jsonResponse(res, {}, err);
        }
    }

    async updateEnquiryById(req: Request, res: Response) {
        try {
            await this.authServ.authUser([UserRole.ADMIN], req.headers.authorization);

            const enquiryReq = new Enquiry(req.body);
            const enquiryId = parseInt(req.params.id);
            const enquiry = await this.enquiryServ.updateEnquiryById(enquiryId, enquiryReq);
            return jsonResponse(res, { enquiry: enquiry }, null);
        } catch (err) {
            return jsonResponse(res, {}, err);
        }
    }

    async searchEnquiries(req: Request, res: Response) {
        try {
            await this.authServ.authUser([UserRole.ADMIN], req.headers.authorization);

            const searchCriterias = new Enquiry(req.body);

            const enquiries = await this.enquiryServ.searchEnquiries(searchCriterias);
            return jsonResponse(res, { enquiries: enquiries }, null);
        } catch (err) {
            return jsonResponse(res, {}, err);
        }
    }

}