// app/api/accounts/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Accounts from '@/models/Accounts';
import { withAuth } from '@/lib/withAuth';

type Params = {
    params: {
        id: string;
    };
};

export async function PUT(req: NextRequest, { params }: Params) {
    return withAuth(req, async (req, user) => {
        try {
            const { id } = await params; // ✅ no await needed here

            await dbConnect();

            const account = await Accounts.findById(id);

            if (!account) {
                return NextResponse.json(
                    { message: 'Account not found', type: 'error' },
                    { status: 404 }
                );
            }

            const {
                title,
                phone,
                whatsApp,
                description,
                color,
                lang,
                about,
                domain,
                active,
                endDate,
                userId,
            } = await req.json();

            if (title) account.title = title;
            if (phone) account.phone = phone;
            if (whatsApp) account.whatsApp = whatsApp;
            if (description) account.description = description;
            if (color) account.color = color;
            if (lang) account.lang = lang;
            if (about) account.about = about;
            if (domain) {
                account.domain = domain;
            } else {
                account.domain = user.accountId;
            }
            if (active !== undefined) account.active = active;
            if (endDate) account.endDate = endDate;
            if (userId) account.userId = userId;

            // Optional: Reset these fields if required
            account.faqs = [];
            account.articles = [];
            account.testimonials = [];
            account.videos = [];
            account.social = [];

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
            allowRoles: ['admin', 'user'], // ✅ Only allow admins
        }
    );
}
