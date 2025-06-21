import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import ARTICLES from '@/models/Articles';
import { withAuth } from '@/lib/withAuth';
import { NextRequest } from 'next/server';

async function handler(req: NextRequest) {
    try {
        const { id, title, content, account } = await req.json();
        console.log(id, title, content, account)
        
        // Validate required fields
        if (!id || !title || !content) {
            return NextResponse.json(
                { message: 'ID, title, and content are required', type: 'validation' },
                { status: 400 }
            );
        }

        await dbConnect();

        const articles = await ARTICLES.findOne({ _id: id, account: account });
        if (!articles) {
            return NextResponse.json(
                { message: 'Articles not found or unauthorized', type: 'error' },
                { status: 404 }
            );
        }

        articles.title = title;
        articles.content = content;
        await articles.save();

        return NextResponse.json(
            { message: 'Articles updated successfully', type: 'success', data: articles },
            { status: 200 }
        );

    } catch (error: any) {
        console.error('Update Articles Error:', error);
        return NextResponse.json(
            { message: 'Internal Server Error', type: 'error' },
            { status: 500 }
        );
    }
}

export const PUT = (req: NextRequest) => withAuth(req, handler, { allowRoles: ['admin', 'user'] });