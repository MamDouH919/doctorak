export class AppError extends Error {
    statusCode: number;
    type: 'custom' | 'validation-server' | 'internal';

    constructor(message: string, statusCode = 500, type: AppError['type'] = 'internal') {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.type = type;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class ValidationError extends AppError {
    fields: { field: string; message: string }[];

    constructor(fields: { field: string; message: string }[]) {
        super('Validation Error', 400, 'validation-server');
        this.fields = fields;
    }
}

export class DuplicateEmailError extends AppError {
    constructor() {
        super('البريد الإلكتروني مسجل بالفعل', 400, 'custom');
    }
}