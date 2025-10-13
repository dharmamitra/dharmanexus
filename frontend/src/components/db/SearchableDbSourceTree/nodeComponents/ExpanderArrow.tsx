import { NodeApi } from "react-arborist";
import type { DbSourceTreeNode } from "@components/db/SearchableDbSourceTree/types";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

export function ExpanderArrow({
  node,
  mr = 1,
}: {
  node: NodeApi<DbSourceTreeNode>;
  mr?: number;
}) {
  if (!node.isInternal) return null;

  return (
    <ChevronRightIcon
      sx={{
        mr,
        transform: node.isOpen ? "rotate(90deg)" : undefined,
        transition: "transform 200ms",
      }}
    />
  );
}
