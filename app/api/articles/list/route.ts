import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import ARTICLES from '@/models/Articles';
import { withAuth } from '@/lib/withAuth';
import '@/models/Accounts';
import '@/models/Users';

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
      let articlesQuery = ARTICLES.find(query).skip(skip).limit(limit);

      // Apply population only for admins
      if (user.role === 'admin') {
        articlesQuery = articlesQuery
          .populate({
            path: 'account',
            select: '_id',
            populate: {
              path: 'user',
              select: '_id name',
            },
          });
      }

      const [articles, total] = await Promise.all([
        articlesQuery,
        ARTICLES.countDocuments(query),
      ]);

      return NextResponse.json({
        type: 'success',
        data: articles,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error('Get Articles Error:', error);
      return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
  }, {
    allowRoles: ['admin', 'user'],
  });
}
