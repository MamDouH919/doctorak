// app/api/faqs/update/route.ts
import { z } from 'zod';
import { NextRequest } from 'next/server';

import dbConnect from '@/lib/dbConnect';
import FAQ from '@/models/Faqs';
import { withAuth } from '@/lib/withAuth';
import { withErrorHandler } from '@/lib/api/withErrorHandler';
import { ValidationError, AppError } from '@/lib/api/errors';
import { success } from '@/lib/api/response';

// ✅ Zod Schema
const FAQUpdateSchema = z.object({
    id: z.string().min(1, 'ID is required'),
    question: z.string().min(1, 'Question is required'),
    answer: z.string().min(1, 'Answer is required'),
    account: z.string().min(1, 'Account ID is required'),
});

// ✅ Handler Logic
const handler = async (req: NextRequest) => {
    const body = await req.json();
    const parsed = FAQUpdateSchema.safeParse(body);

    if (!parsed.success) {
        const errors = parsed.error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message,
        }));
        throw new ValidationError(errors);
    }

    const { id, question, answer, account } = parsed.data;

    await dbConnect();

    const faq = await FAQ.findOne({ _id: id, account });

    if (!faq) {
        throw new AppError('FAQ not found or unauthorized', 404, 'custom');
    }

    faq.question = question;
    faq.answer = answer;
    await faq.save();

    return success({
        message: 'FAQ updated successfully',
        data: faq,
    });
};

// ✅ Export with auth + error handling
export const PUT = (req: NextRequest) =>
    withAuth(req, withErrorHandler(handler), {
        allowRoles: ['admin', 'user'],
    });