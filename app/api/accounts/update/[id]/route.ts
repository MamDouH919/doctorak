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

                // get lang from header

                const url = new URL(req.url);
                const id = url.pathname.split('/').pop(); // Get last part of URL path

                const requestLang = req.headers.get('Language') || 'en';
                console.log('requestLang', requestLang);

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
                    about,
                    domain,
                    active,
                    endDate,
                    userId,
                    social,
                    videos,
                    showInHomePage,
                    isPremium,
                    siteName,
                    specialization,
                    specialization_needed,
                } = await req.json();

                if (title) {
                    if (!account.title.ar && !account.title.en) {
                        account.title.ar = title;
                        account.title.en = title;
                    } else {
                        account.title[requestLang] = title;
                    }
                };

                if (description) {
                    if (!account.description.ar && !account.description.en) {
                        account.description.ar = description;
                        account.description.en = description;
                    } else {
                        account.description[requestLang] = description;
                    }
                };

                if (about) {
                    if (!account.about.ar && !account.about.en) {
                        account.about.ar = about;
                        account.about.en = about;
                    } else {
                        account.about[requestLang] = about;
                    }
                };

                if (siteName) {
                    if (!account.siteName.ar && !account.siteName.en) {
                        account.siteName.ar = siteName;
                        account.siteName.en = siteName;
                    } else {
                        account.siteName[requestLang] = siteName;
                    }
                };

                if (phone) account.phone = phone;
                if (whatsApp) account.whatsApp = whatsApp;
                if (color) account.color = color;
                if (domain) {
                    account.domain = domain;
                } else {
                    account.domain = user.accountId;
                }
                if (endDate) account.endDate = endDate;
                if (userId) account.userId = userId;
                if (social) account.social = social;
                if (videos) account.videos = videos;

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
