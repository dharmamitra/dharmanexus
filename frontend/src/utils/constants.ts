import { SupportedLocales } from "src/types/i18next";
// i18n
export const SUPPORTED_LOCALES: SupportedLocales = {
  en: "English",
  de: "Deutsch",
};

export enum DbViewEnum {
  GRAPH = "graph",
  NUMBERS = "numbers",
  TABLE = "table",
  TEXT = "text",
}
export const DEFAULT_DB_VIEW = DbViewEnum.TEXT;
