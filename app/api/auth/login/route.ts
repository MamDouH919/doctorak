import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

import dbConnect from '@/lib/dbConnect';
import Users from '@/models/Users';
import { withErrorHandler } from '@/lib/api/withErrorHandler';
import { ValidationError, AppError } from '@/lib/api/errors';
import { success } from '@/lib/api/response';

const LoginSchema = z.object({
    email: z.string().email('البريد الإلكتروني غير صالح'),
    password: z.string().min(1, 'كلمة المرور مطلوبة'),
});

const handler = async (req: Request) => {
    const body = await req.json();

    const parsed = LoginSchema.safeParse(body);
    if (!parsed.success) {
        const errors = parsed.error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message,
        }));
        throw new ValidationError(errors);
    }

    const { email, password } = parsed.data;

    await dbConnect();

    const user = await Users.findOne({ email: email.toLowerCase() });

    if (!user) {
        const errors = [{ field: 'email', message: 'البريد الإلكتروني غير صحيح' }];
        throw new ValidationError(errors);
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
        const errors = [{ field: 'password', message: 'كلمة المرور غير صحيحة' }];
        throw new ValidationError(errors);
    }

    if (!user.verified) {
        throw new AppError('البريد الإلكتروني غير مفعل', 400, 'custom');
    }
    
    const account = await user.populate('account', '_id isPremium');

    const token = jwt.sign(
        {
            id: user._id.toString(),
            email: user.email,
            role: user.role,
            accountId: user.account,
        },
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
        maxAge: 86400,
    });

    return success({ user });
};

export const POST = withErrorHandler(handler);