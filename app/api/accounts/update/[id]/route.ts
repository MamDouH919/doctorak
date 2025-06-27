// app/api/accounts/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Accounts from '@/models/Accounts';
import { withAuth } from '@/lib/withAuth';

export async function PUT(req: NextRequest) {
    return withAuth(
        req,
        async (req, user) => {
            try {
                await dbConnect();

                const url = new URL(req.url);
                const id = url.pathname.split('/').pop(); // Get last part of URL path

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
                    social,
                    videos,
                    // appointments,
                    showInHomePage,
                    isPremium,
                    siteName,
                    specialization,
                    specialization_needed,
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
                if (endDate) account.endDate = endDate;
                if (userId) account.userId = userId;
                if (social) account.social = social;
                if (videos) account.videos = videos;
                if (siteName) account.siteName = siteName;
                // if (appointments) account.appointments = appointments;

                if (specialization) account.specialization = specialization;
                if (specialization_needed) account.specialization_needed = specialization_needed;
                account.active = active;
                account.showInHomePage = showInHomePage;
                account.isPremium = isPremium;

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
            allowRoles: ['admin', 'user'],
        }
    );
}
