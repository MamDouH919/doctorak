import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const locales = ['ar', 'en'];
const PUBLIC_FILE = /\.(.*)$/;

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isPublicFile = PUBLIC_FILE.test(pathname);

  // ✅ استثناء الملفات العامة
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/logo') ||
    isPublicFile
  ) {
    return NextResponse.next();
  }

  // ✅ لو المسار مفيهوش لغة
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}`)
  );

  if (pathnameIsMissingLocale) {
    // 🧠 نحاول نجيب اللغة من الكوكي أو نرجع لـ ar
    const preferredLocale = req.cookies.get('NEXT_LOCALE')?.value || 'ar';
    return NextResponse.redirect(
      new URL(`/${preferredLocale}${pathname}`, req.url)
    );
  }

  const token = req.cookies.get('token')?.value;
  const locale = pathname.split('/')[1]; // "ar" or "en"

  // 🔐 حماية dashboard
  if (!token && pathname.includes('/dashboard')) {
    return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
  }

  // ⛔ لو فيه توكن بيحاول يدخل login أو register → نرجعه على الصفحة الرئيسية
  if (
    token &&
    (pathname === `/${locale}/login` || pathname === `/${locale}/register`)
  ) {
    return NextResponse.redirect(new URL(`/${locale}`, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico|logo|images|.*\\..*).*)'],
};
