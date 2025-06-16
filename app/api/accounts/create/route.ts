import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';

import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import Account from '@/models/Accounts';
import Users from '@/models/Users';

export async function POST(req: Request) {
    try {
        const authHeader = req.headers.get('Authorization')
        
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json(
                { message: 'Invalid authorization header format' },
                { status: 401 }
            )
        }

        const token = authHeader.split(' ')[1]
        if (!token) {
            return NextResponse.json(
                { message: 'No token provided' },
                { status: 401 }
            )
        }

        const {
            title,
            phone,
            whatsApp,
            description,
            color,
            lang,
            about,
            userId
        } = await req.json();

        const domain = "doctorak.com";

        // Validate required fields
        if (!title || !phone || !whatsApp || !description || !color || !lang || !about) {
            return NextResponse.json({
                message: 'All fields are required',
                typeError: 'validation'
            }, { status: 400 });
        }

        // Validate language
        if (!['ar', 'en'].includes(lang)) {
            return NextResponse.json({
                message: 'Invalid language. Must be either "ar" or "en"',
                typeError: 'validation'
            }, { status: 400 });
        }

        await dbConnect();

        // Check if user exists
        const user = await Users.findOne({ _id: userId });
        if (!user) {
            return NextResponse.json({
                message: 'User not found',
                typeError: 'validation'
            }, { status: 404 });
        }

        // Check if user already has an account
        const existingUserAccount = await Account.findOne({ userId });
        if (existingUserAccount) {
            return NextResponse.json({
                message: 'User already has an account',
                typeError: 'validation'
            }, { status: 400 });
        }

        // Check if domain already exists
        const existingDomainAccount = await Account.findOne({ domain });
        if (existingDomainAccount) {
            return NextResponse.json({
                message: 'Domain already exists',
                typeError: 'validation'
            }, { status: 400 });
        }

        // Create new account
        const account = new Account({
            title,
            phone,
            whatsApp,
            description,
            image: "asd",
            color,
            lang,
            about,
            domain: "asssd",
            active: false,
            endDate: "12-12-2025",
            user: userId
        });

        await account.save();

        return NextResponse.json({
            message: 'Account created successfully',
            account
        });

    } catch (error: any) {
        console.error('Account Creation Error:', error);
        if (error.name === 'JsonWebTokenError') {
            return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
        }
        return NextResponse.json({
            message: 'Internal Server Error',
            typeError: 'error'
        }, { status: 500 });
    }
}