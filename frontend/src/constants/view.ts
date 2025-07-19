import { DbLanguage } from "@utils/api/types";

export enum DbViewEnum {
  TEXT = "text",
  TABLE = "table",
  GRAPH = "graph",
  NUMBERS = "numbers",
}

export const DEFAULT_DB_VIEW = DbViewEnum.TEXT;

export const UNAVAILABLE_VIEWS: Partial<Record<DbLanguage, DbViewEnum[]>> = {
  sa: [DbViewEnum.NUMBERS],
  bo: [DbViewEnum.NUMBERS],
};
