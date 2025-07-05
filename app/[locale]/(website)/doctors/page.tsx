

import { getMetaTags } from '@/metaFunctions/doctors';
import Doctors from './__pageContent';
import { Metadata } from 'next';

type Props = {
  params: Promise<{ locale: 'ar' | 'en' }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const meta = getMetaTags({
    locale: locale,
  });

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
  };
}

const Page = () => {
  return (
    <Doctors />
  )
}

export default Page