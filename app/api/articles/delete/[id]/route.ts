import { NextRequest } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Article from '@/models/Articles';

import { withAuth } from '@/lib/withAuth';
import { withErrorHandler } from '@/lib/api/withErrorHandler';
import { success } from '@/lib/api/response';
import { AppError, ValidationError } from '@/lib/api/errors';

const handler = async (req: NextRequest) => {
  const id = req.nextUrl.pathname.split('/').pop();

  if (!id) {
    throw new ValidationError([{ field: 'id', message: 'Article ID is required' }]);
  }

  await dbConnect();

  const article = await Article.findById(id);
  if (!article) {
    throw new AppError('Article not found', 404, 'custom');
  }

  await article.deleteOne();

  return success({ message: 'Article deleted successfully' });
};

export const DELETE = (req: NextRequest) =>
  withAuth(req, withErrorHandler(handler), {
    allowRoles: ['admin', 'user'],
  });