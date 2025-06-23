// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Users from '@/models/Users';
import { withAuth } from '@/lib/withAuth';

async function handler(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '10', 10);
        const skip = (page - 1) * limit;

        await dbConnect();

        const [users, total] = await Promise.all([
            Users.find({}).skip(skip).limit(limit),
            Users.countDocuments(),
        ]);

        return NextResponse.json({
            type: 'success',
            page,
            limit,
            total,
            data: users,
        });
    } catch (error) {
        console.error('Get Users Error:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

// Wrap with auth — only admin
export const GET = (req: NextRequest) =>
    withAuth(req, handler, { allowRoles: ['admin'] });
