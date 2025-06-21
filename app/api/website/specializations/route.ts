// handle get specializations
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Specializations from '@/models/Specialization';

export async function GET() {
    try {
        await dbConnect();

        const specializations = await Specializations.find({}, '_id name slug name_en')

        return NextResponse.json({
            type: 'success',
            data: specializations,
        });
    } catch (error) {
        console.error('Get Specializations Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}