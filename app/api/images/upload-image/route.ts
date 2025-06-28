// app/api/image/upload/route.ts
import { z } from 'zod';
import { NextRequest } from 'next/server';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

import { storage } from '@/firebase';
import dbConnect from '@/lib/dbConnect';
import Accounts from '@/models/Accounts';
import ImageModel from '@/models/Images';

import '@/models/Clinics';   // ensure populate dependencies are loaded
import '@/models/Faqs';
import '@/models/Articles';

import { withAuth } from '@/lib/withAuth';
import { withErrorHandler } from '@/lib/api/withErrorHandler';
import { success } from '@/lib/api/response';
import { ValidationError, AppError } from '@/lib/api/errors';

// ✅ Zod schema to validate form fields
const formSchema = z.object({
  accountId: z.string().min(1, 'accountId is required'),
  alt: z.string().optional(),
});

const handler = async (req: NextRequest) => {
  await dbConnect();

  const formData = await req.formData();
  const file = formData.get('file') as File;
  const accountId = formData.get('accountId')?.toString();
  const alt = formData.get('alt')?.toString();

  // ✅ Validate using Zod
  const parsed = formSchema.safeParse({ accountId, alt });
  if (!parsed.success) {
    const errors = parsed.error.issues.map(issue => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));
    throw new ValidationError(errors);
  }

  if (!file) {
    throw new ValidationError([{ field: 'file', message: 'File is required' }]);
  }

  const account = await Accounts.findById(parsed.data.accountId);
  if (!account) {
    throw new AppError('Account not found', 404, 'custom');
  }

  // ✅ Process file
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const extension = file.name.split('.').pop() || 'jpg';
  const filename = `${uuidv4()}.${extension}`;
  const storageRef = ref(storage, `dakatrah/profile-images/${filename}`);

  await uploadBytes(storageRef, buffer, { contentType: file.type });
  const url = await getDownloadURL(storageRef);

  // ✅ Remove existing image
  await ImageModel.findOneAndDelete({ account: account._id });

  // ✅ Save new image
  const image = await ImageModel.create({
    url,
    alt: parsed.data.alt || file.name,
    account: account._id,
  });

  account.image = image._id;
  await account.save();

  return success({
    message: 'Image uploaded successfully',
    data: image,
  });
};

// ✅ Auth + Error handling
export const POST = (req: NextRequest) =>
  withAuth(req, withErrorHandler(handler), {
    allowRoles: ['admin', 'user'],
  });