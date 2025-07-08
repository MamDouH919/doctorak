type MetaInput = {
    locale: 'ar' | 'en';
};

type MetaTags = {
    title: string;
    description: string;
    keywords: string;
};

export function getMetaTags({ locale }: MetaInput): MetaTags {
    const isAr = locale === 'ar';
    // Default: all doctors page
    return isAr
        ? {
            title: `جميع الأطباء - ${process.env.NEXT_PUBLIC_APP_NAME_AR}`,
            description: `تعرف على جميع الأطباء المتاحين على منصة ${process.env.NEXT_PUBLIC_APP_NAME_AR} وتحديد المواعيد الصحية المناسبة لك.`,
            keywords: `جميع الأطباء, دكاترة, تخصصات طبية, دكتور, منصة طبية, حجز دكتور`,
        }
        : {
            title: `All Doctors - ${process.env.NEXT_PUBLIC_APP_NAME_EN}`,
            description: `Browse all doctors available on ${process.env.NEXT_PUBLIC_APP_NAME_EN} and book appointments.`,
            keywords: `all doctors, healthcare platform, find doctor, book appointment, medical specializations`,
        };
}
