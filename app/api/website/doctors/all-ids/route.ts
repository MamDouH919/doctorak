// app/api/doctors/ids/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Doctor from '@/models/Accounts';

export async function GET() {
    try {
        await dbConnect();

        const doctors = await Doctor.find({ active: true }, { _id: 1 }); // ✅ فقط الـ active

        const ids = doctors.map((doc) => ({
            id: doc._id.toString(),
        }));

        return NextResponse.json(ids);
    } catch (error) {
        console.error('Error fetching doctor IDs:', error);
        return new NextResponse(
            JSON.stringify({ error: 'Failed to fetch doctor IDs' }),
            { status: 500 }
        );
    }
}
