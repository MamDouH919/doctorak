// app/api/faqs/delete/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import FAQ from '@/models/Faqs';
import { withAuth } from '@/lib/withAuth';

// Delete handler
async function handler(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;

    if (!id) {
      return NextResponse.json({ message: 'ID is required' }, { status: 400 });
    }

    await dbConnect();

    // Find FAQ by ID
    const faq = await FAQ.findOne({ _id: id });

    if (!faq) {
      return NextResponse.json({ message: 'FAQ not found' }, { status: 404 });
    }

    // Delete the FAQ
    await faq.deleteOne();

    return NextResponse.json({ message: 'FAQ deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Delete FAQ Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// Make sure to pass context.params into the handler
export const DELETE = (
  req: NextRequest,
  context: { params: { id: string } }
) => withAuth(req, (req, user) => handler(req, context), { allowRoles: ['admin', 'user'] });
