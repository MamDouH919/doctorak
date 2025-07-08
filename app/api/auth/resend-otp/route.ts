// handle resend otp
import { NextResponse } from 'next/server';
import Users from '@/models/Users';
import dbConnect from '@/lib/dbConnect';
import { OTPEmail } from '@/lib/mail';

export async function POST(req: Request) {
    try {
        const { email } = await req.json();
        const lang = req.headers.get('Language') as "ar" | "en";


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

        await OTPEmail(email, otp, lang);

        return NextResponse.json({ message: "تم إعادة إرسال رمز التحقق", type: "success" });
    } catch (error) {
        console.error('Resend OTP Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}