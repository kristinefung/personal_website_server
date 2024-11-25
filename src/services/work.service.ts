import { WorkRepository } from '../repositories/work.repository';
import { Work } from '../entities/work.entity';

import { ApiError } from '../utils/err';
import { ApiStatusCode } from '../utils/enum';

export interface IWorkService {
    createWork(workReq: Work): Promise<Work>;
    getWorkById(workId: number): Promise<Work>;
    getAllWorks(): Promise<Work[]>;
    deleteWorkById(workId: number): Promise<void>;
    updateWorkById(workId: number, workReq: Work): Promise<Work>;
}

export class WorkService implements IWorkService {
    constructor(
        private workRepo: WorkRepository,
    ) { }

    async createWork(workReq: Work): Promise<Work> {
        // Step 1: Validate input
        let work = workReq.createWork();

        // Step 2: Insert work into database
        const workRes = await this.workRepo.createWork(work);

        return workRes;
    }

    async getWorkById(workId: number): Promise<Work> {
        const work = await this.workRepo.getWorkById(workId);
        if (!work) {
            throw new ApiError("Work not existed", ApiStatusCode.INVALID_ARGUMENT, 400);
        }
        return work;
    }

    async getAllWorks(): Promise<Work[]> {
        const works = await this.workRepo.getAllWorks();
        return works;
    }

    async deleteWorkById(workId: number): Promise<void> {
        await this.workRepo.deleteWorkById(workId);
        return;
    }

    async updateWorkById(workId: number, workReq: Work): Promise<Work> {
        // Step 0: Data validation
        let work = workReq.updateWork();

        // Step 1: Update work into database
        const workRes = await this.workRepo.updateWorkById(workId, work);

        return workRes;
    }
}