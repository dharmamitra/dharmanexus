/**
 * Primary source of truth for all supported locales in the application.
 *
 * NOTE: the SUPPORTED_LOCALES, and DEFAULT_LOCALE values must be duplicated in /next-i18next.config.js due to the inability to import TypeScript variables in Node.js
 */

export const SUPPORTED_LOCALES = [
  "en",
  "ja",
  "ko",
  "hi",
  "zh_Hant",
  "zh_Hans",
  "bo",
  "de",
] as const;

export const DEFAULT_LOCALE = "en";

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const SUPPORTED_LOCALES_MAP: Record<SupportedLocale, string> = {
  en: "English",
  ja: "日本語",
  ko: "繁體中文",
  hi: "简体中文",
  zh_Hant: "हिन्दी",
  zh_Hans: "བོད་ཡིག",
  bo: "한국어",
  de: "Deutsch",
};
