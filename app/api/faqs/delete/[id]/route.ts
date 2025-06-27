import { NextRequest } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import FAQ from '@/models/Faqs';
import Accounts from '@/models/Accounts';

import { withAuth } from '@/lib/withAuth';
import { withErrorHandler } from '@/lib/api/withErrorHandler';
import { success } from '@/lib/api/response';
import { AppError, ValidationError } from '@/lib/api/errors';
import { syncRelation } from '@/lib/relationManager';

const handler = async (req: NextRequest) => {
  const id = req.nextUrl.pathname.split('/').pop();

  if (!id) {
    throw new ValidationError([{ field: 'id', message: 'FAQ ID is required' }]);
  }

  await dbConnect();

  const faq = await FAQ.findById(id);
  if (!faq) {
    throw new AppError('FAQ not found', 404, 'custom');
  }

  await syncRelation({
    model: Accounts,
    docId: faq.account,
    field: 'faqs',
    value: faq._id,
    action: 'remove',
  });

  await faq.deleteOne();

  return success({ message: 'FAQ deleted successfully' });
};

export const DELETE = (req: NextRequest) =>
  withAuth(req, withErrorHandler(handler), {
    allowRoles: ['admin', 'user'],
  });