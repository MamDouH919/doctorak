import { z } from 'zod';
import { NextRequest } from 'next/server';

import dbConnect from '@/lib/dbConnect';
import Articles from '@/models/Articles';
import { withAuth } from '@/lib/withAuth';
import { withErrorHandler } from '@/lib/api/withErrorHandler';
import { ValidationError, AppError } from '@/lib/api/errors';
import { success } from '@/lib/api/response';

// ✅ Zod Schema
const ArticlesUpdateSchema = z.object({
    id: z.string().min(1, 'ID is required'),
    title: z.string().min(1, 'Title is required'),
    content: z.string().min(1, 'Content is required'),
    account: z.string().min(1, 'Account ID is required'),
});

// ✅ Handler Logic
const handler = async (req: NextRequest) => {
    const body = await req.json();
    const parsed = ArticlesUpdateSchema.safeParse(body);
    const requestLang = req.headers.get('Language') || 'en';

    if (!parsed.success) {
        const errors = parsed.error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message,
        }));
        throw new ValidationError(errors);
    }

    const { id, title, content, account } = parsed.data;

    await dbConnect();

    const articles = await Articles.findOne({ _id: id, account });

    if (!articles) {
        throw new AppError('Article not found or unauthorized', 404, 'custom');
    }

    articles.title[requestLang] = title;
    articles.content[requestLang] = content;
    await articles.save();

    return success({
        message: 'Article updated successfully',
        data: articles,
    });
};

// ✅ Export with auth + error handling
export const PUT = (req: NextRequest) =>
    withAuth(req, withErrorHandler(handler), {
        allowRoles: ['admin', 'user'],
    });