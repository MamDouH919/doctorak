'use client';

import { CacheProvider } from '@emotion/react';
import { ThemeProvider, CssBaseline } from '@mui/material';

import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import getTheme from '@/app/theme';
import { Toaster } from 'sonner';
import createEmotionCache from '@/app/[locale]/createEmotionCache';

function ThemeRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  const { i18n } = useTranslation();
  console.log(i18n.language);

  const isRtl = i18n.dir() === 'rtl';
  console.log(isRtl);

  const cache = useMemo(() => createEmotionCache(isRtl), [isRtl]);

  const theme = useMemo(() => getTheme({
    primary: "#880808",
    secondary: "#87af2a",
    dir: isRtl ? "rtl" : "ltr"
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [isRtl]);


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

export default memo(ThemeRegistry);
