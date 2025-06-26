// lib/api/parseForm.ts
import { IncomingForm } from 'formidable';
import { NextRequest } from 'next/server';

export const parseForm = (req: NextRequest): Promise<{ fields: any; files: any }> => {
    return new Promise((resolve, reject) => {
        const form = new IncomingForm({ keepExtensions: true, multiples: false });
        form.parse(req as any, (err, fields, files) => {
            if (err) reject(err);
            else resolve({ fields, files });
        });
    });
};