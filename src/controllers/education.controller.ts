import { v4 as uuidv4 } from 'uuid';
import { Request, Response } from 'express';
import { EducationService } from 'src/services/education.service';
import { AuthService } from 'src/services/auth.service';
import { jsonResponse } from 'src/utils/jsonResponse';
import { Education, UserRole, Work } from '@prisma/client';
import { CreateEducationRequestDto, GetEducationByIdRequestDto, GetAllEducationsRequestDto, DeleteEducationRequestDto, UpdateEducationByIdRequestDto } from 'src/dtos/education.dto';

export interface IEducationController {
    createEducation(req: Request, res: Response): void;
    getEducationById(req: Request, res: Response): void;
    getAllEducations(req: Request, res: Response): void;
    deleteEducationById(req: Request, res: Response): void;
    updateEducationById(req: Request, res: Response): void;
}

export class EducationController implements IEducationController {
    constructor(
        private educationServ: EducationService,
        private authServ: AuthService
    ) { }

    async createEducation(req: Request, res: Response) {
        const traceId = uuidv4();
        try {
            const actionUserId = await this.authServ.authUser([UserRole.ADMIN], req.headers.authorization);

            // Step 1: Call service to handle business logic
            const educationReq = new CreateEducationRequestDto(req.body);
            const createdEducation = await this.educationServ.createEducation(educationReq, actionUserId);

            // Step 2: return success response
            return jsonResponse(req, res, traceId, { education: createdEducation }, null);
        } catch (err) {
            return jsonResponse(req, res, traceId, {}, err);
        }
    }

    async getEducationById(req: Request, res: Response) {
        const traceId = uuidv4();
        try {

            // Step 1: Call service to handle business logic
            const educationId = parseInt(req.params.id);
            const educationReq = new GetEducationByIdRequestDto({ id: educationId });
            const data = await this.educationServ.getEducationById(educationReq);

            // Step 2: return success response
            return jsonResponse(req, res, traceId, data, null);
        } catch (err) {
            return jsonResponse(req, res, traceId, {}, err);
        }
    }

    async getAllEducations(req: Request, res: Response) {
        const traceId = uuidv4();
        try {

            const educationsReq = new GetAllEducationsRequestDto({
                limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
                offset: req.query.offset ? parseInt(req.query.offset as string) : undefined,
                orderBy: req.query.orderBy && typeof req.query.orderBy === 'string' ? {
                    field: req.query.orderBy as keyof Education,
                    direction: (req.query.orderDirection as 'asc' | 'desc') || 'asc'
                } : undefined
            });
            const data = await this.educationServ.getAllEducations(educationsReq);
            return jsonResponse(req, res, traceId, data, null);
        } catch (err) {
            return jsonResponse(req, res, traceId, {}, err);
        }
    }

    async deleteEducationById(req: Request, res: Response) {
        const traceId = uuidv4();
        try {
            const actionUserId = await this.authServ.authUser([UserRole.ADMIN], req.headers.authorization);

            const educationId = parseInt(req.params.id);
            const deleteEducationReq = new DeleteEducationRequestDto({ id: educationId });
            await this.educationServ.deleteEducationById(deleteEducationReq, actionUserId);
            return jsonResponse(req, res, traceId, {}, null);
        } catch (err) {
            return jsonResponse(req, res, traceId, {}, err);
        }
    }

    async updateEducationById(req: Request, res: Response) {
        const traceId = uuidv4();
        try {
            const actionUserId = await this.authServ.authUser([UserRole.ADMIN], req.headers.authorization);

            const educationId = parseInt(req.params.id);
            const updateEducationReq = new UpdateEducationByIdRequestDto({ id: educationId, education: req.body });
            const data = await this.educationServ.updateEducationById(updateEducationReq, actionUserId);
            return jsonResponse(req, res, traceId, data, null);
        } catch (err) {
            return jsonResponse(req, res, traceId, {}, err);
        }
    }
}