import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { withErrorHandler } from '@/lib/api/withErrorHandler';
import { success } from '@/lib/api/response';
import { ValidationError, AppError } from '@/lib/api/errors';
import dbConnect from '@/lib/dbConnect';
import Users from '@/models/Users';
import { z } from 'zod';
import { VerifyEmailSchema } from '@/schemas/auth';

// ✅ Define schema for request body


// ✅ Actual handler logic
const handler = async (req: Request) => {
    const body = await req.json();

    const parsed = VerifyEmailSchema.safeParse(body);
    if (!parsed.success) {
        const errors = parsed.error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message,
        }));
        throw new ValidationError(errors);
    }

    const { email, otp } = parsed.data;

    await dbConnect();

    const user = await Users.findOne({ email });

    if (!user) {
        throw new ValidationError([{ field: 'otp', message: 'رمز التحقق غير صحيح أو المستخدم غير موجود' }]);
    }

    if (user.otp !== otp) {
        throw new ValidationError([{ field: 'otp', message: 'رمز التحقق غير صحيح' }]);
    }

    user.verified = true;

    const token = jwt.sign(
        { id: user._id.toString(), email: user.email, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: '1d' }
    );

    user.token = token;
    await user.save();

    const cookieStore = cookies();
    (await cookieStore).set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24, // 1 day
    });

    return success({ message: 'تم التحقق من البريد الإلكتروني بنجاح', user });
};

export const POST = withErrorHandler(handler);