'use server';

import { langs } from '@/lib/langs';
import {cookies} from 'next/headers';
// import {Locale, defaultLocale} from '@/i18n/config';

// In this example the locale is read from a cookie. You could alternatively
// also read it from a database, backend service, or any other source.
const COOKIE_NAME = 'NEXT_LOCALE';

export async function getUserLocale() {
  return cookies().get(COOKIE_NAME)?.value || langs[0].locale;
}

export async function setUserLocale(lang: typeof langs[number]) {
  cookies().set(COOKIE_NAME, lang.locale);
}