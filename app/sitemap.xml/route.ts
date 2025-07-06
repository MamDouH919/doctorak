import { getAllDoctorsIds } from '@/lib/api/website'; // يرجّع [{ id: '123' }, ...]
import { NextResponse } from 'next/server';

export async function GET() {
    const baseUrl = 'https://test.3n-dev.com';
    const doctors = await getAllDoctorsIds(); // احضر كل الـ id
    const locales = ['en', 'ar'];

    const routes = [
        '',
        '/specialties',
        '/doctors', // صفحة كل الأطباء
    ];

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

    const doctorPages = locales.flatMap(locale =>
        doctors.map(
            ({ id }) => `
  <url>
    <loc>${baseUrl}/${locale}/doctors/${id}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`
        )
    );

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
}
