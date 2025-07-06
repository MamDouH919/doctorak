'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';

export function useLocalizedRouter() {
    const router = useRouter();
    const pathname = usePathname(); // e.g. "/ar/home"
    const { i18n } = useTranslation();

    const locale = pathname.split('/')[1] || i18n.language || 'ar';

    const getLocalizedPath = (path: string) => {
        // Remove any leading slashes just in case
        const cleanPath = path.startsWith('/') ? path.slice(1) : path;
        console.log(cleanPath);
        
        return `/${locale}/${cleanPath}`;
    };

    const push = (path: string) => {
        router.push(getLocalizedPath(path));
    };

    const replace = (path: string) => {
        router.replace(getLocalizedPath(path));
    };

    return {
        push,
        replace,
        getLocalizedPath,
        locale,
    };
}
