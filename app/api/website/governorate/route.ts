// handle get specializations
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Governorate from '@/models/Governorate';

export async function GET() {
    try {
        await dbConnect();

        const governorate = await Governorate.find({})

        return NextResponse.json({
            type: 'success',
            data: governorate,
        });
    } catch (error) {
        console.error('Get governorate Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}