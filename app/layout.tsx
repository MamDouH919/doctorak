import type { Metadata } from "next";
import { I18nProvider } from "./i18n-provider";
import Providers from "@/lib/Providers";
import { getToken } from "@/action/token";
// import { seedSpecializations } from "@/scripts/seedSpecializations";
// import { seedGovernorate } from "@/scripts/seedGovernorates";
// import dbConnect from "@/lib/dbConnect";
// import { seedCities } from "@/scripts/seedCities";

export const metadata: Metadata = {
  title: "دكاترة",
  description: "دكاترة منصة طبية شاملة تجمع أفضل الدكاترة في مكان واحد لتسهيل الوصول إلى الرعاية الصحية المناسبة.",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // get token from cookie


  // async function initialize() {
  //   await dbConnect();
  //   await seedSpecializations();
  //   await seedGovernorate();
  //   await seedCities();
  // }

  // initialize();

  const token = await getToken();
  // wait one second 
  return (
    <html lang="en" dir="rtl">
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

        <title>دكاترة</title>
        <meta name="description" content="دكاترة منصة طبية شاملة تجمع أفضل الدكاترة في مكان واحد لتسهيل الوصول إلى الرعاية الصحية المناسبة." />
        <meta name="keywords" content="دكاترة, دكتور, دكاترة منصة طبية شاملة, دكاترة منصة طبية شاملة تجمع أفضل الدكاترة في مكان واحد لتسهيل الوصول إلى الرعاية الصحية المناسبة." />
        <meta name="author" content="Mamdouh Mohammed" />
        <meta name="robots" content="index, follow" />
        <meta name="revisit-after" content="7 days" />
        <meta name="language" content="ar" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <link rel="icon" type="image/webp" href="/logo.webp" />
        {/* <link rel="icon" type="image/svg+xml" href={FAVICON} /> */}
      </head>
      <body>
        <I18nProvider>
          <Providers token={token}>
            {children}
          </Providers>
        </I18nProvider>
      </body>
    </html>
  );
}
