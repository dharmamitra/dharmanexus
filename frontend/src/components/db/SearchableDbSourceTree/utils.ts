import React from "react";
import { NodeApi, TreeApi } from "react-arborist";
import {
  DbSourceTreeLeafNode,
  DbSourceTreeNode,
  DbSourceTreeNodeDataType,
} from "@components/db/SearchableDbSourceTree/types";
import type { ParsedStructuredDbSourceMenuData } from "@utils/api/endpoints/menudata";

export function transformDataForTreeView(
  data: ParsedStructuredDbSourceMenuData,
) {
  /**
   * TODO - check if:
   *  - if it's possible to enforce id uniqueness on BE - duplicate `id`s (eg. dhp) cause react-arborist to trigger key errors and rendering issues. Creating unique ids on FE breaks currnet file selection.
   * */
  return data.map((collection) => ({
    dataType: DbSourceTreeNodeDataType.COLLECTION,
    id: collection.name,
    name: collection.displayName,
    searchField: collection.name,
    children: collection.categories.map((category, categoryIndex) => ({
      dataType: DbSourceTreeNodeDataType.CATEGORY,
      id: `${collection.name}-${categoryIndex}-${category.name}`,
      displayId: category.name,
      name: category.displayName,
      searchField: category.searchField,
      children: category.files.map((file) => ({
        dataType: DbSourceTreeNodeDataType.TEXT,
        id: file.name,
        displayId: file.displayId,
        name: file.displayName,
        fileName: file.fileName,
        searchField: file.searchField,
      })),
    })),
  }));
}

export function getTreeKeyFromPath(path: string, suffix?: string) {
  return `${path.replace(/\?.*/, "")}-${suffix}`;
}

export function getTreeBreadcrumbs(node: NodeApi<DbSourceTreeNode>) {
  const crumbs = [];
  let current: NodeApi<DbSourceTreeNode> | null = node;

  while (current && current.level >= 0) {
    crumbs.unshift(current);
    current = current.parent;
  }

  return crumbs;
}

type InitializeTreeProps = {
  activeTree: TreeApi<DbSourceTreeNode> | null | undefined;
  setActiveTree: React.Dispatch<
    React.SetStateAction<TreeApi<DbSourceTreeNode> | null | undefined>
  >;
  setBreadcrumbs: React.Dispatch<
    React.SetStateAction<NodeApi<DbSourceTreeNode>[]>
  >;
};

export const handleTreeChange = ({
  activeTree,
  setActiveTree,
  setBreadcrumbs,
}: InitializeTreeProps) => {
  setActiveTree(activeTree);
  const selectedFileNode = activeTree?.selectedNodes[0];

  if (!selectedFileNode) {
    setBreadcrumbs([]);
    return;
  }

  const crumbs = getTreeBreadcrumbs(selectedFileNode);

  if (selectedFileNode.isLeaf) {
    crumbs.pop();
  }

  setBreadcrumbs(crumbs);
};

export function isSearchMatch(searchField: string, searchTerm: string) {
  return searchField.toLowerCase().includes(searchTerm.toLowerCase());
}

export function isDbSourceTreeLeafNodeData(
  node: DbSourceTreeNode | DbSourceTreeLeafNode,
): node is DbSourceTreeLeafNode {
  return node.fileName !== undefined;
}
