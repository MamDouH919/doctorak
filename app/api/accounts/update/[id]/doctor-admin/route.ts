// app/api/accounts/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Accounts from '@/models/Accounts';
import { withAuth } from '@/lib/withAuth';

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    return withAuth(
        req,
        async (req) => {
            try {
                await dbConnect();
                const { id } = await context.params; // ✅ get dynamic route param
                if (!id) {
                    return NextResponse.json(
                        { message: 'Missing account ID', type: 'error' },
                        { status: 400 }
                    );
                }

                const account = await Accounts.findById(id);
                if (!account) {
                    return NextResponse.json(
                        { message: 'Account not found', type: 'error' },
                        { status: 404 }
                    );
                }

                const {
                    isPremium,
                    active,
                    showInHomePage,
                    specialization,
                    specialization_needed,
                    domain,
                } = await req.json();

                account.active = active;
                account.showInHomePage = showInHomePage;
                account.isPremium = isPremium;
                if (specialization) account.specialization = specialization;
                if (specialization_needed) account.specialization_needed = specialization_needed;
                if (domain) account.domain = domain;

                await account.save();

                return NextResponse.json({
                    message: 'Account updated successfully',
                    account,
                });
            } catch (error) {
                console.error('Update Account Error:', error);
                return NextResponse.json(
                    { message: 'Internal Server Error' },
                    { status: 500 }
                );
            }
        },
        {
            allowRoles: ['admin'],
        }
    );
}
