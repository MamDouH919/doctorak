// app/sitemap.xml/route.ts

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Doctor from '@/models/Accounts';

export async function GET() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const locales = ['en', 'ar'];

    try {
        await dbConnect();

        // جيب كل الأطباء النشطين فقط
        const doctors = await Doctor.find({ active: true }, { _id: 1 });

        const routes = [
            '',
            '/specialties',
            '/doctors', // صفحة كل الأطباء
        ];

        // 🧩 الصفحات الثابتة
        const staticPages = locales.flatMap(locale =>
            routes.map(
                route => `
  <url>
    <loc>${baseUrl}/${locale}${route}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
            )
        );

        // 🧩 صفحات الأطباء
        const doctorPages = locales.flatMap(locale =>
            doctors.map(
                (doc) => `
  <url>
    <loc>${baseUrl}/${locale}/doctors/${doc._id.toString()}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`
            )
        );

        // 🗂️ تركيب السايت ماب
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset 
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
>
  ${staticPages.join('\n')}
  ${doctorPages.join('\n')}
</urlset>`;

        return new NextResponse(sitemap, {
            headers: {
                'Content-Type': 'application/xml',
            },
        });

    } catch (error) {
        console.error('❌ Error generating sitemap:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
