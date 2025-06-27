import { NextRequest } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Clinics from '@/models/Clinics';
import Accounts from '@/models/Accounts';

import { withAuth } from '@/lib/withAuth';
import { withErrorHandler } from '@/lib/api/withErrorHandler';
import { success } from '@/lib/api/response';
import { AppError, ValidationError } from '@/lib/api/errors';
import { syncRelation } from '@/lib/relationManager';

const handler = async (req: NextRequest) => {
  const id = req.nextUrl.pathname.split('/').pop();

  if (!id) {
    throw new ValidationError([{ field: 'id', message: 'Clinics ID is required' }]);
  }

  await dbConnect();

  const clinics = await Clinics.findById(id);
  if (!clinics) {
    throw new AppError('Clinics not found', 404, 'custom');
  }

  await syncRelation({
    model: Accounts,
    docId: clinics.account,
    field: 'clinics',
    value: clinics._id,
    action: 'remove',
  });
  
  await clinics.deleteOne();

  return success({ message: 'Clinics deleted successfully' });
};

export const DELETE = (req: NextRequest) =>
  withAuth(req, withErrorHandler(handler), {
    allowRoles: ['admin', 'user'],
  });