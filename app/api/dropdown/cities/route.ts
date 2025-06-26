// app/api/dropdown/cities/route.ts
import { NextRequest } from 'next/server';
import { withErrorHandler } from '@/lib/api/withErrorHandler';
import { success } from '@/lib/api/response';
import { ValidationError } from '@/lib/api/errors';

import dbConnect from '@/lib/dbConnect';
import Cities from '@/models/Cities';

export const GET = withErrorHandler(async (req: NextRequest) => {
    const { searchParams } = new URL(req.url);
    const governorateId = searchParams.get('id');

    if (!governorateId) {
        throw new ValidationError([{ field: 'id', message: 'Governorate ID is required' }]);
    }

    await dbConnect();

    const cities = await Cities.find({ governorate: governorateId }).select('_id name');

    return success({ cities });
});