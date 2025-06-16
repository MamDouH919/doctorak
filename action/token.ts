// get token from cookie
"use server";
import { cookies } from 'next/headers';

export const getToken = async () => {
    const cookieStore = cookies();
    const token = (await cookieStore).get('token');
    return token?.value;
};

// remove token from cookie
export const removeToken = async () => {
    const cookieStore = cookies();
    (await cookieStore).delete('token');
};