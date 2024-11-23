export class ValidationResult<T> {
    public success: boolean;
    public data?: T;
    public errors?: string[];

    constructor(success: boolean, data?: T, errors?: string[]) {
        this.success = success;
        this.data = data;
        this.errors = errors;
    }
}