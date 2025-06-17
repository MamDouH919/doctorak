// app/api/faqs/delete/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import FAQ from '@/models/Faqs';
import { withAuth } from '@/lib/withAuth';

async function handler(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop(); // manually extract id from path

    if (!id) {
      return NextResponse.json({ message: 'ID is required' }, { status: 400 });
    }

    await dbConnect();

    const faq = await FAQ.findById(id);

    if (!faq) {
      return NextResponse.json({ message: 'FAQ not found' }, { status: 404 });
    }

    await faq.deleteOne();

    return NextResponse.json({ message: 'FAQ deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Delete FAQ Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export const DELETE = (req: NextRequest) =>
  withAuth(req, (req, user) => handler(req), {
    allowRoles: ['admin', 'user'],
  });
