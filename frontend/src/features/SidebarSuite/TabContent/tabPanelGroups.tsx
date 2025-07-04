import React from "react";
import { useTranslation } from "next-i18next";
import { TabList, TabPanel } from "@mui/lab/";
import { Tab } from "@mui/material";
import isFeatureEnabled from "@utils/featureControls";
import { Info } from "src/features/SidebarSuite/Info";

import { DisplayOptionsSection } from "./DisplayOptionsSection";
import { ExternalLinksSection } from "./ExternalLinksSection";
import { PrimaryUISettings } from "./PrimaryUISettings";
import { UtilityOptionsSection } from "./UtilityOptionsSection";

interface SettingTabListProps {
  onTabChange: (event: React.SyntheticEvent, newValue: string) => void;
}

export const SidebarTabListDbPage = ({ onTabChange }: SettingTabListProps) => {
  const { t } = useTranslation("settings");
  return (
    <TabList onChange={onTabChange}>
      <Tab key="settings-tab-0" value="0" label={t("tabs.settings")} />
      <Tab key="settings-tab-1" value="1" label={t("tabs.options")} />
      {isFeatureEnabled.infoTabs ? (
        <Tab key="settings-tab-2" value="2" label={t("tabs.info")} />
      ) : null}
    </TabList>
  );
};

export const DbFilePageSidebarTabPanels = () => {
  return (
    <>
      <TabPanel value="0" sx={{ px: 2 }}>
        <PrimaryUISettings />
      </TabPanel>

      <TabPanel value="1" sx={{ px: 2, pt: 2 }}>
        <DisplayOptionsSection />
        <UtilityOptionsSection />
        <ExternalLinksSection />
      </TabPanel>

      {isFeatureEnabled.infoTabs ? (
        <TabPanel value="2">
          <Info />
        </TabPanel>
      ) : null}
    </>
  );
};
