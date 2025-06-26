// app/api/logout/route.ts
import { cookies } from 'next/headers';
import { withErrorHandler } from '@/lib/api/withErrorHandler';
import { success } from '@/lib/api/response';

export const POST = withErrorHandler(async (_req: Request) => {
  const cookieStore = cookies();

  // Delete token cookie
  (await cookieStore).delete('token');

  return success({ message: 'تم تسجيل الخروج بنجاح' });
});