import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import Users from '@/models/Users';
import dbConnect from '@/lib/dbConnect';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
        }

        await dbConnect();

        const user = await Users.findOne({ email: email.toLowerCase() });

        if (!user) {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }


        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }

        if (!user.verified) {
            return NextResponse.json({
                message: 'البريد الإلكتروني غير مفعل',
                typeError: "NotVerified",
                type: "error"
            }, { status: 401 });
        }

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

        return NextResponse.json({ message: 'Logged in successfully' });
    } catch (error) {
        console.error('Login Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
