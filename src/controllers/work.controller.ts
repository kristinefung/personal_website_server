import { Request, Response } from 'express';
import { WorkService } from '../services/work.service';
import { AuthService } from '../services/auth.service';
import { jsonResponse } from '../utils/jsonResponse';
import { UserRole } from '@prisma/client';
import { CreateWorkRequestDto, GetWorkByIdRequestDto, GetAllWorksRequestDto, DeleteWorkRequestDto, UpdateWorkByIdRequestDto } from '../dtos/work.dto';

export interface IWorkController {
    createWork(req: Request, res: Response): void;
    getWorkById(req: Request, res: Response): void;
    getAllWorks(req: Request, res: Response): void;
    deleteWorkById(req: Request, res: Response): void;
    updateWorkById(req: Request, res: Response): void;
}

export class WorkController implements IWorkController {
    constructor(
        private workServ: WorkService,
        private authServ: AuthService
    ) { }

    async createWork(req: Request, res: Response) {
        try {
            const actionUserId = await this.authServ.authUser([UserRole.ADMIN], req.headers.authorization);

            // Step 1: Call service to handle business logic
            const workReq = new CreateWorkRequestDto(req.body);
            const createdWork = await this.workServ.createWork(workReq, actionUserId);

            // Step 2: return success response
            return jsonResponse(res, { work: createdWork }, null);
        } catch (err) {
            return jsonResponse(res, {}, err);
        }
    }

    async getWorkById(req: Request, res: Response) {
        try {
            await this.authServ.authUser([UserRole.ADMIN], req.headers.authorization);

            // Step 1: Call service to handle business logic
            const workId = parseInt(req.params.id);
            const workReq = new GetWorkByIdRequestDto({ id: workId });
            const work = await this.workServ.getWorkById(workReq);

            // Step 2: return success response
            return jsonResponse(res, { work: work }, null);
        } catch (err) {
            return jsonResponse(res, {}, err);
        }
    }

    async getAllWorks(req: Request, res: Response) {
        try {
            await this.authServ.authUser([UserRole.ADMIN], req.headers.authorization);

            const worksReq = new GetAllWorksRequestDto(req.body);
            const works = await this.workServ.getAllWorks(worksReq);
            return jsonResponse(res, { works: works }, null);
        } catch (err) {
            return jsonResponse(res, {}, err);
        }
    }

    async deleteWorkById(req: Request, res: Response) {
        try {
            const actionUserId = await this.authServ.authUser([UserRole.ADMIN], req.headers.authorization);

            const workId = parseInt(req.params.id);
            const deleteWorkReq = new DeleteWorkRequestDto({ id: workId });
            await this.workServ.deleteWorkById(deleteWorkReq, actionUserId);
            return jsonResponse(res, {}, null);
        } catch (err) {
            return jsonResponse(res, {}, err);
        }
    }

    async updateWorkById(req: Request, res: Response) {
        try {
            const actionUserId = await this.authServ.authUser([UserRole.ADMIN], req.headers.authorization);

            const workId = parseInt(req.params.id);
            const updateWorkReq = new UpdateWorkByIdRequestDto({ id: workId, work: req.body });
            const work = await this.workServ.updateWorkById(updateWorkReq, actionUserId);
            return jsonResponse(res, { work: work }, null);
        } catch (err) {
            return jsonResponse(res, {}, err);
        }
    }
}