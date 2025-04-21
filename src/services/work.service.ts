import { WorkRepository } from 'src/repositories/work.repository';
import { CreateWorkRequestDto, CreateWorkResponseDto, GetWorkByIdRequestDto, GetWorkByIdResponseDto, GetAllWorksRequestDto, GetAllWorksResponseDto, DeleteWorkRequestDto, DeleteWorkResponseDto, UpdateWorkByIdRequestDto, UpdateWorkByIdResponseDto } from 'src/dtos/work.dto';

import { ApiError } from 'src/utils/err';
import { ApiStatusCode } from 'src/utils/enum';

export interface IWorkService {
    createWork(req: CreateWorkRequestDto, actionUserId: number): Promise<CreateWorkResponseDto>;
    getWorkById(req: GetWorkByIdRequestDto): Promise<GetWorkByIdResponseDto>;
    getAllWorks(req: GetAllWorksRequestDto): Promise<GetAllWorksResponseDto>;
    deleteWorkById(req: DeleteWorkRequestDto, actionUserId: number): Promise<DeleteWorkResponseDto>;
    updateWorkById(req: UpdateWorkByIdRequestDto, actionUserId: number): Promise<UpdateWorkByIdResponseDto>;
}

export class WorkService implements IWorkService {
    constructor(
        private workRepo: WorkRepository
    ) { }

    async createWork(req: CreateWorkRequestDto, actionUserId: number): Promise<CreateWorkResponseDto> {
        // Step 0: Data validation
        let validatedReq = req.validate();

        // Step 1: Insert work into database
        const createdWorkId = await this.workRepo.createWork({
            title: validatedReq.title,
            companyName: validatedReq.companyName,
            description: validatedReq.description,
            startMonth: validatedReq.startMonth,
            startYear: validatedReq.startYear,
            endMonth: validatedReq.endMonth,
            endYear: validatedReq.endYear,
            isCurrent: validatedReq.isCurrent,
            createdBy: actionUserId,
        });

        return new CreateWorkResponseDto({
            id: createdWorkId,
        });
    }

    async getWorkById(req: GetWorkByIdRequestDto): Promise<GetWorkByIdResponseDto> {
        // Step 0: Data validation
        let validatedReq = req.validate();

        // Step 1: Get work from database
        const work = await this.workRepo.getWorkById(validatedReq.id);
        if (!work) {
            throw new ApiError("Work not found", ApiStatusCode.INVALID_ARGUMENT, 404);
        }

        return new GetWorkByIdResponseDto({
            work: {
                id: work.id,
                title: work.title,
                description: work.description,
                companyName: work.companyName,
                startMonth: work.startMonth,
                startYear: work.startYear,
                endMonth: work.endMonth ?? undefined,
                endYear: work.endYear ?? undefined,
                isCurrent: work.isCurrent,
            }
        });
    }

    async getAllWorks(req: GetAllWorksRequestDto): Promise<GetAllWorksResponseDto> {
        // Step 0: Data validation
        let validatedReq = req.validate();

        // Step 1: Get all works from database
        const dbRes = await this.workRepo.getAllWorks({
            offset: validatedReq.offset,
            limit: validatedReq.limit,
            orderBy: validatedReq.orderBy ? validatedReq.orderBy.field : undefined,
            orderDirection: validatedReq.orderBy?.direction,
        });

        return new GetAllWorksResponseDto({
            works: dbRes.works.map((work) => ({
                id: work.id,
                title: work.title,
                description: work.description,
                companyName: work.companyName,
                startMonth: work.startMonth,
                startYear: work.startYear,
                endMonth: work.endMonth ?? undefined,
                endYear: work.endYear ?? undefined,
                isCurrent: work.isCurrent,
            })),
            total: dbRes.total,
        });
    }

    async deleteWorkById(req: DeleteWorkRequestDto, actionUserId: number): Promise<DeleteWorkResponseDto> {
        // Step 0: Data validation
        let validatedReq = req.validate();

        // Step 1: Delete work from database
        await this.workRepo.deleteWorkById(validatedReq.id);

        return new DeleteWorkResponseDto({
            id: validatedReq.id,
        });
    }

    async updateWorkById(req: UpdateWorkByIdRequestDto, actionUserId: number): Promise<UpdateWorkByIdResponseDto> {
        // Step 0: Data validation
        let validatedReq = req.validate();

        // Step 1: Check if work exists
        const existingWork = await this.workRepo.getWorkById(validatedReq.id);
        if (!existingWork) {
            throw new ApiError("Work not found", ApiStatusCode.INVALID_ARGUMENT, 404);
        }

        // Step 2: Update work in database
        const updatedWork = await this.workRepo.updateWorkById(validatedReq.id, {
            title: validatedReq.work.title,
            companyName: validatedReq.work.companyName,
            description: validatedReq.work.description,
            startMonth: validatedReq.work.startMonth,
            startYear: validatedReq.work.startYear,
            endMonth: validatedReq.work.endMonth,
            endYear: validatedReq.work.endYear,
            isCurrent: validatedReq.work.isCurrent,
            updatedBy: actionUserId,
        });

        return new UpdateWorkByIdResponseDto({
            work: {
                id: updatedWork.id,
                title: updatedWork.title,
                description: updatedWork.description,
                companyName: updatedWork.companyName,
                startMonth: updatedWork.startMonth,
                startYear: updatedWork.startYear,
                endMonth: updatedWork.endMonth ?? undefined,
                endYear: updatedWork.endYear ?? undefined,
                isCurrent: updatedWork.isCurrent,
            }
        });
    }
}