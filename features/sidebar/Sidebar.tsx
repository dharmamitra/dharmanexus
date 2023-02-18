import { useState } from "react";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import ForwardToInboxIcon from "@mui/icons-material/ForwardToInbox";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { TabContext, TabList, TabPanel } from "@mui/lab/";
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tab,
  Typography,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import {
  FolioOption,
  InclusionExclusionFilters,
  MinMatchLengthFilter,
  SortOption,
  TextScriptOption,
} from "features/sidebar/settingComponents";
import type {
  DisplayOption,
  DisplayOptions,
  FilterQuery,
} from "utils/dbUISettings";
import { filters, viewDisplayOptions } from "utils/dbUISettings";

// https://buddhanexus.kc-tbts.uni-hamburg.de/api/menus/sidebar/pli

interface Props {
  drawerWidth: number;
  isOpen: [boolean, (value: boolean | ((prevVar: boolean) => boolean)) => void];
}

const StandinFilter = (filter: string) => (
  <div>
    <small>{filter} setting coming to a sidebar near your soon!</small>
  </div>
);

const getTibetanDisplayOptions = (): Partial<DisplayOptions> => {
  return Object.fromEntries(
    Object.entries(viewDisplayOptions).map(([view, options]) => {
      return view === "graph"
        ? [view, options]
        : [view, ["script", ...options]];
    })
  );
};

const FilterComponents: Partial<Record<FilterQuery, React.ElementType>> = {
  limit_collection: InclusionExclusionFilters,
  par_length: MinMatchLengthFilter,
  target_collection: () => StandinFilter("target_collection"),
};

const OptionComponents: Partial<Record<DisplayOption, React.ElementType>> = {
  folio: FolioOption,
  script: TextScriptOption,
  sort_method: SortOption,
};

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-start",
}));

export function Sidebar({ isOpen, drawerWidth }: Props) {
  const theme = useTheme();
  const { sourceLanguage } = useDbQueryParams();

  const [sidebarIsOpen, setSidebarIsOpen] = isOpen;
  const [tabPosition, setTabPosition] = useState("1");

  const displayOptions =
    sourceLanguage === "tib" ? getTibetanDisplayOptions() : viewDisplayOptions;

  const handleDrawerClose = () => {
    setSidebarIsOpen(false);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabPosition(newValue);
  };

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
        },
      }}
      variant="persistent"
      anchor="right"
      open={sidebarIsOpen}
    >
      <aside>
        <DrawerHeader
          sx={{
            bgcolor: "background.header",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "rtl" ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </IconButton>

            <IconButton href="/guide" target="_blank" rel="noopener noreferrer">
              <HelpOutlineIcon />
            </IconButton>
          </Box>
        </DrawerHeader>
        <Box sx={{ width: "100%", typography: "body1" }}>
          <TabContext value={tabPosition}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList
                aria-label="Filters, desplay options and other settings"
                onChange={handleTabChange}
              >
                <Tab label="Options" value="1" />
                <Tab label="Filters" value="2" />
                <Tab label="Info" value="3" />
              </TabList>
            </Box>

            <TabPanel value="1" sx={{ px: 0 }}>
              <Typography variant="h6" mx={2}>
                Display
              </Typography>
              <List>
                {displayOptions["proto-filters"]!.map((optionName) => {
                  if (!OptionComponents[optionName]) {
                    return null;
                  }

                  const OptionComponent = OptionComponents[
                    optionName
                  ] as React.ElementType;

                  return (
                    <ListItem key={optionName}>
                      <OptionComponent currentView="proto-filters" />
                    </ListItem>
                  );
                })}
              </List>

              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" mx={2}>
                Tools
              </Typography>
              <List sx={{ px: 1 }}>
                {[
                  {
                    id: 1,
                    label: "Download results as xmlx file",
                    Icon: FileDownloadIcon,
                  },
                  {
                    id: 2,
                    label: "Copy results page link",
                    Icon: ContentCopyIcon,
                  },
                  {
                    id: 3,
                    label: "Email results page link",
                    Icon: ForwardToInboxIcon,
                  },
                ].map((item) => {
                  const { id, label, Icon } = item;
                  return (
                    <ListItem key={id} disablePadding>
                      <ListItemButton>
                        <ListItemIcon>
                          <Icon />
                        </ListItemIcon>
                        <ListItemText primary={label} />
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </List>

              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" mx={2}>
                Links
              </Typography>
            </TabPanel>

            <TabPanel value="2" sx={{ px: 0 }}>
              <List>
                {filters["proto-filters"].map((filterName) => {
                  if (!FilterComponents[filterName]) {
                    return null;
                  }

                  const FilterComponent = FilterComponents[
                    filterName
                  ] as React.ElementType;

                  return (
                    <ListItem key={filterName}>
                      <FilterComponent currentView="proto-filters" />
                    </ListItem>
                  );
                })}
              </List>
            </TabPanel>

            <TabPanel value="3">
              <Typography>
                Some specific information about the results in this view /
                language.
              </Typography>
              <Typography variant="h6" mt={2}>
                Tip example
              </Typography>
              <Typography>
                You can use the <kbd>Home</kbd> and <kbd>End</kbd> keys to jump
                to the beginning and end of loaded portions of a text.
              </Typography>
            </TabPanel>
          </TabContext>
        </Box>
      </aside>
    </Drawer>
  );
}
