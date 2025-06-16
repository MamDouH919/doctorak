// lib/verifyToken.ts
import jwt from 'jsonwebtoken';

export function verifyToken(token: string) {
    try {
        return jwt.verify(token, process.env.JWT_SECRET!);
    } catch (err) {
        throw new Error('Invalid or expired token');
    }
}
