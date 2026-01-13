import { NextRequest, NextResponse } from "next/server";

const LOCALES = ["en", "it"];
const DEFAULT_LOCALE = "it";

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname.endsWith(".jpg")) {
    return NextResponse.next();
  }

  // Check if the pathname already has a locale
  const pathnameHasLocale = LOCALES.some((locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`);

  if (pathnameHasLocale) {
    // Extract the locale from the path
    const firstSegment = pathname.split("/")[1];
    const locale = LOCALES.includes(firstSegment) ? firstSegment : DEFAULT_LOCALE;

    // Create response and set the locale cookie
    const response = NextResponse.next();
    response.cookies.set("NEXT_LOCALE", locale, {
      path: "/",
      maxAge: 31536000, // 1 year
    });
    return response;
  }

  // Try to get locale from cookie first (user's preferred locale)
  let locale = request.cookies.get("NEXT_LOCALE")?.value;

  if (!locale) {
    // Fall back to Accept-Language header
    const acceptLanguage = request.headers.get("accept-language");
    locale = acceptLanguage?.split(",")[0].split("-")[0].toLowerCase() || DEFAULT_LOCALE;

    if (!LOCALES.includes(locale)) {
      locale = DEFAULT_LOCALE;
    }
  }

  // Redirect to locale-prefixed path
  const response = NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
  response.cookies.set("NEXT_LOCALE", locale, {
    path: "/",
    maxAge: 31536000, // 1 year
  });
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public|api).*)"],
};
