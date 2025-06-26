import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Clinics from '@/models/Clinics';
import { withAuth } from '@/lib/withAuth';
import '@/models/Accounts';
import '@/models/Users';
import '@/models/Governorate';
import '@/models/Cities';

export async function GET(req: NextRequest) {
  return withAuth(req, async (req, user) => {
    try {
      await dbConnect();

      const { searchParams } = new URL(req.url);
      const page = parseInt(searchParams.get('page') || '1', 10);
      const limit = parseInt(searchParams.get('limit') || '20', 10);
      const skip = (page - 1) * limit;

      // Build base query
      const query: any = {};
      if (user.role !== 'admin') {
        if (!user.accountId) {
          return NextResponse.json({ message: 'Missing account ID in token' }, { status: 400 });
        }
        query.account = user.accountId;
      }

      // Base find query
      let clinicsQuery = Clinics.find(query).skip(skip).limit(limit)
        .populate('governorate', '_id name')
        .populate('city', '_id name')

      // Apply population only for admins
      if (user.role === 'admin') {
        clinicsQuery = clinicsQuery
          .populate({
            path: 'account',
            select: '_id',
            populate: {
              path: 'user',
              select: '_id name',
            },
          });
      }

      const [clinics, total] = await Promise.all([
        clinicsQuery,
        Clinics.countDocuments(query),
      ]);

      return NextResponse.json({
        type: 'success',
        data: clinics,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error('Get Clinics Error:', error);
      return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
  }, {
    allowRoles: ['admin', 'user'],
  });
}
