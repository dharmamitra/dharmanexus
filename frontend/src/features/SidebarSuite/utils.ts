import type {
  LanguageUnavailableSettings,
  TibetanScript,
} from "@features/SidebarSuite/types";
import { DbLanguage } from "@utils/api/types";
import { EwtsConverter } from "tibetan-ewts-converter";

export const getAvailableSettings = <T extends string>({
  unavailableSettingsForViewOrLang,
  uiSettings,
  dbLanguage,
}: {
  unavailableSettingsForViewOrLang: LanguageUnavailableSettings<T>;
  uiSettings: T[];
  dbLanguage: DbLanguage;
}) => {
  const availableSettings: T[] = [];

  for (const settingName of uiSettings) {
    if (!unavailableSettingsForViewOrLang[settingName]) {
      availableSettings.push(settingName);
      continue;
    }

    if (unavailableSettingsForViewOrLang[settingName]?.includes("all")) {
      continue;
    }

    if (!unavailableSettingsForViewOrLang[settingName]?.includes(dbLanguage)) {
      availableSettings.push(settingName);
    }
  }

  return availableSettings;
};

const ewts = new EwtsConverter();

export const enscriptSegment = ({
  text,
  segmentLanguage,
  tibetanScript,
}: {
  text?: string;
  segmentLanguage: DbLanguage;
  tibetanScript: TibetanScript;
}) => {
  if (segmentLanguage === "bo" && tibetanScript === "Unicode") {
    return ewts.to_unicode(text);
  }

  return text;
};
