import { EducationRepository } from 'src/repositories/education.repository';
import { CreateEducationRequestDto, CreateEducationResponseDto, GetEducationByIdRequestDto, GetEducationByIdResponseDto, GetAllEducationsRequestDto, GetAllEducationsResponseDto, DeleteEducationRequestDto, DeleteEducationResponseDto, UpdateEducationByIdRequestDto, UpdateEducationByIdResponseDto } from 'src/dtos/education.dto';

import { ApiError } from 'src/utils/err';
import { ApiStatusCode } from 'src/utils/enum';

export interface IEducationService {
    createEducation(req: CreateEducationRequestDto, actionUserId: number): Promise<CreateEducationResponseDto>;
    getEducationById(req: GetEducationByIdRequestDto): Promise<GetEducationByIdResponseDto>;
    getAllEducations(req: GetAllEducationsRequestDto): Promise<GetAllEducationsResponseDto>;
    deleteEducationById(req: DeleteEducationRequestDto, actionUserId: number): Promise<DeleteEducationResponseDto>;
    updateEducationById(req: UpdateEducationByIdRequestDto, actionUserId: number): Promise<UpdateEducationByIdResponseDto>;
}

export class EducationService implements IEducationService {
    constructor(
        private educationRepo: EducationRepository
    ) { }

    async createEducation(req: CreateEducationRequestDto, actionUserId: number): Promise<CreateEducationResponseDto> {
        // Step 0: Data validation
        let validatedReq = req.validate();

        // Step 1: Insert education into database
        const createdEducationId = await this.educationRepo.createEducation({
            degree: validatedReq.degree,
            subject: validatedReq.subject,
            schoolName: validatedReq.schoolName,
            description: validatedReq.description,
            startMonth: validatedReq.startMonth,
            startYear: validatedReq.startYear,
            endMonth: validatedReq.endMonth,
            endYear: validatedReq.endYear,
            isCurrent: validatedReq.isCurrent,
            createdBy: actionUserId,
        });

        return new CreateEducationResponseDto({
            id: createdEducationId,
        });
    }

    async getEducationById(req: GetEducationByIdRequestDto): Promise<GetEducationByIdResponseDto> {
        // Step 0: Data validation
        let validatedReq = req.validate();

        // Step 1: Get education from database
        const education = await this.educationRepo.getEducationById(validatedReq.id);
        if (!education) {
            throw new ApiError("Education not found", ApiStatusCode.INVALID_ARGUMENT, 404);
        }

        return new GetEducationByIdResponseDto({
            education: {
                id: education.id,
                degree: education.degree,
                subject: education.subject,
                schoolName: education.schoolName,
                description: education.description,
                startMonth: education.startMonth,
                startYear: education.startYear,
                endMonth: education.endMonth ?? undefined,
                endYear: education.endYear ?? undefined,
                isCurrent: education.isCurrent,
            }
        });
    }

    async getAllEducations(req: GetAllEducationsRequestDto): Promise<GetAllEducationsResponseDto> {
        // Step 0: Data validation
        let validatedReq = req.validate();

        // Step 1: Get all educations from database
        const dbRes = await this.educationRepo.getAllEducations({
            offset: validatedReq.offset,
            limit: validatedReq.limit,
            orderBy: validatedReq.orderBy ? validatedReq.orderBy.field : undefined,
            orderDirection: validatedReq.orderBy?.direction,
        });

        return new GetAllEducationsResponseDto({
            educations: dbRes.educations.map((education) => ({
                id: education.id,
                degree: education.degree,
                subject: education.subject,
                schoolName: education.schoolName,
                description: education.description,
                startMonth: education.startMonth,
                startYear: education.startYear,
                endMonth: education.endMonth ?? undefined,
                endYear: education.endYear ?? undefined,
                isCurrent: education.isCurrent,
            })),
            total: dbRes.total,
        });
    }

    async deleteEducationById(req: DeleteEducationRequestDto, actionUserId: number): Promise<DeleteEducationResponseDto> {
        // Step 0: Data validation
        let validatedReq = req.validate();

        // Step 1: Check if education exists
        const existingEducation = await this.educationRepo.getEducationById(validatedReq.id);
        if (!existingEducation) {
            throw new ApiError("Education not found", ApiStatusCode.INVALID_ARGUMENT, 404);
        }

        // Step 2: Delete education from database
        await this.educationRepo.deleteEducationById(validatedReq.id);

        return new DeleteEducationResponseDto({
            id: validatedReq.id,
        });
    }

    async updateEducationById(req: UpdateEducationByIdRequestDto, actionUserId: number): Promise<UpdateEducationByIdResponseDto> {
        // Step 0: Data validation
        let validatedReq = req.validate();

        // Step 1: Check if education exists
        const existingEducation = await this.educationRepo.getEducationById(validatedReq.id);
        if (!existingEducation) {
            throw new ApiError("Education not found", ApiStatusCode.INVALID_ARGUMENT, 404);
        }

        // Step 2: Update education in database
        const updatedEducation = await this.educationRepo.updateEducationById(validatedReq.id, {
            degree: validatedReq.education.degree,
            subject: validatedReq.education.subject,
            schoolName: validatedReq.education.schoolName,
            description: validatedReq.education.description,
            startMonth: validatedReq.education.startMonth,
            startYear: validatedReq.education.startYear,
            endMonth: validatedReq.education.endMonth,
            endYear: validatedReq.education.endYear,
            isCurrent: validatedReq.education.isCurrent,
            updatedBy: actionUserId,
        });

        return new UpdateEducationByIdResponseDto({
            education: {
                id: updatedEducation.id,
                degree: updatedEducation.degree,
                subject: updatedEducation.subject,
                schoolName: updatedEducation.schoolName,
                description: updatedEducation.description,
                startMonth: updatedEducation.startMonth,
                startYear: updatedEducation.startYear,
                endMonth: updatedEducation.endMonth ?? undefined,
                endYear: updatedEducation.endYear ?? undefined,
                isCurrent: updatedEducation.isCurrent,
            }
        });
    }
}