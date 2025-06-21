import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import ARTICLES from '@/models/Articles';
import { withAuth } from '@/lib/withAuth';

async function handler(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop(); // manually extract id from path

    if (!id) {
      return NextResponse.json({ message: 'ID is required' }, { status: 400 });
    }

    await dbConnect();

    const articles = await ARTICLES.findById(id);

    if (!articles) {
      return NextResponse.json({ message: 'articles not found' }, { status: 404 });
    }

    await articles.deleteOne();

    return NextResponse.json({ message: 'articles deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Delete articles Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export const DELETE = (req: NextRequest) =>
  withAuth(req, (req, user) => handler(req), {
    allowRoles: ['admin', 'user'],
  });
