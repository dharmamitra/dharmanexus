import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import { useNullableDbRouterParams } from "@components/hooks/useDbRouterParams";
import { RESULT_PAGE_TITLE_GROUP_ID } from "@constants/base";
import {
  Popper,
  PopperMsgBox,
} from "@features/SidebarSuite/common/MuiStyledSidebarComponents";
import CopyIcon from "@mui/icons-material/CopyAllOutlined";
import {
  Fade,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

export const CopyResultInfoButton = () => {
  const { t } = useTranslation("settings");

  const { fileName } = useNullableDbRouterParams();

  const [popperAnchorEl, setPopperAnchorEl] =
    React.useState<null | HTMLElement>(null);

  const handleClick = async (event: React.MouseEvent<HTMLElement>) => {
    const target = event.currentTarget;

    let title = "";
    if (fileName) {
      title =
        document
          .getElementById(RESULT_PAGE_TITLE_GROUP_ID)
          ?.innerText.replaceAll(/\n+/g, "\n") ?? "";
    }

    const { href } = window.location;
    const text = `${title}\n${decodeURI(href)}`;
    await navigator.clipboard.writeText(text);
    setPopperAnchorEl((prev) => (prev ? null : target));
    setTimeout(() => setPopperAnchorEl(null), 1500);
  };

  const [isPopperOpen, setIsPopperOpen] = useState(false);

  React.useEffect(() => {
    setIsPopperOpen(Boolean(popperAnchorEl));
  }, [popperAnchorEl]);

  const popperId = isPopperOpen ? `copy-popper` : undefined;

  return (
    <ListItem disablePadding>
      <ListItemButton
        id="download-results-button"
        sx={{ px: 0 }}
        aria-describedby={popperId}
        onClick={handleClick}
      >
        <ListItemIcon>
          <CopyIcon />
        </ListItemIcon>
        <ListItemText primary={t(`optionsLabels.copyResultInfo`)} />
      </ListItemButton>

      <Popper
        id={popperId}
        open={isPopperOpen}
        anchorEl={popperAnchorEl}
        placement="top"
        modifiers={[
          {
            name: "offset",
            options: {
              offset: [0, 20],
            },
          },
        ]}
        transition
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={275}>
            <PopperMsgBox>{t(`optionsPopperMsgs.copied`)}</PopperMsgBox>
          </Fade>
        )}
      </Popper>
    </ListItem>
  );
};
