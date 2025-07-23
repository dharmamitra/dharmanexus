import type { SupportedLocale } from "@constants/i18n";
import {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  SUPPORTED_LOCALES_MAP,
} from "@constants/i18n";

/**
 * Validates if a string is a supported locale
 */
export function isSupportedLocale(locale: string): locale is SupportedLocale {
  return SUPPORTED_LOCALES.includes(locale as SupportedLocale);
}

/**
 * Gets the display name for a locale
 */
export function getLocaleDisplayName(locale: SupportedLocale): string {
  return SUPPORTED_LOCALES_MAP[locale];
}

/**
 * Gets all supported locales with their display names
 */
export function getAllLocalesWithNames(): {
  code: SupportedLocale;
  name: string;
}[] {
  return SUPPORTED_LOCALES.map((locale) => ({
    code: locale,
    name: SUPPORTED_LOCALES_MAP[locale],
  }));
}

/**
 * Normalizes a locale string to a supported locale or returns the default
 */
export function normalizeLocale(locale?: string): SupportedLocale {
  if (!locale) return DEFAULT_LOCALE;

  // Handle locale variants (e.g., "en-US" -> "en")
  const baseLocale = locale.split("-")[0] as string;

  if (isSupportedLocale(baseLocale)) {
    return baseLocale;
  }

  if (isSupportedLocale(locale)) {
    return locale;
  }

  return DEFAULT_LOCALE;
}

/**
 * Gets the direction (LTR/RTL) for a locale
 */
export function getLocaleDirection(locale: SupportedLocale): "ltr" | "rtl" {
  // Add RTL locales here when supported
  const rtlLocales: SupportedLocale[] = [];
  return rtlLocales.includes(locale) ? "rtl" : "ltr";
}
