import React, { useCallback } from "react";
import { textViewRightPaneFileNameAtom } from "@atoms";
import {
  useRightPaneActiveSegmentIndexParam,
  useRightPaneActiveSegmentParam,
} from "@components/hooks/params";
import { CloseTextViewPaneButton } from "@features/textView/CloseTextViewPaneButton";
import { TextViewPane } from "@features/textView/TextViewPane";
import { Box, CardHeader, Tooltip, Typography } from "@mui/material";
import { useAtomValue, useSetAtom } from "jotai";

export const TextViewRightPane = () => {
  const [activeSegmentId, setActiveSegmentId] =
    useRightPaneActiveSegmentParam();
  const [activeSegmentIndex, setActiveSegmentIndex] =
    useRightPaneActiveSegmentIndexParam();
  const setRightPaneFileName = useSetAtom(textViewRightPaneFileNameAtom);

  const handleClear = useCallback(async () => {
    await setActiveSegmentId("none");
    await setActiveSegmentIndex(null);
    setRightPaneFileName(undefined);
  }, [setActiveSegmentId, setActiveSegmentIndex, setRightPaneFileName]);

  const rightPaneFileName = useAtomValue(textViewRightPaneFileNameAtom);

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <CardHeader
        data-testid="middle-view-header"
        sx={{
          backgroundColor: "background.header",
          borderBottom: "2px solid",
          borderColor: "divider",
          position: "sticky",
          top: 0,
          zIndex: 2,
          width: "100%",
        }}
        action={<CloseTextViewPaneButton handlePress={handleClear} />}
        title={
          <Tooltip
            PopperProps={{ disablePortal: true }}
            placement="bottom-start"
            componentsProps={{
              popper: {
                sx: {
                  maxWidth: "60vw",
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                },
              },
              tooltip: {
                sx: {
                  maxWidth: "60vw",
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                },
              },
            }}
            title={
              <>
                <Typography variant="body2">{activeSegmentId}</Typography>
                <Typography variant="h6">{rightPaneFileName}</Typography>
              </>
            }
          >
            <div>
              <Typography variant="h6" lineHeight={1.3}>
                {activeSegmentId}
              </Typography>
              <Typography variant="body2" sx={{ maxWidth: 330 }} noWrap>
                {rightPaneFileName}
              </Typography>
            </div>
          </Tooltip>
        }
      />

      <TextViewPane
        activeSegmentId={activeSegmentId}
        setActiveSegmentIndex={setActiveSegmentIndex}
        setActiveSegmentId={setActiveSegmentId}
        activeSegmentIndex={activeSegmentIndex}
        isRightPane={true}
      />
    </Box>
  );
};
