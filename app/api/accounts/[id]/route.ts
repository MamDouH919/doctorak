// app/api/accounts/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Accounts from '@/models/Accounts';
import '@/models/Images';
import '@/models/Users';


export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // Extract id from URL
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop(); // gets the last segment in path (i.e. the [id])

    if (!id) {
      return NextResponse.json(
        { message: 'Missing account ID', type: 'error' },
        { status: 400 }
      );
    }

    const account = await Accounts.findById(id)
      .populate('image')
      .populate('user')

    if (!account) {
      return NextResponse.json(
        { message: 'Account not found', type: 'error' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      type: 'success',
      data: account,
    });
  } catch (error) {
    console.error('Get Account Error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}