import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Accounts from '@/models/Accounts';
import '@/models/Specialization';
import '@/models/Images';
import '@/models/Users';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const showInHomePage = searchParams.get('showInHomePage');
        const name = searchParams.get('name');
        const specializationId = searchParams.get('specialty');
        const governorateId = searchParams.get('governorate');
        const cityId = searchParams.get('city');

        const match: any = {
            active: true,
        };

        if (showInHomePage !== null) {
            match.showInHomePage = showInHomePage === 'true';
        }

        if (specializationId && mongoose.Types.ObjectId.isValid(specializationId)) {
            match.specialization = new mongoose.Types.ObjectId(specializationId);
        }

        if (governorateId && mongoose.Types.ObjectId.isValid(governorateId)) {
            match.governorates = { $in: [new mongoose.Types.ObjectId(governorateId)] };
        }

        if (cityId && mongoose.Types.ObjectId.isValid(cityId)) {
            match.cities = { $in: [new mongoose.Types.ObjectId(cityId)] };
        }

        const pipeline: any[] = [
            { $match: match },

            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user',
                },
            },
            { $unwind: '$user' },

            ...(name
                ? [{
                    $match: {
                        'user.name': { $regex: name, $options: 'i' },
                    },
                }]
                : []),

            {
                $lookup: {
                    from: 'images',
                    localField: 'image',
                    foreignField: '_id',
                    as: 'image',
                },
            },
            {
                $unwind: {
                    path: '$image',
                    preserveNullAndEmptyArrays: true,
                },
            },

            {
                $lookup: {
                    from: 'specializations',
                    localField: 'specialization',
                    foreignField: '_id',
                    as: 'specialization',
                },
            },
            {
                $unwind: {
                    path: '$specialization',
                    preserveNullAndEmptyArrays: true,
                },
            },

            {
                $lookup: {
                    from: 'governorates',
                    localField: 'governorates',
                    foreignField: '_id',
                    as: 'governorates',
                },
            },
            {
                $lookup: {
                    from: 'cities',
                    localField: 'cities',
                    foreignField: '_id',
                    as: 'cities',
                },
            },

            {
                $project: {
                    _id: 1,
                    domain: 1,
                    siteName: 1,
                    visitors: 1,
                    description: 1,
                    image: { _id: 1, url: 1, alt: 1 },
                    user: { _id: 1, name: 1 },
                    specialization: {
                        _id: 1,
                        name: 1,
                        name_en: 1,
                        slug: 1,
                    },
                    governorates: 1,
                    cities: 1,
                },
            },
        ];

        const accounts = await Accounts.aggregate(pipeline);

        return NextResponse.json({
            type: 'success',
            data: accounts,
        });
    } catch (error) {
        console.error('Get Accounts Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
