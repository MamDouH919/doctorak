import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from '../locales/en';
import ar from '../locales/ar';

i18n
    .use(LanguageDetector) // detects language from localStorage, cookies, etc.
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            ar: { translation: ar },
        },
        fallbackLng: 'ar',
        interpolation: {
            escapeValue: false, // React already escapes by default
        },
    });

export default i18n;
