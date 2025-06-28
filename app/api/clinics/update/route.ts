// app/api/faqs/update/route.ts
import { z } from 'zod';
import { NextRequest } from 'next/server';

import dbConnect from '@/lib/dbConnect';
import Clinics from '@/models/Clinics';
import { withAuth } from '@/lib/withAuth';
import { withErrorHandler } from '@/lib/api/withErrorHandler';
import { ValidationError, AppError } from '@/lib/api/errors';
import { success } from '@/lib/api/response';
import { syncRelation } from '@/lib/relationManager';

import Accounts from '@/models/Accounts';

// ✅ Zod Schema
const ClinicUpdateSchema = z.object({
    id: z.string().min(1, 'ID is required'),
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

// ✅ Handler Logic
const handler = async (req: NextRequest) => {
    const body = await req.json();
    const parsed = ClinicUpdateSchema.safeParse(body);

    if (!parsed.success) {
        const errors = parsed.error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message,
        }));
        throw new ValidationError(errors);
    }

    const { id,
        name,
        phone,
        address,
        mobile,
        governorate,
        city,
        appointments,
        account
    } = parsed.data;

    await dbConnect();

    const clinics = await Clinics.findOne({ _id: id, account });

    if (!clinics) {
        throw new AppError('FAQ not found or unauthorized', 404, 'custom');
    }

    const oldGovernorate = clinics.governorate._id;
    const oldCity = clinics.city._id;

    clinics.name = name;
    clinics.phone = phone;
    clinics.address = address;
    clinics.mobile = mobile;
    clinics.governorate = governorate;
    clinics.city = city;
    clinics.appointments = appointments;

    await clinics.save();

    if (governorate !== oldGovernorate) {
        console.log(governorate);
        console.log(oldGovernorate);
        
        await syncRelation({
            model: Accounts,
            docId: clinics.account,
            field: 'governorates',
            value: oldGovernorate,
            action: 'remove',
        });
        await syncRelation({
            model: Accounts,
            docId: account,
            field: 'governorates',
            value: governorate,
            action: 'add',
        });
    }

    if (city !== oldCity) {
        await syncRelation({
            model: Accounts,
            docId: clinics.account,
            field: 'cities',
            value: oldCity,
            action: 'remove',
        });

        await syncRelation({
            model: Accounts,
            docId: account,
            field: 'cities',
            value: city,
            action: 'add',
        });
    }

    return success({
        message: 'FAQ updated successfully',
        data: clinics,
    });
};

// ✅ Export with auth + error handling
export const PUT = (req: NextRequest) =>
    withAuth(req, withErrorHandler(handler), {
        allowRoles: ['admin', 'user'],
    });