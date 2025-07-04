import { useNullableDbRouterParams } from "@components/hooks/useDbRouterParams";

import DbFilePrimaryUISettings from "./DbFilePrimaryUISettings";

export const PrimaryUISettings = () => {
  const { fileName } = useNullableDbRouterParams();

  if (fileName) {
    return <DbFilePrimaryUISettings />;
  }

  return null;
};
