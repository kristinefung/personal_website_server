import { Prisma } from '@prisma/client';

const PrismaClientKnownRequestError = Prisma.PrismaClientKnownRequestError

export { ZodError } from 'zod'
export { PrismaClientKnownRequestError };
export class ApiError extends Error {
    public message: string;
    public status_code: string;
    public http_status: number;

    constructor(message: string, status_code: string, http_status: number) {
        super(message);
        this.status_code = status_code;
        this.message = message;
        this.http_status = http_status;

        Object.setPrototypeOf(this, ApiError.prototype);
    }
}