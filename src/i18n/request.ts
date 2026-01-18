import { getRequestConfig } from "next-intl/server"
import { cookies } from "next/headers"
import { locales, defaultLocale, type Locale } from "./config"

export default getRequestConfig(async () => {
  // Read locale from cookie (set by client-side language switcher)
  const cookieStore = await cookies()
  const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value as Locale | undefined
  const locale = cookieLocale && locales.includes(cookieLocale) ? cookieLocale : defaultLocale

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
