import { useTranslation } from "next-i18next";
import { useActiveSegmentParam } from "@components/hooks/params";
import { useDbPageRouterParams } from "@components/hooks/useDbRouterParams";
import {
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import Box from "@mui/material/Box";
import { useQuery } from "@tanstack/react-query";
import { DbApi } from "@utils/api/dbApi";
import { useAtom } from "jotai";
import { currentDbViewAtom }from "@atoms";
import { DbViewEnum } from "@utils/constants";

function SelectorFrame({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <Box sx={{ width: 1, my: 2 }}>
      <FormControl sx={{ width: 1 }} title={label}>
        <InputLabel id="text-view-folio-navigation-label">{label}</InputLabel>
        {children}
      </FormControl>
    </Box>
  );
}

function Loading({ showAll, label }: { showAll: string; label: string }) {
  return (
    <Select
      labelId="text-view-folio-navigation-label"
      value={showAll}
      inputProps={{
        id: "text-view-folio-navigation",
      }}
      input={<OutlinedInput label={label} />}
      displayEmpty
    >
      <MenuItem value={showAll}>
        <em>{showAll}</em>
      </MenuItem>
      <MenuItem value="loading">
        <CircularProgress color="inherit" size={20} />
      </MenuItem>
    </Select>
  );
}

export default function TextViewFolioNavigation() {
  const { t } = useTranslation("settings");
  const { fileName } = useDbPageRouterParams();
  const [, setActiveSegment] = useActiveSegmentParam();

  const { data, isLoading } = useQuery({
    queryKey: DbApi.FolioData.makeQueryKey(fileName),
    queryFn: () => DbApi.FolioData.call({ filename: fileName }),
  });

  const showAll = t("optionsLabels.folioShowAll");

  const handleSelectChange = async (event: SelectChangeEvent) => {
    const { value } = event.target;

    if (value === showAll) {
      // Reset to no active segment
      await setActiveSegment("none");
      return;
    }

    // Get the active segment for the selected folio
    try {
      const activeSegment = await DbApi.ActiveSegmentForFolio.call({
        filename: fileName,
        folio: value,
      });

      if (activeSegment) {
        await setActiveSegment(activeSegment);
      }
    } catch {
      // Silently handle error - user can try again
    }
  };

  const label = t("optionsLabels.folioAsGoTo");
  const [currentView] = useAtom(currentDbViewAtom);

  if (isLoading) {
    return (
      <SelectorFrame label={label}>
        <Loading showAll={showAll} label={label} />
      </SelectorFrame>
    );
  }

  const isDisabled =
    currentView === DbViewEnum.TABLE || currentView === DbViewEnum.NUMBERS;

  return (
    <SelectorFrame label={label}>
      <Select
        labelId="text-view-folio-navigation-label"
        inputProps={{
          id: "text-view-folio-navigation",
        }}
        input={<OutlinedInput label={label} />}
        value={showAll}
        displayEmpty
        onChange={handleSelectChange}
        disabled={isDisabled}
      >
        <MenuItem value={showAll}>
          <em>{showAll}</em>
        </MenuItem>
        {data?.map((folio: string) => {
          return (
            <MenuItem key={folio} value={folio}>
              {folio}
            </MenuItem>
          );
        })}
      </Select>
    </SelectorFrame>
  );
}
