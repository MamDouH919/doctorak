"use client";

import {
  FirstPage,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPage,
} from "@mui/icons-material";
import { IconButton, Stack, TablePagination } from "@mui/material";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/material/styles";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PaginatorInfo } from "@/types";


const PREFIX = "Paginator";
const classes = {
  icon: `${PREFIX}-icon`,
  iconRtl: `${PREFIX}-icon-rtl`,
};

const Root = styled(Stack)(({ theme }) => ({
  [`& .${classes.iconRtl}`]: {
    transform: `rotate(180deg)`,
  },
  [`& .${classes.icon}`]: {
    transform: `rotate(0deg)`,
  },
}));

export const TablePaginationComponent = ({
  paginatorInfo,
}: {
  paginatorInfo: PaginatorInfo;
}) => {
  const { i18n } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = (paginatorInfo?.page || 1) - 1;
  const rowsPerPage = paginatorInfo?.limit || 20;

  const updateSearchParams = useCallback(
    (newPage: number, newRowsPerPage: number) => {
      const params = new URLSearchParams(searchParams?.toString());
      params.set("page", String(newPage + 1));
      params.set("first", String(newRowsPerPage));

      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const handlePageChange = useCallback(
    (_event: any, newPage: number) => {
      updateSearchParams(newPage, rowsPerPage);
    },
    [rowsPerPage, updateSearchParams]
  );

  const handleRowsPerPageChange = useCallback(
    (event: any) => {
      const newRows = parseInt(event.target.value, 10);
      updateSearchParams(0, newRows);
    },
    [updateSearchParams]
  );

  return (
    <TablePagination
      component="div"
      count={paginatorInfo?.total || 0}
      page={page}
      rowsPerPage={rowsPerPage}
      rowsPerPageOptions={[20, 50, 100]}
      onPageChange={handlePageChange}
      onRowsPerPageChange={handleRowsPerPageChange}
      ActionsComponent={PaginationActions}
      labelRowsPerPage=""
      labelDisplayedRows={
        i18n.language === "en"
          ? undefined
          : ({ from, to, count }) =>
            `${from}-${to} من ${count !== -1 ? count : `أكثر من ${to}`}`
      }
      sx={{
        borderRadius: "0 0 16px 16px",
      }}
    />
  );
};

const PaginationActions = ({ count, page, rowsPerPage, onPageChange }: any) => {
  const lastPageIndex = Math.max(0, Math.ceil(count / rowsPerPage) - 1);
  const { i18n } = useTranslation();
  const isRtl = i18n.dir() === "rtl";
  return (
    <Root direction={"row"} spacing={0.2} alignItems={"center"}>
      <IconButton
        onClick={(e) => onPageChange(e, 0)}
        disabled={page === 0}
        aria-label="first page"
      >
        <FirstPage className={isRtl ? classes.iconRtl : classes.icon} />
      </IconButton>
      <IconButton
        onClick={(e) => onPageChange(e, page - 1)}
        disabled={page === 0}
        aria-label="previous page"
      >
        <KeyboardArrowLeft className={isRtl ? classes.iconRtl : classes.icon} />
      </IconButton>
      <IconButton
        onClick={(e) => onPageChange(e, page + 1)}
        disabled={page >= lastPageIndex}
        aria-label="next page"
      >
        <KeyboardArrowRight className={isRtl ? classes.iconRtl : classes.icon} />
      </IconButton>
      <IconButton
        onClick={(e) => onPageChange(e, lastPageIndex)}
        disabled={page >= lastPageIndex}
        aria-label="last page"
      >
        <LastPage className={isRtl ? classes.iconRtl : classes.icon} />
      </IconButton>
    </Root>
  );
};
