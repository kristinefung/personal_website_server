import { Response } from 'express';
import * as Err from './Err';
import { API_STATUS_CODE } from './enum';

type FormattedResponse = {
    status_code: string,
    message: string,
    data: any
}

function formattedResponse(status_code: string, message: string, data: any): FormattedResponse {
    return {
        status_code: status_code,
        message: message,
        data: data
    };
}

export function jsonResponse(res: Response, data: any, err?: any) {
    console.log(err);
    if (err instanceof Err.ApiError) {
        res.status(err.http_status).json(formattedResponse(err.status_code, err.message, data));
        return;
    }

    if (err instanceof Err.ZodError) {
        res.status(400).json(formattedResponse(API_STATUS_CODE.INVALID_ARGUMENT, err.message, data));
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
                errorMsg = `Error in database query`;
        }

        res.status(500).json(formattedResponse(API_STATUS_CODE.DATABASE_ERROR, errorMsg, data));
        return;
    }

    if (err instanceof Error) {
        res.status(500).json(formattedResponse(API_STATUS_CODE.SYSTEM_ERROR, err.message, data));
        return;
    }

    if (err) {
        res.status(500).json(formattedResponse(API_STATUS_CODE.UNKNOWN_ERROR, "An unknown error occurred", data));
        return;
    }

    res.status(200).json(formattedResponse(API_STATUS_CODE.SUCCESS, "Success", data));
    return;
}
