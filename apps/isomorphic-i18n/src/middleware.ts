import { NextResponse } from 'next/server';
import acceptLanguage from 'accept-language';
import { fallbackLng, languages } from './app/i18n/settings';

acceptLanguage.languages(languages);

const cookieName = 'i18next';

export function middleware(req: any) {
  let lang;

  if (req.cookies.has(cookieName))
    lang = acceptLanguage.get(req.cookies.get(cookieName).value);
  if (!lang) lang = acceptLanguage.get(req.headers.get('Accept-Language'));
  if (!lang) lang = fallbackLng;

  // Redirect if lng in path is not supported
  if (
    !languages?.some((local) => req.nextUrl.pathname.startsWith(`/${local}`)) &&
    !req.nextUrl.pathname.startsWith('/_next')
  ) {
    return NextResponse.redirect(
      new URL(`/${lang}${req.nextUrl.pathname}`, req.url)
    );
  }

  if (req.headers.has('referer')) {
    const refererUrl = new URL(req.headers.get('referer'));
    const lngInReferer = languages.find((l) =>
      refererUrl.pathname.startsWith(`/${l}`)
    );
    const response = NextResponse.next();
    if (lngInReferer) response.cookies.set(cookieName, lngInReferer);
    return response;
  }

  return NextResponse.next();
}
