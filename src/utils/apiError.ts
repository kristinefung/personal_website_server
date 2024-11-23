export class ApiError extends Error {
    public status_code: string;
    public message: string;

    constructor(message: string, status_code: string) {
        super(message);
        this.status_code = status_code;
        this.message = message;

        Object.setPrototypeOf(this, ApiError.prototype);
    }
}