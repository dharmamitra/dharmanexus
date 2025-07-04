import apiClient from "@api";
import { transformDataForTreeView } from "@components/db/SearchableDbSourceTree/utils";
import type { APIGetRequestQuery, APIGetResponse } from "@utils/api/types";

function parseStructuredDbSourceMenuData(data: APIGetResponse<"/menudata/">) {
  return data.menudata.map(({ collection, categories }) => {
    return {
      name: collection,
      displayName: collection,
      categories: categories.map(
        ({
          category: categoryName,
          categorydisplayname,
          categorysearch_field,
          files,
        }) => ({
          name: categoryName,
          displayName: categorydisplayname,
          searchField: categorysearch_field,
          files: files.map(
            ({ displayName, filename, textname, search_field }) => ({
              name: filename,
              fileName: filename,
              displayName,
              displayId: textname,
              searchField: search_field,
              category: categoryName,
            }),
          ),
        }),
      ),
    };
  });
}

export type ParsedStructuredDbSourceMenuData = ReturnType<
  typeof parseStructuredDbSourceMenuData
>;

export async function getDbSourceMenuData(
  query: APIGetRequestQuery<"/menudata/">,
) {
  const { data } = await apiClient.GET("/menudata/", {
    params: { query },
  });

  const parsedApiData = data ? parseStructuredDbSourceMenuData(data) : [];
  return transformDataForTreeView(parsedApiData);
}
