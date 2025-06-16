// handle to get list users 
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Users from '@/models/Users';
import jwt, { JwtPayload } from 'jsonwebtoken';


interface TokenPayload extends JwtPayload {
    role: string;
}


export async function GET(req: Request) {
    try {
        // check if admin from token
        const authHeader = req.headers.get('Authorization')

        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json(
                { message: 'unauthorized' },
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

        // Verify token and extract domain
        let decoded: TokenPayload
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET as string) as TokenPayload
            
            if (decoded.role !== 'admin') {
                return NextResponse.json(
                    { message: 'unauthorized' },
                    { status: 401 }
                )
            }
        } catch {
            return NextResponse.json(
                { message: 'Invalid or expired token' },
                { status: 401 }
            )
        }

        // const { page } = await req.json();

        await dbConnect();

        const users = await Users.find({});
        console.log(users);


        if (!users) {
            return NextResponse.json({ message: 'No users found' }, { status: 404 });
        }

        return NextResponse.json({
            type: 'success',
            users
        });
    } catch (error) {
        console.error('Get Users Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}