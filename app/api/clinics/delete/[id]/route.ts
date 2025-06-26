import { NextRequest } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Clinics from '@/models/Clinics';

import { withAuth } from '@/lib/withAuth';
import { withErrorHandler } from '@/lib/api/withErrorHandler';
import { success } from '@/lib/api/response';
import { AppError, ValidationError } from '@/lib/api/errors';

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

  await clinics.deleteOne();

  return success({ message: 'Clinics deleted successfully' });
};

export const DELETE = (req: NextRequest) =>
  withAuth(req, withErrorHandler(handler), {
    allowRoles: ['admin', 'user'],
  });