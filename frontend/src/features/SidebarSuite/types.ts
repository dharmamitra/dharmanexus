import { AllAPIRequestProps, APISchemas } from "@utils/api/types";

type APIRequestPropsName = keyof AllAPIRequestProps;

/**
 *
 *
 * FILTER TYPES
 *
 */

type FeStateParams =
  | "active_segment_index"
  | "collection"
  | "hit_collections"
  | "left_pane_active_match"
  | "right_pane_active_match"
  | "right_pane_active_segment"
  | "right_pane_active_segment_index";

export type APIRequestFilters = NonNullable<AllAPIRequestProps["filters"]>;

export type APIRequestFilterName = keyof APIRequestFilters;

export type IndividualFilterName = Extract<
  APIRequestFilterName,
  "languages" | "score" | "par_length"
>;

export type DbSourceFilters = Omit<APIRequestFilters, IndividualFilterName>;

export type DbSourceFilterName = keyof DbSourceFilters;

export type FilterUISettings = Omit<
  APIRequestFilters,
  | "exclude_categories"
  | "exclude_collections"
  | "exclude_files"
  | "include_categories"
  | "include_collections"
  | "include_files"
> & {
  exclude_sources: string[];
  include_sources: string[];
};

export type RequestFilterUISettingName = keyof FilterUISettings;

export type DBSourceFilePageFilterUISettingName = Exclude<
  RequestFilterUISettingName,
  "language"
>;

export type DbSourceFilterUISetting = Extract<
  RequestFilterUISettingName,
  "exclude_sources" | "include_sources"
>;

export type DbSourceFiltersSelectedIds = Record<
  DbSourceFilterUISetting,
  string[]
>;

/**
 *
 *
 * DISPLAY TYPES
 *
 */

export type RequestDisplayUISettingName = Extract<
  APIRequestPropsName,
  "folio" | "sort_method"
>;

export type LocalDisplayUISettingName = "script" | "showSegmentNrs";

export type DisplayUISettingName =
  | RequestDisplayUISettingName
  | LocalDisplayUISettingName;

// --- DISPLAY TYPES VALUES

export type SortMethod = APISchemas["SortMethod"];

export type TibetanScript = "Unicode" | "Wylie";
export type SanskritScript = "IAST" | "Devanagari";
export type Script = TibetanScript | SanskritScript;
export type Scripts = {
  bo: TibetanScript;
  // TODO:  https://www.npmjs.com/package/@indic-transliteration/sanscript
  // sa: SanskritScript;
};

/**
 *
 *
 * UTILITY TYPES
 *
 */

export type RequestUtilityUIOptionName = Extract<
  APIRequestPropsName,
  "download_data"
>;

export type LocalUtilityUIOptionName = "copyResultInfo" | "emailResultInfo";

export type UtilityUIOptionName =
  | RequestUtilityUIOptionName
  | LocalUtilityUIOptionName;

/**
 *
 *
 * ALL SETTING NAMES
 *
 */

export type UIComponentParamName =
  | FeStateParams
  | APIRequestPropsName
  | APIRequestFilterName
  | DisplayUISettingName
  | UtilityUIOptionName;

export type AllUIComponentParamNames = Record<
  UIComponentParamName,
  UIComponentParamName
>;

export type LanguageUnavailableSettings<T extends string> = Partial<
  Record<T, APISchemas["Languages"][]>
>;
