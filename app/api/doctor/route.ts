import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Accounts from '@/models/Accounts';
import '@/models/Users'; // Ensure model is registered
import '@/models/Faqs'; // Ensure model is registered
import '@/models/Articles'; // Ensure model is registered
import mongoose from 'mongoose';


export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const domain = searchParams.get("domain");

        await dbConnect();
        console.log('Registered Models:', Object.keys(mongoose.models));

        const doctor = await Accounts.findOne({ domain: domain })
            .populate('user')
            // .populate('user')
            .populate('faqs')
            .populate('articles')
            // .populate('testimonials')
            // .populate('expertise')
            // .populate('videos')
            // .populate('social')

        if (!doctor) {
            return NextResponse.json(
                { message: 'Doctor not found', type: 'error' },
                { status: 404 }
            );
        }

        return NextResponse.json(doctor);
    } catch (error) {
        console.error('Get Doctor Error:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
