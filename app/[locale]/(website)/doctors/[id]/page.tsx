import { getDoctorSEOById } from '@/lib/api/website';
import React from 'react';
import Doctor from './__pageContent';
import { Metadata } from 'next';

type Props = {
    params: Promise<{
        locale: 'ar' | 'en';
        id: string;
    }>
};

// Dynamic SEO Metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale, id } = await params;

    const doctorRes = await getDoctorSEOById(id);
    const doctor = doctorRes?.data?.doctor;

    if (!doctor) return {};

    const appName = locale === 'ar' ? process.env.NEXT_PUBLIC_APP_NAME_AR : process.env.NEXT_PUBLIC_APP_NAME_EN;
    
    const title = `${appName} | ${doctor.siteName[locale]} | ${doctor.title[locale]}`;
    const description = doctor.description[locale];
    const imageUrl = doctor.image?.url || 'https://your-default-image.jpg';
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://yourdomain.com';
    const fullUrl = `${baseUrl}/${locale}/doctors/${doctor._id}`;

    const keywords = [
        doctor.siteName[locale],
        doctor.title[locale],
        ...(doctor.services?.[locale] || []),
        ...(doctor.faqs?.map(faq => faq.question?.[locale]) || []),
        ...(doctor.articles?.map(article => article.title?.[locale]) || []),
    ]
        .filter(Boolean)
        .join(', ');

    return {
        title,
        description,
        keywords,
        alternates: {
            canonical: fullUrl,
            languages: {
                en: `${baseUrl}/en/doctors/${doctor._id}`,
                ar: `${baseUrl}/ar/doctors/${doctor._id}`,
            },
        },
        openGraph: {
            title,
            description,
            url: fullUrl,
            type: 'profile',
            images: [{ url: imageUrl }],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [imageUrl],
        },
        metadataBase: new URL(baseUrl),
    };
}

// Page Component
const Page = async ({ params }: { params: { id: string } }) => {
    const { id } = params;
    return <Doctor id={id} />;
};

export default Page;
