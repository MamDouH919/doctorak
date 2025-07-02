'use client';

import { ReactNode, useEffect } from 'react';
import '../lib/i18n';
import { useTranslation } from 'react-i18next';
import { setLang } from '@/action/lang';

export function I18nProvider({ children }: { children: ReactNode }) {
  // const { i18n } = useTranslation();

  // const changeLanguage = async () => {
  //   await setLang("ar");
  // };

  // useEffect(() => {
  //   // changeLanguage();
  //   localStorage.setItem('i18next', 'ar');
  //   // Set <html dir=""> and <html lang="">
  //   const dir = "rtl";
  //   const lang = "ar";

  //   document.documentElement.setAttribute('dir', dir);
  //   document.documentElement.setAttribute('lang', lang);
  // }, [i18n.language]); // Re-run when language changes

  return <>{children}</>;
}
