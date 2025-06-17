// handle dropdown accounts (all)
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Accounts from '@/models/Accounts';
import { withAuth } from '@/lib/withAuth';
import '@/models/Users';


async function handler(req: NextRequest, user: any) {
    try {
        await dbConnect();

        // If you still want to enforce that only admins can fetch this:
        if (user.role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }

        const accounts = await Accounts.find({}, '_id') // only get _id from Accounts
            .populate({
                path: 'user',
                select: '_id name', // only _id and name from User
            });

        return NextResponse.json({
            type: 'success',
            data: accounts,
        });
    } catch (error) {
        console.error('Get All Accounts Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export const GET = (req: NextRequest) => withAuth(req, handler, { allowRoles: ['admin'] });
