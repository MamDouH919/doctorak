import { NextRequest } from 'next/server';
import { z } from 'zod';

import dbConnect from '@/lib/dbConnect';
import Clinics from '@/models/Clinics';
import Accounts from '@/models/Accounts';

import { withAuth } from '@/lib/withAuth';
import { withErrorHandler } from '@/lib/api/withErrorHandler';
import { success } from '@/lib/api/response';
import { ValidationError, AppError } from '@/lib/api/errors';
import { syncRelation } from '@/lib/relationManager';


// name: string,
//     phone: string,
//     address: string,
//     mobile: string,
//     governorate: string,
//     city: string,

//     appointments: {
//         day: string,
//         start_time: string,
//         end_time: string
//     }[],
//     account: string
// ✅ Zod validation schema
const ClinicSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    phone: z.string().min(1, 'Phone is required'),
    address: z.string().min(1, 'Address is required'),
    mobile: z.string().min(1, 'Mobile is required'),
    governorate: z.string().min(1, 'Governorate is required'),
    city: z.string().min(1, 'City is required'),

    appointments: z.array(z.object({
        day: z.string().min(1, 'Day is required'),
        timeFrom: z.string().min(1, 'Start time is required'),
        timeTo: z.string().min(1, 'End time is required'),
    })),

    account: z.string().min(1, 'Account ID is required'),
});

// ✅ Actual handler function
const handler = async (req: NextRequest) => {
    const body = await req.json();
    const parsed = ClinicSchema.safeParse(body);

    if (!parsed.success) {
        const errors = parsed.error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message,
        }));
        throw new ValidationError(errors);
    }

    const { name, phone, address, mobile, governorate, city, appointments, account } = parsed.data;

    await dbConnect();

    const accountDoc = await Accounts.findById(account);
    if (!accountDoc) {
        throw new AppError('Account not found or unauthorized', 404, 'custom');
    }

    const clinic = await Clinics.create({
        name,
        phone,
        address,
        mobile,
        governorate,
        city,
        appointments,
        account,
    });

    await syncRelation({
        model: Accounts,
        docId: account,
        field: 'clinics',
        value: clinic._id,
        action: 'add',
    });

    await syncRelation({
        model: Accounts,
        docId: account,
        field: 'governorates',
        value: governorate,
        action: 'add',
    });

    await syncRelation({
        model: Accounts,
        docId: account,
        field: 'cities',
        value: city,
        action: 'add',
    });

    return success({
        message: 'clinics created successfully',
        data: clinic,
    });
};

// ✅ Wrap with auth and error handling
export const POST = (req: NextRequest) =>
    withAuth(req, withErrorHandler(handler), {
        allowRoles: ['admin', 'user'],
    });