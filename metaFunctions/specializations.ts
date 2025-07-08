type MetaInput = {
    locale: 'ar' | 'en';
};

type MetaTags = {
    title: string;
    description: string;
    keywords: string;
};

export function getSpecializationsMetaTags({ locale }: MetaInput): MetaTags {
    const isAr = locale === 'ar';

    return isAr
        ? {
            title: `التخصصات الطبية - ${process.env.NEXT_PUBLIC_APP_NAME_AR}`,
            description: `استعرض جميع التخصصات الطبية المتاحة على منصة ${process.env.NEXT_PUBLIC_APP_NAME_AR} واختيار التخصص المناسب لحالتك.`,
            keywords: `تخصصات طبية, دكاترة, دكتور باطنة, دكتور قلب, دكتور أسنان, دكتور عيون, دكتور نساء وتوليد, دكتور عظام, دكتور جلدية, رعاية صحية`,
        }
        : {
            title: `Medical Specializations - ${process.env.NEXT_PUBLIC_APP_NAME_EN}`,
            description: `Explore all available medical specializations on ${process.env.NEXT_PUBLIC_APP_NAME_EN} and select the one that fits your health needs.`,
            keywords: `medical specializations, internal medicine, cardiologist, dentist, ophthalmologist, gynecologist, orthopedist, dermatologist, healthcare`,
        };
}
