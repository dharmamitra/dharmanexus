import { fontSizeAtom, tibetanScriptSelectionAtom } from "@atoms";
import { enscriptSegment } from "@features/SidebarSuite/utils";
import { Typography } from "@mui/material";
import { APISchemas, DbLanguage } from "@utils/api/types";
import { useAtomValue } from "jotai";

interface Props {
  text: APISchemas["FullText"][];
  language: DbLanguage;
}

export const ParallelSegmentText = ({ text, language }: Props) => {
  const tibetanScript = useAtomValue(tibetanScriptSelectionAtom);
  const fontSize = useAtomValue(fontSizeAtom);
  if (!text) {
    return null;
  }

  return (
    <>
      {text?.map(({ text: segmentText, highlightColor }) => {
        const isMatch = highlightColor === 1;

        return (
          <Typography
            key={segmentText}
            sx={{ display: "inline", fontSize: `${fontSize}px !important` }}
            fontWeight={isMatch ? 600 : 400}
            color={isMatch ? "text.primary" : "text.secondary"}
          >
            {enscriptSegment({
              text: segmentText ?? "",
              tibetanScript,
              segmentLanguage: language,
            })}
          </Typography>
        );
      })}
    </>
  );
};
