import { Request, Response } from 'express';
import { ApiStatusCode } from './enum';
import * as Err from './err';

type FormattedResponse = {
    statusCode: string,
    traceId: string,
    message: string,
    data: object
}

function formattedResponse(statusCode: string, traceId: string, message: string, data: object): FormattedResponse {
    return {
        statusCode: statusCode,
        traceId: traceId,
        message: message,
        data: data
    };
}

export function jsonResponse(req: Request, res: Response, traceId: string, data: object, err?: any) {
    console.log(err);
    if (err instanceof Err.ApiError) {
        res.status(err.http_status).json(formattedResponse(err.status_code, traceId, err.message, data));
        return;
    }

    if (err instanceof Err.ZodError) {
        const errMessage = err.errors[0].message;
        res.status(400).json(formattedResponse(ApiStatusCode.INVALID_ARGUMENT, traceId, errMessage, data));
        return;
    }

    if (err instanceof Err.PrismaClientKnownRequestError) {
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
                errorMsg = `Error in database query: ${err.meta?.cause}`;
        }

        res.status(500).json(formattedResponse(ApiStatusCode.DATABASE_ERROR, traceId, errorMsg, data));
        return;
    }

    if (err instanceof Error) {
        res.status(500).json(formattedResponse(ApiStatusCode.SYSTEM_ERROR, traceId, err.message, data));
        return;
    }

    if (err) {
        res.status(500).json(formattedResponse(ApiStatusCode.UNKNOWN_ERROR, traceId, "An unknown error occurred", data));
        return;
    }

    res.status(200).json(formattedResponse(ApiStatusCode.SUCCESS, traceId, "Success", data));
    return;
}
