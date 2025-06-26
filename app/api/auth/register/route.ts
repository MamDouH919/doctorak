// app/api/register/route.ts
import { withErrorHandler } from '@/lib/api/withErrorHandler';
import { success } from '@/lib/api/response';
import { ValidationError } from '@/lib/api/errors';
import { RegisterUserSchema } from '@/schemas/auth';
import { v4 as uuidv4 } from 'uuid';

import dbConnect from '@/lib/dbConnect';
import Users from '@/models/Users';
import Accounts from '@/models/Accounts';
import { OTPEmail } from '@/lib/mail';
import { hashPassword } from '@/lib/hash-passwords';

import mongoose from 'mongoose';
import { NextRequest } from 'next/server';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '@/firebase';

export const POST = withErrorHandler(async (req: NextRequest) => {
    await dbConnect();
    const session = await mongoose.startSession();

    try {
        const form = await req.formData();

        // Extract fields
        const image = form.get('image') as string;
        const name = form.get('name') as string;
        const email = form.get('email') as string;
        const password = form.get('password') as string;
        const phone = form.get('phone') as string;
        const specialization = form.get('specialization') as string | null;
        const specialization_needed = form.get('specialization_needed') as string | null;

        // Validate form fields using Zod
        const parsed = RegisterUserSchema.safeParse({
            name,
            image,
            email,
            password,
            phone,
            ...(specialization && { specialization: specialization }),
            ...(specialization_needed && { specialization_needed: specialization_needed }),
        });

        if (!parsed.success) {
            const errors = parsed.error.issues.map(issue => ({
                field: issue.path.join('.'),
                message: issue.message,
            }));
            throw new ValidationError(errors);
        }

        const existingUser = await Users.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            throw new ValidationError([{ field: 'email', message: 'البريد الإلكتروني مسجل بالفعل' }]);
        }

        const file = form.get('image') as File;

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const extension = file.name.split('.').pop();
        const filename = `${uuidv4()}.${extension}`;
        const storageRef = ref(storage, `dakatrah/register-images/${filename}`);

        await uploadBytes(storageRef, buffer, {
            contentType: file.type,
        });
        const url = await getDownloadURL(storageRef);

        const hashedPassword = await hashPassword(password);
        const otp = Math.floor(100000 + Math.random() * 900000);

        await session.withTransaction(async () => {
            const user = new Users({
                name,
                email: email.toLowerCase(),
                password: hashedPassword,
                role: 'user',
                verified: false,
                otp,
                image: url,
            });

            const account = new Accounts({
                user: user._id,
                domain: Math.random().toString(36).substring(2, 7),
                ...(specialization && { specialization }),
                ...(specialization_needed && { specialization_needed }),
            });

            user.account = account._id;

            await account.save({ session });
            await user.save({ session });

            await OTPEmail(user.email, otp);
        });

        return success({ message: 'تم إنشاء الحساب بنجاح' });
    } finally {
        session.endSession();
    }
});