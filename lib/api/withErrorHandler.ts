import { AppError, ValidationError } from './errors';

export function withErrorHandler(handler: (req: Request) => Promise<Response>) {
    return async (req: Request): Promise<Response> => {
        try {
            return await handler(req);
        } catch (err: any) {
            console.error('API Error:', err);

            if (err instanceof ValidationError) {
                return new Response(
                    JSON.stringify({
                        success: false,
                        type: err.type,
                        errors: err.fields,
                    }),
                    {
                        status: err.statusCode,
                        headers: { 'Content-Type': 'application/json' },
                    }
                );
            }

            if (err instanceof AppError) {
                return new Response(
                    JSON.stringify({
                        success: false,
                        type: err.type,
                        message: err.message,
                    }),
                    {
                        status: err.statusCode,
                        headers: { 'Content-Type': 'application/json' },
                    }
                );
            }

            return new Response(
                JSON.stringify({
                    success: false,
                    type: 'internal',
                    message: 'Internal Server Error',
                }),
                {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }
    };
}