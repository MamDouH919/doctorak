// app/api/accounts/route.ts         ⟵ adjust the path if yours is different
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Accounts from '@/models/Accounts';
import '@/models/Users';             // needed for the .populate('user') call
import { withAuth } from '@/lib/withAuth';

// ───────────────────────────────────────────────────────────
// Core business logic (pagination + populate)
// ───────────────────────────────────────────────────────────
async function handler(req: NextRequest) {
    await dbConnect();

    // Parse ?page= & ?limit= from the query string
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const skip = (page - 1) * limit;

    // Retrieve paginated data and total count in parallel
    const [accounts, total] = await Promise.all([
        Accounts.find().skip(skip).limit(limit).populate('user'),
        Accounts.countDocuments()
    ]);

    return NextResponse.json({
        type: 'success',
        data: accounts,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    });
}

// ───────────────────────────────────────────────────────────
// Exported HTTP method wrapped with `withAuth`
// ───────────────────────────────────────────────────────────
export const GET = (req: NextRequest) =>
    withAuth(req, handler, { allowRoles: ['admin'] });
