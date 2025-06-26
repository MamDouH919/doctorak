// app/api/articles/route.ts
import { z } from 'zod';
import { NextRequest } from 'next/server';

import dbConnect from '@/lib/dbConnect';
import ARTICLES from '@/models/Articles';
import Accounts from '@/models/Accounts';

import { withAuth } from '@/lib/withAuth';
import { withErrorHandler } from '@/lib/api/withErrorHandler';
import { success } from '@/lib/api/response';
import { ValidationError, AppError } from '@/lib/api/errors';

// ✅ Zod schema
const ArticleSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    content: z.string().min(1, 'Content is required'),
    account: z.string().min(1, 'Account ID is required'),
});

// ✅ Handler logic
const handler = async (req: NextRequest) => {
    const body = await req.json();
    const parsed = ArticleSchema.safeParse(body);

    if (!parsed.success) {
        const errors = parsed.error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message,
        }));
        throw new ValidationError(errors);
    }

    const { title, content, account } = parsed.data;

    await dbConnect();

    const accountDoc = await Accounts.findById(account);
    if (!accountDoc) {
        throw new AppError('Account not found or unauthorized', 404, 'custom');
    }

    const article = await ARTICLES.create({
        title,
        content,
        account,
    });

    return success({
        message: 'Article created successfully',
        data: article,
    });
};

// ✅ Auth + error handling
export const POST = (req: NextRequest) =>
    withAuth(req, withErrorHandler(handler), {
        allowRoles: ['admin', 'user'],
    });