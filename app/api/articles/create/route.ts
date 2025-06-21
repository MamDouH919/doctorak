import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import ARTICLES from '@/models/Articles';
import Accounts from '@/models/Accounts';
import { withAuth } from '@/lib/withAuth';
import { NextRequest } from 'next/server';

async function handler(req: NextRequest, user: any) {
    try {
        // Get request body
        const { title, content, account } = await req.json();

        // Validate required fields
        if (!title || !content || !account) {
            return NextResponse.json({
                message: 'title, content, and account are required',
                type: 'validation'
            }, { status: 400 });
        }

        await dbConnect();

        // Check if account exists and belongs to user
        const accountDoc = await Accounts.findOne({ _id: account });
        if (!accountDoc) {
            return NextResponse.json({
                message: 'Account not found or unauthorized',
                type: 'validation'
            }, { status: 404 });
        }

        const articles = new ARTICLES({
            title,
            content,
            account,
        });

        await articles.save();

        return NextResponse.json({
            message: 'Articles created successfully',
            type: 'success',
            data: articles
        });

    } catch (error: any) {
        console.error('Create Articles Error:', error);
        return NextResponse.json({
            message: 'Internal Server Error',
            type: 'error'
        }, { status: 500 });
    }
}

export const POST = (req: NextRequest) => withAuth(req, handler, { allowRoles: ['admin', 'user'] });
