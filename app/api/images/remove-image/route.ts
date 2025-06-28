// app/api/delete-image/route.ts
import { z } from 'zod';
import { NextRequest } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Account from '@/models/Accounts';
import Image from '@/models/Images';
import { deleteFromFirebase } from '@/firebase';

import { withAuth } from '@/lib/withAuth';
import { withErrorHandler } from '@/lib/api/withErrorHandler';
import { success } from '@/lib/api/response';
import { ValidationError, AppError } from '@/lib/api/errors';

// ✅ Zod schema for request body
const DeleteImageSchema = z.object({
  accountId: z.string().min(1, 'accountId is required'),
  imagePath: z.string().min(1, 'imagePath is required'),
});

// ✅ Main handler
const handler = async (req: NextRequest) => {
  const body = await req.json();
  const parsed = DeleteImageSchema.safeParse(body);

  if (!parsed.success) {
    const errors = parsed.error.issues.map(issue => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));
    throw new ValidationError(errors);
  }

  const { accountId, imagePath } = parsed.data;

  await dbConnect();

  // 1. Delete image from Firebase
  await deleteFromFirebase(imagePath);

  // 2. Remove profile image from account
  const updatedAccount = await Account.findByIdAndUpdate(
    accountId,
    { $unset: { image: '' } }, // assuming field is 'image'
    { new: true }
  );

  if (!updatedAccount) {
    throw new AppError('Account not found', 404, 'custom');
  }

  // 3. Delete image document from database
  await Image.deleteOne({ account: accountId });

  return success({
    message: 'Image deleted successfully',
    account: updatedAccount,
  });
};

// ✅ Export with auth & error handler
export const DELETE = (req: NextRequest) =>
  withAuth(req, withErrorHandler(handler), {
    allowRoles: ['admin', 'user'],
  });