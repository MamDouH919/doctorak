// handle to get list accounts with pagination
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Accounts from '@/models/Accounts';

export async function GET(req: Request) {
    try {
        await dbConnect();

        // Extract search params
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '20', 10);

        const skip = (page - 1) * limit;

        // Fetch paginated accounts
        const [accounts, total] = await Promise.all([
            Accounts.find().skip(skip).limit(limit),
            Accounts.countDocuments()
        ]);


        return NextResponse.json({
            type: 'success',
            data: accounts,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Get Accounts Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
