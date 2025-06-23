'use client';

import { CacheProvider } from '@emotion/react';
import { ThemeProvider, CssBaseline } from '@mui/material';

import { useMemo } from 'react';
import createEmotionCache from '@/app/createEmotionCache';
import { useTranslation } from 'react-i18next';
import getTheme from '@/app/theme';
import { Toaster } from 'sonner';

export default function ThemeRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  const { i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';
  const cache = useMemo(() => createEmotionCache(isRtl), [isRtl]);

  const theme = useMemo(() => getTheme({
    primary: "#880808",
    secondary: "#87af2a",
    dir: isRtl ? "rtl" : "ltr"
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), []);

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Toaster richColors toastOptions={{
          style: {
            fontFamily: [`cairo`, "sans-serif"].join(","),
            fontSize: 12.5,
          },
        }}
        />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}
