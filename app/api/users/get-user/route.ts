// handle get user by id
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Users from '@/models/Users';

export async function GET(req: Request) {
    try {
        const { id } = await req.json();

        await dbConnect();

        const user = await Users.findOne({ _id: id });

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error('Get User Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}