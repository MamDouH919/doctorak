import type { Metadata } from "next";
import { I18nProvider } from "./i18n-provider";
import Providers from "@/lib/Providers";
import { getToken } from "@/action/token";
// import { getLang } from "@/action/lang";
// import { seedSpecializations } from "@/scripts/seedSpecializations";
// import { seedGovernorate } from "@/scripts/seedGovernorates";
// import dbConnect from "@/lib/dbConnect";
// import { seedCities } from "@/scripts/seedCities";
import { dir } from 'i18next';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: 'ar' | 'en' }> }) {
  const { locale } = await params;
  return {
    title: locale === 'ar' ? process.env.NEXT_PUBLIC_APP_NAME_AR : process.env.NEXT_PUBLIC_APP_NAME_EN,
    description: locale === 'ar'
      ? `${process.env.NEXT_PUBLIC_APP_NAME_AR} منصة طبية شاملة تجمع أفضل الدكاترة في مكان واحد لتسهيل الوصول إلى الرعاية الصحية المناسبة.`
      : `${process.env.NEXT_PUBLIC_APP_NAME_EN} is a medical platform that connects you with top doctors in one place.`,
    keywords: locale === 'ar'
      ? [process.env.NEXT_PUBLIC_APP_NAME_AR, 'دكتور', 'منصة طبية', 'الأطباء']
      : [process.env.NEXT_PUBLIC_APP_NAME_EN, 'Doctors', 'Medical platform', 'Find doctors', 'Healthcare'],
    authors: [{ name: 'Mamdouh Mohammed' }],
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      languages: {
        en: '/en',
        ar: '/ar',
      },
    },
    metadataBase: new URL('https://test.3n-dev.com'), // ✅ ضع الدومين الفعلي هنا
    openGraph: {
      title: locale === 'ar' ? process.env.NEXT_PUBLIC_APP_NAME_AR : process.env.NEXT_PUBLIC_APP_NAME_EN,
      description: locale === 'ar'
        ? `${process.env.NEXT_PUBLIC_APP_NAME_AR} منصة طبية شاملة تجمع أفضل الدكاترة في مكان واحد لتسهيل الوصول إلى الرعاية الصحية المناسبة.`
        : `${process.env.NEXT_PUBLIC_APP_NAME_EN} is a medical platform that connects you with top doctors in one place.`,
      type: 'website',
      locale: locale === 'ar' ? 'ar_EG' : 'en_US',
      url: locale === 'ar' ? 'https://test.3n-dev.com/ar' : 'https://test.3n-dev.com/en',
      siteName: locale === 'ar' ? process.env.NEXT_PUBLIC_APP_NAME_AR : process.env.NEXT_PUBLIC_APP_NAME_EN,
    },
    twitter: {
      card: 'summary_large_image',
      title: locale === 'ar' ? process.env.NEXT_PUBLIC_APP_NAME_AR : process.env.NEXT_PUBLIC_APP_NAME_EN,
      description: locale === 'ar'
        ? `${process.env.NEXT_PUBLIC_APP_NAME_AR} منصة طبية شاملة تجمع أفضل الدكاترة في مكان واحد.`
        : `${process.env.NEXT_PUBLIC_APP_NAME_EN} is a platform that brings top doctors together.`,
      creator: '@daktarah',
    },
  };

}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: 'ar' | 'en' }>;
}) {
  // get token from cookie


  // async function initialize() {
  //   await dbConnect();
  //   // await seedSpecializations();
  //   // await seedGovernorate();
  //   await seedCities();
  // }

  // initialize();
  // return <html lang="ar" dir="rtl">
  //   <head>
  //   </head>
  //   <body>
  //     mamdouh
  //   </body>
  // </html>
  const { locale } = await params
  const token = await getToken();
  const direction = dir(locale);

  return (
    <html lang={locale} dir={direction}>
      <head>

        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@100;200;300;400;500;600;700&display=swap"
          rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@200;300;400;500;600;700&display=swap"
          rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Kufi+Arabic:wght@100..900&display=swap" rel="stylesheet" />

        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Libre+Barcode+39+Text&amp;display=swap" />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />

        <link
          href="https://fonts.googleapis.com/css2?family=Exo+2:wght@100..900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&family=Rubik+Vinyl&family=Urbanist:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"></link>

        <meta name="revisit-after" content="7 days" />
        <meta name="language" content="ar" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <link rel="icon" type="image/webp" href="/logo.webp" />

        <link
          rel="canonical"
          href={`https://test.3n-dev.com/${locale}`}
        />
        {/* <link rel="icon" type="image/svg+xml" href={FAVICON} /> */}
      </head>
      <body>
        <I18nProvider lang={locale}>
          <Providers token={token}>
            {children}
          </Providers>
        </I18nProvider>
      </body>
    </html>
  );
}
