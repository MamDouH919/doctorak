import { NextRequest, NextResponse } from 'next/server';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '@/firebase';
import dbConnect from '@/lib/dbConnect';
import Accounts from '@/models/Accounts';
import ImageModel from '@/models/Images';
import { v4 as uuidv4 } from 'uuid';
import { withAuth } from '@/lib/withAuth';

export async function POST(req: NextRequest) {
    return withAuth(
        req,
        async (req, user) => {
            try {
                await dbConnect();

                const formData = await req.formData();
                const file = formData.get('file') as File;
                const accountId = formData.get('accountId')?.toString();
                const alt = formData.get('alt')?.toString();

                if (!file || !accountId) {
                    return NextResponse.json(
                        { message: 'file and accountId are required' },
                        { status: 400 }
                    );
                }

                const account = await Accounts.findById(accountId);
                if (!account) {
                    return NextResponse.json({ message: 'Account not found' }, { status: 404 });
                }

                // Convert to buffer for upload
                const arrayBuffer = await file.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                const extension = file.name.split('.').pop();
                const filename = `${uuidv4()}.${extension}`;
                const storageRef = ref(storage, `dakatrah/profile-images/${filename}`);

                await uploadBytes(storageRef, buffer, {
                    contentType: file.type,
                });

                const url = await getDownloadURL(storageRef);

                // Replace existing image if any
                await ImageModel.findOneAndDelete({ account: account._id });

                const image = await ImageModel.create({
                    url,
                    alt: alt || file.name,
                    account: account._id,
                });

                account.image = image._id;
                await account.save();

                return NextResponse.json({
                    message: 'Image uploaded successfully',
                    data: image,
                });
            } catch (err) {
                console.error('Upload error:', err);
                return NextResponse.json({ message: 'Server error' }, { status: 500 });
            }
        },
        {
            allowRoles: ['admin', 'user'], // ✅ Only allow these roles
        }
    );
}
