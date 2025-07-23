import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useFolioParam } from "@components/hooks/params";
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

function Loading({ label }: { label: string }) {
  const { t } = useTranslation("common");
  return (
    <Select
      labelId="text-view-folio-navigation-label"
      value={t("prompts.loading")}
      inputProps={{
        id: "text-view-folio-navigation",
      }}
      input={<OutlinedInput label={label} />}
      displayEmpty
    >
      <MenuItem value="loading">
        <CircularProgress color="inherit" size={20} />
      </MenuItem>
    </Select>
  );
}

export default function TextViewFolioNavigation() {
  const { t } = useTranslation("settings");
  const { fileName } = useDbPageRouterParams();
  const router = useRouter();
  const [folio] = useFolioParam();

  const { data, isLoading } = useQuery({
    queryKey: DbApi.FolioData.makeQueryKey(fileName),
    queryFn: () => DbApi.FolioData.call({ filename: fileName }),
  });

  const handleSelectChange = async (event: SelectChangeEvent) => {
    const { value } = event.target;

    try {
      const activeSegment = await DbApi.ActiveSegmentForFolio.call({
        filename: fileName,
        folio: value,
      });

      if (activeSegment) {
        await router.push({
          pathname: router.pathname,
          query: {
            ...router.query,
            folio: value,
            active_segment: activeSegment,
          },
        });
      }
    } catch {
      // Silently handle error - user can try again
    }
  };

  const label = t("optionsLabels.folioAsGoTo");

  if (isLoading) {
    return (
      <SelectorFrame label={label}>
        <Loading label={label} />
      </SelectorFrame>
    );
  }

  return (
    <SelectorFrame label={label}>
      <Select
        labelId="text-view-folio-navigation-label"
        inputProps={{
          id: "text-view-folio-navigation",
        }}
        input={<OutlinedInput label={label} />}
        value={folio ?? ""}
        onChange={handleSelectChange}
      >
        {data?.map((folioItem: string) => {
          return (
            <MenuItem key={folioItem} value={folioItem}>
              {folioItem}
            </MenuItem>
          );
        })}
      </Select>
    </SelectorFrame>
  );
}
