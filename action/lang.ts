// set language
"use server";
import { cookies } from 'next/headers';

export const setLang = async (lang: string) => {
    const cookieStore = cookies();
    (await cookieStore).set('i18next', lang);
};