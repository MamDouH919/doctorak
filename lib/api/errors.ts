export class AppError extends Error {
    statusCode: number;
    type: 'custom' | 'validation-server' | 'internal';
    errorCode?: string;

    constructor(message: string, statusCode = 500, type: AppError['type'] = 'internal', errorCode?: string) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.type = type;
        this.errorCode = errorCode; // Optional error code can be set later if needed
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