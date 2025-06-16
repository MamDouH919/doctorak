import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import FAQ from '@/models/Faqs';
import Accounts from '@/models/Accounts';
import { withAuth } from '@/lib/withAuth';
import { NextRequest } from 'next/server';

async function handler(req: NextRequest, user: any) {
    try {
        // Get request body
        const { question, answer, account } = await req.json();

        // Validate required fields
        if (!question || !answer || !account) {
            return NextResponse.json({
                message: 'Question, answer, and account are required',
                type: 'validation'
            }, { status: 400 });
        }

        await dbConnect();

        // Check if account exists and belongs to user
        const accountDoc = await Accounts.findOne({ _id: account, userId: user.id });
        if (!accountDoc) {
            return NextResponse.json({
                message: 'Account not found or unauthorized',
                type: 'validation'
            }, { status: 404 });
        }

        // Create FAQ
        const faq = new FAQ({
            question,
            answer,
            account,
        });

        await faq.save();

        return NextResponse.json({
            message: 'FAQ created successfully',
            type: 'success',
            data: faq
        });

    } catch (error: any) {
        console.error('Create FAQ Error:', error);
        return NextResponse.json({
            message: 'Internal Server Error',
            type: 'error'
        }, { status: 500 });
    }
}

export const POST = (req: NextRequest) => withAuth(req, handler, { allowRoles: ['admin', 'user'] });
