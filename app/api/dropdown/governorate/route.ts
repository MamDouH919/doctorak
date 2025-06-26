// app/api/governorate/route.ts
import { NextRequest } from 'next/server';
import Governorate from '@/models/Governorate';

import { withErrorHandler } from '@/lib/api/withErrorHandler';
import { success } from '@/lib/api/response';

export const GET = withErrorHandler(async (_req: NextRequest) => {
    const governorates = await Governorate.find({}, '_id name')

    return success({  governorates });
});