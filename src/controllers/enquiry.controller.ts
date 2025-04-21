import { Request, Response } from 'express';
import { EnquiryService } from '../services/enquiry.service';
import { AuthService } from '../services/auth.service';
import { jsonResponse } from '../utils/jsonResponse';
import { UserRole, Enquiry } from '@prisma/client';
import { CreateEnquiryRequestDto, GetEnquiryByIdRequestDto, GetAllEnquiriesRequestDto, DeleteEnquiryRequestDto, UpdateEnquiryByIdRequestDto } from '../dtos/enquiry.dto';

export interface IEnquiryController {
    createEnquiry(req: Request, res: Response): void;
    getEnquiryById(req: Request, res: Response): void;
    getAllEnquiries(req: Request, res: Response): void;
    deleteEnquiryById(req: Request, res: Response): void;
    updateEnquiryById(req: Request, res: Response): void;
}

export class EnquiryController implements IEnquiryController {
    constructor(
        private enquiryServ: EnquiryService,
        private authServ: AuthService,
    ) { }

    async createEnquiry(req: Request, res: Response) {
        try {
            // Step 1: Create enquiry request DTO
            const enquiryReq = new CreateEnquiryRequestDto(req.body);

            // Step 2: Call service to handle business logic
            const createdEnquiry = await this.enquiryServ.createEnquiry(enquiryReq, 9999); // TODO: Get actual user ID

            // Step 3: Return success response
            return jsonResponse(res, { id: createdEnquiry.id }, null);
        } catch (err) {
            return jsonResponse(res, {}, err);
        }
    }

    async getEnquiryById(req: Request, res: Response) {
        try {
            // Step 1: Create get enquiry request DTO
            const enquiryReq = new GetEnquiryByIdRequestDto({ id: parseInt(req.params.id) });

            // Step 2: Call service to handle business logic
            const enquiry = await this.enquiryServ.getEnquiryById(enquiryReq);

            // Step 3: Return success response
            return jsonResponse(res, { enquiry: enquiry.enquiry }, null);
        } catch (err) {
            return jsonResponse(res, {}, err);
        }
    }

    async getAllEnquiries(req: Request, res: Response) {
        try {
            // Step 1: Create get all enquiries request DTO
            const enquiryReq = new GetAllEnquiriesRequestDto({
                limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
                offset: req.query.offset ? parseInt(req.query.offset as string) : undefined,
                orderBy: req.query.orderBy && typeof req.query.orderBy === 'string' ? {
                    field: req.query.orderBy as keyof Enquiry,
                    direction: (req.query.orderDirection as 'asc' | 'desc') || 'asc'
                } : undefined
            });

            // Step 2: Call service to handle business logic
            const enquiries = await this.enquiryServ.getAllEnquiries(enquiryReq);

            // Step 3: Return success response
            return jsonResponse(res, { enquiries: enquiries.enquiries, total: enquiries.total }, null);
        } catch (err) {
            return jsonResponse(res, {}, err);
        }
    }

    async deleteEnquiryById(req: Request, res: Response) {
        try {
            // Step 1: Authenticate user
            const actionUserId = await this.authServ.authUser([UserRole.ADMIN], req.headers.authorization);

            // Step 2: Create delete enquiry request DTO
            const enquiryReq = new DeleteEnquiryRequestDto({ id: parseInt(req.params.id) });

            // Step 3: Call service to handle business logic
            await this.enquiryServ.deleteEnquiryById(enquiryReq, actionUserId);

            // Step 4: Return success response
            return jsonResponse(res, {}, null);
        } catch (err) {
            return jsonResponse(res, {}, err);
        }
    }

    async updateEnquiryById(req: Request, res: Response) {
        try {
            // Step 1: Authenticate user
            const actionUserId = await this.authServ.authUser([UserRole.ADMIN], req.headers.authorization);

            // Step 2: Create update enquiry request DTO
            const enquiryReq = new UpdateEnquiryByIdRequestDto({
                id: parseInt(req.params.id),
                enquiry: req.body
            });

            // Step 3: Call service to handle business logic
            const updatedEnquiry = await this.enquiryServ.updateEnquiryById(enquiryReq, actionUserId);

            // Step 4: Return success response
            return jsonResponse(res, {}, null);
        } catch (err) {
            return jsonResponse(res, {}, err);
        }
    }
}