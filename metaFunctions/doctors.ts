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
            title: `جميع الأطباء - دكاترة`,
            description: `تعرف على جميع الأطباء المتاحين على منصة دكاترة في مختلف التخصصات.`,
            keywords: `جميع الأطباء, دكاترة, تخصصات طبية, دكتور, منصة طبية, حجز دكتور`,
        }
        : {
            title: `All Doctors - Daktarah`,
            description: `Browse all doctors available on Daktarah across multiple specialties.`,
            keywords: `all doctors, healthcare platform, find doctor, book appointment, medical specializations`,
        };
}
