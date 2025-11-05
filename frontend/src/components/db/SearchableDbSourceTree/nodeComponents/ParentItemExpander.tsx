import { NodeApi } from "react-arborist";
import type { DbSourceTreeNode } from "@components/db/SearchableDbSourceTree/types";
import { DbSourceTreeNodeDataType as NodeType } from "@components/db/SearchableDbSourceTree/types";
import { Chip, Typography } from "@mui/material";

import { SourceTypeIcon } from "./SourceTypeIcon";
import { RowBox } from "./styledComponents";

export function ParentItemExpander({
  node,
}: {
  node: NodeApi<DbSourceTreeNode>;
}) {
  const { dataType, name, displayId, id } = node.data;

  return (
    <>
      {dataType === NodeType.COLLECTION && (
        <SourceTypeIcon dataType={dataType} fontSize="inherit" />
      )}
      {dataType === NodeType.CATEGORY && (
        <Chip
          label={
            <RowBox sx={{ gap: "0.5rem" }}>
              <SourceTypeIcon dataType={dataType} fontSize="inherit" />
              {displayId ?? id}
            </RowBox>
          }
          size="small"
          variant="outlined"
        />
      )}
      <Typography fontSize="inherit" whiteSpace="nowrap" marginInline="0.5rem">
        {name}
      </Typography>
    </>
  );
}
