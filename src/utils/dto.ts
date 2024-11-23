import { Prisma } from '@prisma/client';
import { ApiError } from './apiError';
import { ZodError } from 'zod'
import { API_STATUS_CODE } from './enum';

export type FormattedResponse = {
    status_code: string,
    message: string,
    data: any
}

export class Dto {
    dataToResp(status_code: string, message: string, data: any): FormattedResponse {
        return {
            status_code: status_code,
            message: message,
            data: data
        };
    }

    dataToError(source: string, err: any): ApiError {
        if (err instanceof ApiError) {
            console.log(`[${source}] API error: ${err.message}`);
            throw err;
        }

        if (err instanceof ZodError || (err as ZodError).name === 'ZodError') {
            console.log(`[${source}] Input error: ${err.message}`);
            throw new ApiError(err.message, API_STATUS_CODE.INVALID_ARGUMENT, 400);
        }

        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            console.log(`[${source}] Prisma error: ${err.message}`);
            let errorMsg = "";
            switch (err.code) {
                case 'P2002': // handling duplicate key errors
                    errorMsg = `Duplicate field value: ${err.meta?.target}`;
                    break;
                case 'P2014': // handling invalid id errors
                    errorMsg = `Invalid ID: ${err.meta?.target}`;
                    break;
                case 'P2003': // handling invalid data errors
                    errorMsg = `Invalid input data: ${err.meta?.target}`;
                    break;
                default: // handling all other errors
                    errorMsg = `Error in database query`;
            }

            throw new ApiError(errorMsg, API_STATUS_CODE.DATABASE_ERROR, 500);
        }

        if (err instanceof Error) {
            console.log(`[${source}] Error: ${err.message}`);
            throw new ApiError(`${err.message}`, API_STATUS_CODE.SYSTEM_ERROR, 500);
        }

        console.log(`[${source}] Unknown Error: ${err.message}`);
        throw new ApiError(`An unknown error occurred`, API_STATUS_CODE.UNKNOWN_ERROR, 500);
    }
}