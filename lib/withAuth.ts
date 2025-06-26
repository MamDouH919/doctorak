// lib/withAuth.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './verifyToken';

// Add an options parameter to allow role-based access
type AuthOptions = {
    allowRoles?: string[]; // e.g. ['admin']
};

export async function withAuth(
    req: NextRequest,
    handler: (req: NextRequest, user: any) => Promise<Response>,
    options: AuthOptions = { allowRoles: ['admin'] } // default: only admins allowed
) {
    const token = req.cookies.get('token')?.value;

    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const user = verifyToken(token);

        // Type guard: ensure user is an object with a role property
        if (
            typeof user !== 'object' ||
            user === null ||
            !('role' in user) ||
            (options.allowRoles && !options.allowRoles.includes((user as any).role))
        ) {
            return NextResponse.json({ error: 'Forbidden: Insufficient permissions' }, { status: 403 });
        }

        return await handler(req, user);
    } catch (err) {
        console.log(err);
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
}
