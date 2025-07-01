import apiClient from "@api";
import { transformDataForTreeView } from "@components/db/SearchableDbSourceTree/utils";
import type { APIGetRequestQuery, APIGetResponse } from "@utils/api/types";

function parseStructuredDbSourceMenuData(data: APIGetResponse<"/menudata/">) {
  return data.menudata.map((collectionData) => {
    const { collection, categories } = collectionData;
    // Check if collectiondisplayname exists in the response, fallback to collection name
    const collectiondisplayname =
      (collectionData as any).collectiondisplayname || collection;

    return {
      collection,
      collectiondisplayname,
      categories: categories.map(
        ({ files, categorydisplayname, category: categoryName }) => ({
          files: files.map(
            ({ displayName, filename, search_field, textname }) => ({
              displayName,
              displayId: textname,
              searchField: search_field,
              fileName: filename,
              category: categoryName,
            }),
          ),
          name: categoryName,
          displayName: categorydisplayname,
        }),
      ),
    };
  });
}

// Add explicit type definition to ensure collectiondisplayname is included
export type ParsedCollection = {
  collection: string;
  collectiondisplayname: string;
  categories: {
    files: {
      displayName: string;
      displayId: string;
      searchField: string;
      fileName: string;
      category: string;
    }[];
    name: string;
    displayName: string;
  }[];
};

export type ParsedStructuredDbSourceMenuData = ParsedCollection[];

export async function getDbSourceMenuData(
  query: APIGetRequestQuery<"/menudata/">,
) {
  const { data } = await apiClient.GET("/menudata/", {
    params: { query },
  });

  const parsedApiData = data ? parseStructuredDbSourceMenuData(data) : [];
  return transformDataForTreeView(parsedApiData);
}
