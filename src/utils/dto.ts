import { Prisma } from '@prisma/client';
import { ApiError } from './apiError';

export type FormattedResponse = {
    status: number,
    message: string,
    data: any
}

export class Dto {
    dataToResp(status: number, message: string, data: any): FormattedResponse {
        return {
            status: status,
            message: message,
            data: data
        };
    }

    dataToError(source: string, err: any): ApiError {
        if (err instanceof ApiError) {
            console.log(`[${source}] API error: ${err.message}`);
            throw err;
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

            throw new ApiError(errorMsg, 1);
        }

        if (err instanceof Error) {
            console.log(`[${source}] Error: ${err.message}`);
            throw new ApiError(`${err.message}`, 2);
        }

        console.log(`[${source}] Unknown Error: ${err.message}`);
        throw new ApiError(`An unknown error occurred`, 99);
    }
}