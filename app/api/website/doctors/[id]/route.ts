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
import '@/models/Cities';

const querySchema = z.object({
    id: z.string().min(1, 'Id is required'),
});

const handler = async (req: NextRequest) => {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop(); // gets the last segment in path (i.e. the [id])

    const validated = querySchema.safeParse({ id });

    if (!validated.success) {
        const issues = validated.error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message,
        }));
        throw new ValidationError(issues);
    }

    await dbConnect();

    const doctor = await Accounts.findOne({ _id: validated.data.id })
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

    if (!doctor) {
        throw new AppError('Doctor not found', 404, 'custom', 'DoctorNotFound');
    }

    return success({ doctor });
};

export const GET = withErrorHandler(handler);