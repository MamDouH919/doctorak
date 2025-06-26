// app/api/users/route.ts
import { NextRequest } from 'next/server';
import { z } from 'zod';

import dbConnect from '@/lib/dbConnect';
import Users from '@/models/Users';

import { withErrorHandler } from '@/lib/api/withErrorHandler';
import { success } from '@/lib/api/response';
import { ValidationError, AppError } from '@/lib/api/errors';
import { withAuth } from '@/lib/withAuth';
import { emailActivation } from '@/lib/mail';

// ✅ Zod schema for input
const ToggleUserSchema = z.object({
    id: z.string().min(1, 'User ID is required'),
});

// ✅ Core handler
const handler = async (req: NextRequest) => {
    const body = await req.json();

    const parsed = ToggleUserSchema.safeParse(body);
    if (!parsed.success) {
        const errors = parsed.error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message,
        }));
        throw new ValidationError(errors);
    }

    const { id } = parsed.data;

    await dbConnect();

    const user = await Users.findById(id);

    if (!user) {
        throw new AppError('User not found', 404, 'custom');
    }

    user.active = !user.active;
    await user.save();

    await emailActivation(user.email, user.active);

    return success({ message: 'User updated successfully', user });
};

// ✅ Export with auth and error handling
export const POST = (req: NextRequest) =>
    withAuth(req, withErrorHandler(handler), { allowRoles: ['admin'] });