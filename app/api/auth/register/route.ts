// handle register
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import Users from '@/models/Users';
import dbConnect from '@/lib/dbConnect';
import bcrypt from 'bcryptjs';
import { OTPEmail } from '@/lib/mail';
import { hashPassword } from '@/lib/hash-passwords';
import Accounts from '@/models/Accounts';

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json({
                message: "الاسم، البريد الإلكتروني وكلمة المرور مطلوبة",
                type: "error"
            }, { status: 400 });
        }

        await dbConnect();

        const user = await Users.findOne({ email: email.toLowerCase() });

        if (user) {
            return NextResponse.json({
                message: 'البريد الإلكتروني مسجل بالفعل',
                field: 'email',
                typeError: "validation",
                type: "error"
            }, { status: 400 });
        }

        const hashedPassword = await hashPassword(password);

        const otp = Math.floor(100000 + Math.random() * 900000);
        const userData = new Users({
            name: name,
            email: email.toLowerCase(),
            password: hashedPassword,
            role: "user",
            verified: false,
            otp: otp,
        });

        const savedUser = await userData.save();

        const userAccount = new Accounts({
            user: savedUser._id,
            domain: Math.random().toString(36).substring(2, 7),
        });

        const account = await userAccount.save();
        savedUser.account = account._id;

        await savedUser.save()

        await OTPEmail(otp);

        return NextResponse.json({ message: 'Registered successfully', type: "success" });
    } catch (error) {
        console.error('Register Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}