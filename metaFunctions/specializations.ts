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
            title: `التخصصات الطبية - دكاترة`,
            description: `استعرض جميع التخصصات الطبية المتاحة على منصة دكاترة، واختر التخصص المناسب لحالتك الصحية بكل سهولة.`,
            keywords: `تخصصات طبية, دكاترة, دكتور باطنة, دكتور قلب, دكتور أسنان, دكتور عيون, دكتور نساء وتوليد, دكتور عظام, دكتور جلدية, رعاية صحية`,
        }
        : {
            title: `Medical Specializations - Daktarah`,
            description: `Explore all available medical specializations on Daktarah platform and choose the right one for your health condition.`,
            keywords: `medical specializations, internal medicine, cardiologist, dentist, ophthalmologist, gynecologist, orthopedist, dermatologist, healthcare`,
        };
}
