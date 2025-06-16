// app/api/accounts/[id]/route.ts

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Accounts from '@/models/Accounts';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params; // ✅ no await needed here


  try {
    await dbConnect();

    const account = await Accounts.findById(id);

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
