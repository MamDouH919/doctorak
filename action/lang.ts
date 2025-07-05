// set language
"use server";
import { cookies } from 'next/headers';

export const setLang = async (lang: string) => {
    const cookieStore = cookies();
    (await cookieStore).set('i18next', lang);
};

export const getLang = async () => {
    const cookieStore = cookies();
    const token = (await cookieStore).get('NEXT_LOCALE');
    return token?.value;
};