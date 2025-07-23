import apiClient from "@api";
import type { APIGetRequestQuery } from "@utils/api/types";

export async function getActiveSegmentForFolio(
  query: APIGetRequestQuery<"/utils/active-segment-for-folio/">,
) {
  const { data } = await apiClient.GET("/utils/active-segment-for-folio/", {
    params: { query },
  });

  return data?.active_segment ?? "";
}
