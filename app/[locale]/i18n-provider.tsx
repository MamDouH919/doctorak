'use client';

import { ReactNode, useEffect } from 'react';
import { dir } from 'i18next';
import i18n from '@/lib/i18n';

export function I18nProvider({ children, lang }: { children: ReactNode; lang: 'ar' | 'en' }) {
  useEffect(() => {
    console.log(lang);
    document.cookie = `NEXT_LOCALE=${lang}; path=/; max-age=31536000`;
    const direction = dir(lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = direction;
    i18n.changeLanguage(lang);
  }, [lang]);

  return <>{children}</>;
}
