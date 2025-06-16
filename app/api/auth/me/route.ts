// app/api/me/route.ts
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import Users from '@/models/Users';

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');

    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return NextResponse.json({ message: 'No token provided' }, { status: 401 });
    }

    // ✅ Verify the token and extract the payload
    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (err) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const userId = decoded.id; // assuming the token payload has `id`
    

    await dbConnect();

    const user = await Users.findById(userId).populate('account');

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Optionally remove sensitive data before returning
    const { password, ...userData } = user.toObject();

    return NextResponse.json({
      message: 'User retrieved successfully',
      user: userData,
    });
  } catch (error) {
    console.error('Get Me Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
