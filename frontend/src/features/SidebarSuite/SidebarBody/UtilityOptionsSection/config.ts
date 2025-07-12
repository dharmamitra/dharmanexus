import { DbViewEnum } from "@utils/constants";
import type {
  LanguageUnavailableSettings,
  UtilityUIOptionName,
} from "@features/SidebarSuite/types";

export const UNAVAILABLE_DB_SOURCE_PAGE_UI_UTILITIES: Partial<
  Record<DbViewEnum, LanguageUnavailableSettings<UtilityUIOptionName>>
> = {
  [DbViewEnum.TEXT]: {},
  [DbViewEnum.TABLE]: {},
  [DbViewEnum.NUMBERS]: {},
}; 