// app/api/resend-otp/route.ts
import { z } from 'zod';
import { NextRequest } from 'next/server';
import Users from '@/models/Users';
import dbConnect from '@/lib/dbConnect';
import { OTPEmail } from '@/lib/mail';

import { withErrorHandler } from '@/lib/api/withErrorHandler';
import { success } from '@/lib/api/response';
import { ValidationError, AppError } from '@/lib/api/errors';

// ✅ Zod validation schema
const schema = z.object({
    email: z.string().email('invalidEmail'),
});

// ✅ Main handler
const handler = async (req: NextRequest) => {
    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
        const errors = parsed.error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
        }));
        throw new ValidationError(errors);
    }

    const { email } = parsed.data;

    await dbConnect();

    const user = await Users.findOne({ email });

    if (!user) {
        throw new AppError(
            'emailNotFound',
            404,
            'custom'
        );
    }

    if (user.verified) {
        throw new AppError(
            'emailAlreadyVerified',
            400,
            'custom'
        );
    }

    // ✅ Generate and save new OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    user.otp = otp;
    await user.save();

    // await OTPEmail(email, otp, lang);

    return success({
        message: 'OTPResentSuccessfully',
    });
};

export const POST = withErrorHandler(handler);