// app/api/faqs/route.ts
import { NextRequest } from 'next/server';
import { z } from 'zod';

import dbConnect from '@/lib/dbConnect';
import FAQ from '@/models/Faqs';
import Accounts from '@/models/Accounts';

import { withAuth } from '@/lib/withAuth';
import { withErrorHandler } from '@/lib/api/withErrorHandler';
import { success } from '@/lib/api/response';
import { ValidationError, AppError } from '@/lib/api/errors';
import { syncRelation } from '@/lib/relationManager';

// ✅ Zod validation schema
const FAQSchema = z.object({
    question: z.string().min(1, 'Question is required'),
    answer: z.string().min(1, 'Answer is required'),
    account: z.string().min(1, 'Account ID is required'),
});

// ✅ Actual handler function
const handler = async (req: NextRequest) => {
    const body = await req.json();
    const parsed = FAQSchema.safeParse(body);

    if (!parsed.success) {
        const errors = parsed.error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message,
        }));
        throw new ValidationError(errors);
    }

    const { question, answer, account } = parsed.data;

    await dbConnect();

    const accountDoc = await Accounts.findById(account);
    if (!accountDoc) {
        throw new AppError('Account not found or unauthorized', 404, 'custom');
    }

    const faq = await FAQ.create({
        question:{
            ar: question,
            en: question,
        },
        answer:{
            ar: answer,
            en: answer,
        },
        account,
    });

    await syncRelation({
        model: Accounts,
        docId: account,
        field: 'faqs',
        value: faq._id,
        action: 'add',
    });

    return success({
        message: 'FAQ created successfully',
        data: faq,
    });
};

// ✅ Wrap with auth and error handling
export const POST = (req: NextRequest) =>
    withAuth(req, withErrorHandler(handler), {
        allowRoles: ['admin', 'user'],
    });