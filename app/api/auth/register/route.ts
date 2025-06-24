// app/api/register/route.ts
import { NextRequest } from 'next/server';
import mongoose from 'mongoose';
import Users from '@/models/Users';
import Accounts from '@/models/Accounts';
import dbConnect from '@/lib/dbConnect';
import { OTPEmail } from '@/lib/mail';
import { hashPassword } from '@/lib/hash-passwords';

import { withErrorHandler } from '@/lib/api/withErrorHandler';
import { success } from '@/lib/api/response';
import { ValidationError, DuplicateEmailError } from '@/lib/api/errors';
import { RegisterUserSchema } from '@/schemas/auth';

const handler = async (req: Request) => {
    const session = await mongoose.startSession();
    await dbConnect();

    try {
        const json = await req.json();
        const parsed = RegisterUserSchema.safeParse(json);

        if (!parsed.success) {
            const fieldErrors = parsed.error.issues.map(issue => ({
                field: issue.path.join('.'), // handles nested paths
                message: issue.message,
            }));

            throw new ValidationError(fieldErrors);
        }

        const { name, email, password, specialization, specialization_needed } = parsed.data;

        const existingUser = await Users.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            const fieldErrors = [{ field: 'email', message: 'البريد الإلكتروني مسجل بالفعل' }];
            throw new ValidationError(fieldErrors);
        }

        const hashedPassword = await hashPassword(password);
        const otp = Math.floor(100000 + Math.random() * 900000);

        await session.withTransaction(async () => {
            const user = new Users({
                name,
                email: email.toLowerCase(),
                password: hashedPassword,
                role: "user",
                verified: false,
                otp,
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

        return success({ message: '' });
    } finally {
        session.endSession();
    }
};

export const POST = withErrorHandler(handler);