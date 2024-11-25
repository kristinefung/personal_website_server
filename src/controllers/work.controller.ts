import { Request, Response } from 'express';
import { WorkService } from '../services/work.service';
import { AuthService } from '../services/auth.service';
import { jsonResponse } from '../utils/jsonResponse';
import { Work } from '../entities/work.entity';
import { UserRole } from '../utils/enum';

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
            await this.authServ.authUser([UserRole.ADMIN], req.headers.authorization);

            // Step 1: Call service to handle business logic
            const workReq = new Work(req.body);
            const createdWork = await this.workServ.createWork(workReq);

            // Step 2: return success response
            return jsonResponse(res, { work: createdWork }, null);
        } catch (err) {
            return jsonResponse(res, {}, err);
        }
    }

    async getWorkById(req: Request, res: Response) {
        try {
            // Step 1: Call service to handle business logic
            const workId = parseInt(req.params.id);
            const work = await this.workServ.getWorkById(workId);

            // Step 2: return success response
            return jsonResponse(res, { work: work }, null);
        } catch (err) {
            return jsonResponse(res, {}, err);
        }
    }

    async getAllWorks(req: Request, res: Response) {
        try {
            const works = await this.workServ.getAllWorks();
            return jsonResponse(res, { works: works }, null);
        } catch (err) {
            return jsonResponse(res, {}, err);
        }
    }

    async deleteWorkById(req: Request, res: Response) {
        try {
            await this.authServ.authUser([UserRole.ADMIN], req.headers.authorization);

            const workId = parseInt(req.params.id);
            await this.workServ.deleteWorkById(workId);
            return jsonResponse(res, {}, null);
        } catch (err) {
            return jsonResponse(res, {}, err);
        }
    }

    async updateWorkById(req: Request, res: Response) {
        try {
            await this.authServ.authUser([UserRole.ADMIN], req.headers.authorization);

            const workReq = new Work(req.body);
            const workId = parseInt(req.params.id);
            const work = await this.workServ.updateWorkById(workId, workReq);
            return jsonResponse(res, { work: work }, null);
        } catch (err) {
            return jsonResponse(res, {}, err);
        }
    }

}