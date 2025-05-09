import { v4 as uuidv4 } from 'uuid';
import { Request, Response } from 'express';
import { WorkService } from 'src/services/work.service';
import { AuthService } from 'src/services/auth.service';
import { jsonResponse } from 'src/utils/jsonResponse';
import { UserRole, Work } from '@prisma/client';
import { CreateWorkRequestDto, GetWorkByIdRequestDto, GetAllWorksRequestDto, DeleteWorkRequestDto, UpdateWorkByIdRequestDto } from 'src/dtos/work.dto';

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
        const traceId = uuidv4();
        try {
            const actionUserId = await this.authServ.authUser([UserRole.ADMIN], req.headers.authorization);

            // Step 1: Call service to handle business logic
            const workReq = new CreateWorkRequestDto(req.body);
            const data = await this.workServ.createWork(workReq, actionUserId);

            // Step 2: return success response
            return jsonResponse(req, res, traceId, data, null);
        } catch (err) {
            return jsonResponse(req, res, traceId, {}, err);
        }
    }

    async getWorkById(req: Request, res: Response) {
        const traceId = uuidv4();
        try {

            // Step 1: Call service to handle business logic
            const workId = parseInt(req.params.id);
            const workReq = new GetWorkByIdRequestDto({ id: workId });
            const data = await this.workServ.getWorkById(workReq);

            // Step 2: return success response
            return jsonResponse(req, res, traceId, data, null);
        } catch (err) {
            return jsonResponse(req, res, traceId, {}, err);
        }
    }

    async getAllWorks(req: Request, res: Response) {
        const traceId = uuidv4();
        try {
            // Step 1: Create get all enquiries request DTO
            const worksReq = new GetAllWorksRequestDto({
                limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
                offset: req.query.offset ? parseInt(req.query.offset as string) : undefined,
                orderBy: req.query.orderBy && typeof req.query.orderBy === 'string' ? {
                    field: req.query.orderBy as keyof Work,
                    direction: (req.query.orderDirection as 'asc' | 'desc') || 'asc'
                } : undefined
            });
            const data = await this.workServ.getAllWorks(worksReq);
            return jsonResponse(req, res, traceId, data, null);
        } catch (err) {
            return jsonResponse(req, res, traceId, {}, err);
        }
    }

    async deleteWorkById(req: Request, res: Response) {
        const traceId = uuidv4();
        try {
            const actionUserId = await this.authServ.authUser([UserRole.ADMIN], req.headers.authorization);

            const workId = parseInt(req.params.id);
            const deleteWorkReq = new DeleteWorkRequestDto({ id: workId });
            await this.workServ.deleteWorkById(deleteWorkReq, actionUserId);
            return jsonResponse(req, res, traceId, {}, null);
        } catch (err) {
            return jsonResponse(req, res, traceId, {}, err);
        }
    }

    async updateWorkById(req: Request, res: Response) {
        const traceId = uuidv4();
        try {
            const actionUserId = await this.authServ.authUser([UserRole.ADMIN], req.headers.authorization);

            const workId = parseInt(req.params.id);
            const updateWorkReq = new UpdateWorkByIdRequestDto({ id: workId, work: req.body });
            const data = await this.workServ.updateWorkById(updateWorkReq, actionUserId);
            return jsonResponse(req, res, traceId, data, null);
        } catch (err) {
            return jsonResponse(req, res, traceId, {}, err);
        }
    }
}