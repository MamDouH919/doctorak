// app/api/governorate/route.ts
import { NextRequest } from 'next/server';
import Governorate from '@/models/Governorate';
import dbConnect from '@/lib/dbConnect'; // make sure this is imported
import { withErrorHandler } from '@/lib/api/withErrorHandler';
import { success } from '@/lib/api/response';

export const GET = withErrorHandler(async (_req: NextRequest) => {
    await dbConnect(); // ensure connection before querying

    const governorates = await Governorate.find({}, '_id name');
    return success({ governorates });
});
