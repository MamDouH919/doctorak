import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import Users from '@/models/Users';
import dbConnect from '@/lib/dbConnect';
import bcrypt from 'bcryptjs';
import { OTPEmail } from '@/lib/mail';
import { hashPassword } from '@/lib/hash-passwords';
import Accounts from '@/models/Accounts';
import mongoose from 'mongoose';

export async function POST(req: Request) {
    const session = await mongoose.startSession();

    try {
        const { name, email, password, specialization, specialization_needed } = await req.json();

        if (!name || !email || !password || !(specialization || specialization_needed)) {
            return NextResponse.json({
                message: "الاسم، البريد الإلكتروني وكلمة المرور والتخصص مطلوبين",
                type: "error"
            }, { status: 400 });
        }

        await dbConnect();

        const existingUser = await Users.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return NextResponse.json({
                message: 'البريد الإلكتروني مسجل بالفعل',
                field: 'email',
                typeError: "validation",
                type: "error"
            }, { status: 400 });
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


        return NextResponse.json({ message: 'Registered successfully', type: "success" });

    } catch (error) {
        console.error('Register Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    } finally {
        session.endSession();
    }
}
