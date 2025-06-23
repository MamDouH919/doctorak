// handle logout
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import Users from '@/models/Users';
import dbConnect from '@/lib/dbConnect';

export async function POST(req: Request) {
    try {
        const { token } = await req.json();

        if (!token) {
            return NextResponse.json({ message: 'Token is required' }, { status: 400 });
        }

        await dbConnect();

        const user = await Users.findOne({ token: token });
        
        if (!user) {
            return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
        }

        user.token = null;
        await user.save();

        (await cookies()).delete('token');

        return NextResponse.json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}