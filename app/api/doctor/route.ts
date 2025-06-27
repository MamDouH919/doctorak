// app/api/doctor/route.ts
import { z } from 'zod';
import { NextRequest } from 'next/server';
import { withErrorHandler } from '@/lib/api/withErrorHandler';
import { success } from '@/lib/api/response';
import { ValidationError, AppError } from '@/lib/api/errors';

import dbConnect from '@/lib/dbConnect';
import Accounts from '@/models/Accounts';

// Register related models (required for .populate)
import '@/models/Clinics';
import '@/models/Faqs';
import '@/models/Articles';
import '@/models/Users';
import '@/models/Specialization';
import '@/models/Images';
import '@/models/Governorate';

const querySchema = z.object({
    domain: z.string().min(1, 'Domain is required'),
});

const handler = async (req: NextRequest) => {
    const { searchParams } = req.nextUrl;
    const domain = searchParams.get('domain');

    const validated = querySchema.safeParse({ domain });

    if (!validated.success) {
        const issues = validated.error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message,
        }));
        throw new ValidationError(issues);
    }

    await dbConnect();

    const doctor = await Accounts.findOne({ domain: validated.data.domain })
        .populate('faqs')
        .populate('articles')
        .populate({
            path: 'clinics',
            populate: [
                { path: 'governorate', select: 'name' }, // populate governorate name
                { path: 'city', select: 'name' }         // populate city name
            ]
        })
        .populate('specialization')
        .populate('image')
        // populate user and select _id and name and active
        .populate({
            path: 'user',
            select: '_id name active',
        })

    console.log(doctor);

    if (!doctor) {
        throw new AppError('Doctor not found', 404, 'custom', 'DoctorNotFound');
    }

    return success({ doctor });
};

export const GET = withErrorHandler(handler);