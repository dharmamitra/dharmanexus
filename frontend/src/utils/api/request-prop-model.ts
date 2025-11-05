import { AllAPIRequestProps } from "@utils/api/types";

// `_allAPIRequestPropModel` is an `at a glance` ref that catches any prop model changes pulled from the API

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _allAPIRequestPropModel: AllAPIRequestProps = {
  language: "",
  filters: {
    score: 0,
    par_length: 0,
    exclude_collections: [],
    exclude_categories: [],
    exclude_files: [],
    include_collections: [],
    include_categories: [],
    include_files: [],
    languages: ["all"],
  },
  active_segment: "none",
  sort_method: "position",
  folio: "",
  page: 0,
  download_data: "table",
  filename: "",
  parallel_ids: [],
  segmentnr: "",
  include_matches: true,
};
