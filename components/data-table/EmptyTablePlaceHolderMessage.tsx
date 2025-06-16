import { Paper, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import { TbDeviceDesktopSearch } from "react-icons/tb";
import { MdQrCodeScanner } from "react-icons/md";
import { IoAddCircleOutline } from "react-icons/io5";

const EmptyTablePlaceHolderMessage = ({
  headingText,
  showAddIcon,
  showBarcodeIcon,
  message,
  headerComponent,
}: {
  message?: string;
  headingText?: string;
  showAddIcon?: boolean;
  showBarcodeIcon?: boolean;
  headerComponent?: React.ReactNode;
}) => {
  const { t } = useTranslation();

  return (
    <Stack
      component={Paper}
      minHeight={300}
      width={"100%"}
      sx={{}}
      spacing={2}
      borderRadius={3}
      justifyContent={"center"}
      alignItems={"center"}
    >
      {(headingText || showAddIcon || headerComponent || showBarcodeIcon) && (
        <Stack
          py={2}
          px={4}

          width={"100%"}
        >
          {headerComponent && headerComponent}

          <Stack
            flexDirection={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            {headingText && (
              <Typography variant="h6">{t(headingText)}</Typography>
            )}
            <Stack flexDirection={"row"} gap={1.5}>
              {showAddIcon && <IoAddCircleOutline size={25} color="#6e6f6f" />}
              {showBarcodeIcon && <MdQrCodeScanner size={25} color="#6e6f6f" />}
            </Stack>
          </Stack>
        </Stack>
      )}

      <Stack justifyContent={"center"} alignItems={"center"} flex={1}>
        <TbDeviceDesktopSearch size={80} color="#808080" />
        <Typography
          textTransform={"capitalize"}
          color="#808080"
          fontSize={20}
          fontWeight={600}
        >
          {t(message || "لا توجد بيانات")}
        </Typography>
      </Stack>
    </Stack>
  );
};

export default EmptyTablePlaceHolderMessage;
