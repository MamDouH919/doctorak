// handle get specializations
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Specializations from '@/models/Specialization';

export async function GET(req: NextRequest) {
    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get('limit') || '0');

        const specializations = await Specializations.find({}, '_id name slug name_en')
            .limit(limit || 0); // if limit is 0, return all

        return NextResponse.json({
            type: 'success',
            data: specializations,
        });
    } catch (error) {
        console.error('Get Specializations Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
