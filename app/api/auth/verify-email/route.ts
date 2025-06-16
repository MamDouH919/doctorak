// handle verify email
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import Users from '@/models/Users';
import dbConnect from '@/lib/dbConnect';

export async function POST(req: Request) {
    try {
        const { email, otp } = await req.json();

        await dbConnect();

        const user = await Users.findOne({ email: email });

        if (!user) {
            return NextResponse.json({ message: 'Invalid OTP' }, { status: 401 });
        }

        if (user.otp !== otp) {
            return NextResponse.json({
                message: 'Invalid OTP',
                field: 'otp',
                typeError: "validation",
                type: "error"
            }, { status: 401 });
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
            maxAge: 86400, // 1 day in seconds
        });

        return NextResponse.json({ message: 'Email verified successfully' });
    } catch (error) {
        console.error('Verify Email Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}