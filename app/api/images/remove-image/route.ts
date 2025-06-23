// app/api/delete-image/route.ts

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Account from '@/models/Accounts';
import Image from '@/models/Images';
import { deleteFromFirebase } from '@/firebase';
import { withAuth } from '@/lib/withAuth';

export const DELETE = async (req: NextRequest) =>
    withAuth(req, async (req, user) => {
        try {
            const body = await req.json();
            const { accountId, imagePath } = body;

            if (!accountId || !imagePath) {
                return NextResponse.json(
                    { error: 'Missing accountId or imagePath' },
                    { status: 400 }
                );
            }

            await dbConnect();

            // 1. Delete from Firebase
            await deleteFromFirebase(imagePath);

            // 2. Remove image field from Account
            const updatedAccount = await Account.findByIdAndUpdate(
                accountId,
                { $unset: { profileImage: '' } },
                { new: true }
            );

            if (!updatedAccount) {
                return NextResponse.json(
                    { error: 'Account not found' },
                    { status: 404 }
                );
            }

            // 3. Remove image document from Images collection
            await Image.deleteOne({ path: imagePath });

            return NextResponse.json(
                {
                    message: '✅ Image deleted successfully',
                    account: updatedAccount,
                },
                { status: 200 }
            );
        } catch (err) {
            console.error('❌ Error deleting image:', err);
            return NextResponse.json({ error: 'Server error' }, { status: 500 });
        }
    });
