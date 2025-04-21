import { EnquiryRepository } from 'src/repositories/enquiry.repository';
import { Enquiry, EnquiryStatus } from '@prisma/client';
import { CreateEnquiryRequestDto, CreateEnquiryResponseDto, GetEnquiryByIdRequestDto, GetEnquiryByIdResponseDto, GetAllEnquiriesRequestDto, GetAllEnquiriesResponseDto, DeleteEnquiryRequestDto, DeleteEnquiryResponseDto, UpdateEnquiryByIdRequestDto, UpdateEnquiryByIdResponseDto } from 'src/dtos/enquiry.dto';
import { ApiError } from 'src/utils/err';
import { ApiStatusCode } from 'src/utils/enum';

export interface IEnquiryService {
    createEnquiry(req: CreateEnquiryRequestDto): Promise<CreateEnquiryResponseDto>;
    getEnquiryById(req: GetEnquiryByIdRequestDto): Promise<GetEnquiryByIdResponseDto>;
    getAllEnquiries(req: GetAllEnquiriesRequestDto): Promise<GetAllEnquiriesResponseDto>;
    deleteEnquiryById(req: DeleteEnquiryRequestDto, actionUserId: number): Promise<DeleteEnquiryResponseDto>;
    updateEnquiryById(req: UpdateEnquiryByIdRequestDto, actionUserId: number): Promise<UpdateEnquiryByIdResponseDto>;
}

export class EnquiryService implements IEnquiryService {
    constructor(
        private enquiryRepo: EnquiryRepository,
    ) { }

    async createEnquiry(req: CreateEnquiryRequestDto): Promise<CreateEnquiryResponseDto> {
        // Step 1: Validate input
        const validatedReq = req.validate();

        // Step 2: Insert enquiry into database
        const createdEnquiryId = await this.enquiryRepo.createEnquiry({
            ...validatedReq,
            statusId: EnquiryStatus.UNHANDLED,
            createdBy: 1,
            createdAt: new Date(),
        });

        // Step 3: Get created enquiry
        const createdEnquiry = await this.enquiryRepo.getEnquiryById(createdEnquiryId);
        if (!createdEnquiry) {
            throw new ApiError("Failed to create enquiry", ApiStatusCode.INVALID_ARGUMENT, 500);
        }

        // TODO: Step 4: Send notification email to admin

        return new CreateEnquiryResponseDto({ id: createdEnquiry.id });
    }

    async getEnquiryById(req: GetEnquiryByIdRequestDto): Promise<GetEnquiryByIdResponseDto> {
        // Step 1: Validate input
        const validatedReq = req.validate();

        // Step 2: Get enquiry from database
        const enquiry = await this.enquiryRepo.getEnquiryById(validatedReq.id);
        if (!enquiry) {
            throw new ApiError("Enquiry not found", ApiStatusCode.INVALID_ARGUMENT, 404);
        }

        return new GetEnquiryByIdResponseDto({
            enquiry: {
                id: enquiry.id,
                name: enquiry.name,
                email: enquiry.email,
                companyName: enquiry.companyName,
                phoneNo: enquiry.phoneNo,
                comment: enquiry.comment,
                statusId: enquiry.statusId,
            }
        });
    }

    async getAllEnquiries(req: GetAllEnquiriesRequestDto): Promise<GetAllEnquiriesResponseDto> {
        // Step 1: Validate input
        const validatedReq = req.validate();

        // Step 2: Get enquiries from database
        const { enquiries, total } = await this.enquiryRepo.getAllEnquiries({
            limit: validatedReq.limit,
            offset: validatedReq.offset,
            orderBy: validatedReq.orderBy?.field,
            orderDirection: validatedReq.orderBy?.direction,
        });

        return new GetAllEnquiriesResponseDto({
            enquiries: enquiries.map(enquiry => ({
                id: enquiry.id,
                name: enquiry.name,
                email: enquiry.email,
                companyName: enquiry.companyName,
                phoneNo: enquiry.phoneNo,
                comment: enquiry.comment,
                statusId: enquiry.statusId,
            })),
            total: total
        });
    }

    async deleteEnquiryById(req: DeleteEnquiryRequestDto, actionUserId: number): Promise<DeleteEnquiryResponseDto> {
        // Step 1: Validate input
        const validatedReq = req.validate();

        // Step 2: Check if enquiry exists
        const existingEnquiry = await this.enquiryRepo.getEnquiryById(validatedReq.id);
        if (!existingEnquiry) {
            throw new ApiError("Enquiry not found", ApiStatusCode.INVALID_ARGUMENT, 404);
        }

        // Step 3: Delete enquiry from database
        await this.enquiryRepo.deleteEnquiryById(validatedReq.id);

        return new DeleteEnquiryResponseDto({
            id: validatedReq.id
        });
    }

    async updateEnquiryById(req: UpdateEnquiryByIdRequestDto, actionUserId: number): Promise<UpdateEnquiryByIdResponseDto> {
        // Step 1: Validate input
        const validatedReq = req.validate();

        // Step 2: Check if enquiry exists
        const existingEnquiry = await this.enquiryRepo.getEnquiryById(validatedReq.id);
        if (!existingEnquiry) {
            throw new ApiError("Enquiry not found", ApiStatusCode.INVALID_ARGUMENT, 404);
        }

        // Step 3: Update enquiry in database
        const updatedEnquiry = await this.enquiryRepo.updateEnquiryById(validatedReq.id, {
            ...existingEnquiry,
            ...validatedReq.enquiry,
            updatedAt: new Date(),
            updatedBy: actionUserId,
        } as Enquiry);

        return new UpdateEnquiryByIdResponseDto({});
    }
}