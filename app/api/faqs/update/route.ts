import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import FAQ from '@/models/Faqs';
import { withAuth } from '@/lib/withAuth';
import { NextRequest } from 'next/server';

async function handler(req: NextRequest) {
    try {
        const { id, question, answer, account } = await req.json();

        // Validate required fields
        if (!id || !question || !answer) {
            return NextResponse.json(
                { message: 'ID, question, and answer are required', type: 'validation' },
                { status: 400 }
            );
        }

        await dbConnect();

        // Find FAQ and check ownership
        const faq = await FAQ.findOne({ _id: id, account: account });
        if (!faq) {
            return NextResponse.json(
                { message: 'FAQ not found or unauthorized', type: 'error' },
                { status: 404 }
            );
        }

        // Update FAQ
        faq.question = question;
        faq.answer = answer;
        await faq.save();

        return NextResponse.json(
            { message: 'FAQ updated successfully', type: 'success', data: faq },
            { status: 200 }
        );

    } catch (error: any) {
        console.error('Update FAQ Error:', error);
        return NextResponse.json(
            { message: 'Internal Server Error', type: 'error' },
            { status: 500 }
        );
    }
}

export const PUT = (req: NextRequest) => withAuth(req, handler, { allowRoles: ['admin', 'user'] });