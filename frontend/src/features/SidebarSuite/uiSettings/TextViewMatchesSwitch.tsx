import React from "react";
import { useTranslation } from "next-i18next";
import { activeSegmentMatchesAtom } from "@atoms";
import { useRightPaneActiveSegmentParam } from "@components/hooks/params";
import { DEFAULT_PARAM_VALUES } from "@features/SidebarSuite/uiSettings/config";
import {
  FormControlLabel,
  FormGroup,
  Switch,
  Tooltip,
  Typography,
} from "@mui/material";
import { useSetAtom } from "jotai";

type TextViewMatchesSwitchComponentProps = {
  matchesVisible: boolean;
  setIncludeMatches: (value: boolean) => void;
  isSmallScreen: boolean;
};

export const TextViewMatchesSwitchComponent = ({
  matchesVisible,
  setIncludeMatches,
  isSmallScreen,
}: TextViewMatchesSwitchComponentProps) => {
  const { t } = useTranslation("settings");
  const setActiveSegmentMatches = useSetAtom(activeSegmentMatchesAtom);
  const [, setRightPaneActiveSegmentId] = useRightPaneActiveSegmentParam();

  const handleChange = React.useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      setIncludeMatches(event.target.checked);
      setActiveSegmentMatches([]);
      await setRightPaneActiveSegmentId(DEFAULT_PARAM_VALUES.active_segment);
    },
    [setIncludeMatches, setActiveSegmentMatches, setRightPaneActiveSegmentId],
  );

  React.useEffect(() => {
    if (isSmallScreen) {
      setIncludeMatches(false);
      setActiveSegmentMatches([]);
      setRightPaneActiveSegmentId(DEFAULT_PARAM_VALUES.active_segment).catch(
        () => undefined,
      );
    }
  }, [
    isSmallScreen,
    setIncludeMatches,
    setActiveSegmentMatches,
    setRightPaneActiveSegmentId,
  ]);

  return (
    <FormGroup>
      <FormControlLabel
        control={
          <Switch
            checked={matchesVisible}
            size="small"
            sx={{ ml: 0.5 }}
            onChange={handleChange}
          />
        }
        label={
          isSmallScreen ? (
            <Tooltip
              title={t("optionsLabels.showMatchesDisabled")}
              PopperProps={{ disablePortal: true }}
            >
              <Typography lineHeight={1.25}>
                {t("optionsLabels.showMatches")}
              </Typography>
            </Tooltip>
          ) : (
            <Typography lineHeight={1.25}>
              {t("optionsLabels.showMatches")}
            </Typography>
          )
        }
        disabled={isSmallScreen}
      />
    </FormGroup>
  );
};

export const TextViewMatchesSwitch = ({
  isRendered,
  ...props
}: { isRendered: boolean } & TextViewMatchesSwitchComponentProps) => {
  if (!isRendered) return null;

  return <TextViewMatchesSwitchComponent {...props} />;
};
