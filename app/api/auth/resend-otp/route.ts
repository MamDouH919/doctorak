// handle resend otp
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import Users from '@/models/Users';
import dbConnect from '@/lib/dbConnect';
import bcrypt from 'bcryptjs';
import { OTPEmail } from '@/lib/mail';
import { hashPassword } from '@/lib/hash-passwords';

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        await dbConnect();

        const user = await Users.findOne({ email: email });

        if (!user) {
            return NextResponse.json({ message: "البريد الإلكتروني غير موجود", type: "error" });
        }

        if (user.verified) {
            return NextResponse.json({ message: "البريد الإلكتروني مفعل", type: "error" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000);
        user.otp = otp;
        await user.save();

        await OTPEmail(otp);

        return NextResponse.json({ message: "تم إعادة إرسال رمز التحقق", type: "success" });
    } catch (error) {
        console.error('Resend OTP Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}