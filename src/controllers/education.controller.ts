import { Request, Response } from 'express';
import { EducationService } from '../services/education.service';
import { AuthService } from '../services/auth.service';
import { jsonResponse } from '../utils/jsonResponse';
import { Education } from '../entities/education.entity';
import { UserRole } from '../utils/enum';

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
        try {
            await this.authServ.authUser([UserRole.ADMIN], req.headers.authorization);

            // Step 1: Call service to handle business logic
            const educationReq = new Education(req.body);
            const createdEducation = await this.educationServ.createEducation(educationReq);

            // Step 2: return success response
            return jsonResponse(res, { education: createdEducation }, null);
        } catch (err) {
            return jsonResponse(res, {}, err);
        }
    }

    async getEducationById(req: Request, res: Response) {
        try {
            // Step 1: Call service to handle business logic
            const educationId = parseInt(req.params.id);
            const education = await this.educationServ.getEducationById(educationId);

            // Step 2: return success response
            return jsonResponse(res, { education: education }, null);
        } catch (err) {
            return jsonResponse(res, {}, err);
        }
    }

    async getAllEducations(req: Request, res: Response) {
        try {
            const educations = await this.educationServ.getAllEducations();
            return jsonResponse(res, { educations: educations }, null);
        } catch (err) {
            return jsonResponse(res, {}, err);
        }
    }

    async deleteEducationById(req: Request, res: Response) {
        try {
            await this.authServ.authUser([UserRole.ADMIN], req.headers.authorization);

            const educationId = parseInt(req.params.id);
            await this.educationServ.deleteEducationById(educationId);
            return jsonResponse(res, {}, null);
        } catch (err) {
            return jsonResponse(res, {}, err);
        }
    }

    async updateEducationById(req: Request, res: Response) {
        try {
            await this.authServ.authUser([UserRole.ADMIN], req.headers.authorization);

            const educationReq = new Education(req.body);
            const educationId = parseInt(req.params.id);
            const education = await this.educationServ.updateEducationById(educationId, educationReq);
            return jsonResponse(res, { education: education }, null);
        } catch (err) {
            return jsonResponse(res, {}, err);
        }
    }

}