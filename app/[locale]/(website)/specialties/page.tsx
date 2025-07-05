import { getSpecializationsMetaTags } from '@/metaFunctions/specializations';
import SpecialtiesSection from '@/sections/specialties'
import React from 'react'

export async function generateMetadata({ params }: { params: Promise<{ locale: 'ar' | 'en' }>; }) {
  const { locale } = await params;
  const meta = getSpecializationsMetaTags({ locale: locale });

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
  };
}

const Specialties = () => {
  return (
    <SpecialtiesSection limit={0} fromPage />
  )
}

export default Specialties