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
                const requestLang = req.headers.get('Language') || 'en';
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
                    about,
                    siteName,
                    services,
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

                if (services) {
                    if (account.services) {
                        account.services[requestLang] = services;
                    } else {
                        if (!account.services) {
                            account.services = { ar: [], en: [] }; // or just {}
                        }

                        account.services.ar = services;
                        account.services.en = services;
                    }
                }

                if (phone) account.phone = phone;
                if (whatsApp) account.whatsApp = whatsApp;

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
