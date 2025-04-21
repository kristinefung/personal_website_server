import { v4 as uuidv4 } from 'uuid';
import { Request, Response } from 'express';
import { EducationService } from '../services/education.service';
import { AuthService } from '../services/auth.service';
import { jsonResponse } from '../utils/jsonResponse';
import { UserRole } from '@prisma/client';
import { CreateEducationRequestDto, GetEducationByIdRequestDto, GetAllEducationsRequestDto, DeleteEducationRequestDto, UpdateEducationByIdRequestDto } from '../dtos/education.dto';

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
            await this.authServ.authUser([UserRole.ADMIN], req.headers.authorization);

            // Step 1: Call service to handle business logic
            const educationId = parseInt(req.params.id);
            const educationReq = new GetEducationByIdRequestDto({ id: educationId });
            const education = await this.educationServ.getEducationById(educationReq);

            // Step 2: return success response
            return jsonResponse(req, res, traceId, { education: education }, null);
        } catch (err) {
            return jsonResponse(req, res, traceId, {}, err);
        }
    }

    async getAllEducations(req: Request, res: Response) {
        const traceId = uuidv4();
        try {
            await this.authServ.authUser([UserRole.ADMIN], req.headers.authorization);

            const educationsReq = new GetAllEducationsRequestDto(req.body);
            const educations = await this.educationServ.getAllEducations(educationsReq);
            return jsonResponse(req, res, traceId, { educations: educations }, null);
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
            const education = await this.educationServ.updateEducationById(updateEducationReq, actionUserId);
            return jsonResponse(req, res, traceId, { education: education }, null);
        } catch (err) {
            return jsonResponse(req, res, traceId, {}, err);
        }
    }
}