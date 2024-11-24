import { EducationRepository } from '../repositories/education.repository';
import { Education } from '../entities/education.entity';

import { ApiError } from '../utils/err';
import { ApiStatusCode } from '../utils/enum';

export interface IEducationService {
    createEducation(educationReq: Education): Promise<Education>;
    getEducationById(educationId: number): Promise<Education>;
    getAllEducations(): Promise<Education[]>;
    deleteEducationById(educationId: number): Promise<void>;
    updateEducationById(educationId: number, educationReq: Education): Promise<Education>;
}

export class EducationService implements IEducationService {
    constructor(
        private educationRepo: EducationRepository,
    ) { }

    async createEducation(educationReq: Education): Promise<Education> {
        // Step 1: Validate input
        let education = educationReq.createEducation();

        // Step 2: Insert education into database
        const educationRes = await this.educationRepo.createEducation(education);

        return educationRes;
    }

    async getEducationById(educationId: number): Promise<Education> {
        const education = await this.educationRepo.getEducationById(educationId);
        if (!education) {
            throw new ApiError("Education not existed", ApiStatusCode.INVALID_ARGUMENT, 400);
        }
        return education;
    }

    async getAllEducations(): Promise<Education[]> {
        const educations = await this.educationRepo.getAllEducations();
        return educations;
    }

    async deleteEducationById(educationId: number): Promise<void> {
        await this.educationRepo.deleteEducationById(educationId);
        return;
    }

    async updateEducationById(educationId: number, educationReq: Education): Promise<Education> {
        // Step 0: Data validation
        let education = educationReq.updateEducation();

        // Step 1: Update education into database
        const educationRes = await this.educationRepo.updateEducationById(educationId, education);

        return educationRes;
    }
}