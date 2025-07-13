import { fontSizeAtom, scriptSelectionAtom } from "@atoms";
import { useDbPageRouterParams } from "@components/hooks/useDbRouterParams";
import { enscriptText } from "@features/SidebarSuite/utils";
import { Typography } from "@mui/material";
import { APISchemas, DbLanguage } from "@utils/api/types";
import { useAtomValue } from "jotai";

interface Props {
  text: APISchemas["FullText"][];
  language: DbLanguage;
}

export const ParallelSegmentText = ({ text, language }: Props) => {
  const script = useAtomValue(scriptSelectionAtom);
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
            sx={{ display: "inline", fontSize: `${fontSize}px` }}
            fontWeight={isMatch ? 600 : 400}
            color={isMatch ? "text.primary" : "text.secondary"}
          >
            {enscriptText({
              text: segmentText ?? "",
              script,
              language,
            })}
          </Typography>
        );
      })}
    </>
  );
};
