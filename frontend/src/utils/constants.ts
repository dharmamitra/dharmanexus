import { SupportedLocales } from "src/types/i18next";

export const SUPPORTED_LOCALES: SupportedLocales = {
  en: "English",
  de: "Deutsch",
  bo: "བོད་ཡིག",
};

export enum DbViewEnum {
  TEXT = "text",
  TABLE = "table",
  GRAPH = "graph",
  NUMBERS = "numbers",
}

export const DEFAULT_DB_VIEW = DbViewEnum.TEXT;

export const RESULT_PAGE_TITLE_GROUP_ID = "result-page-title-group";

export const DOCS_URL =
  "https://dharmamitra.github.io/dharmamitra-guides/dharmanexus/";
// TODO: multi deployment config if needed
export const SEARCH_URL = "https://dharmamitra.org/lab?view=search";
