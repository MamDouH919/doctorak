import {
  Box,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  // TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  Row,
  useReactTable,
} from "@tanstack/react-table";
import { ReactNode } from "react";
import { IndeterminateCheckbox } from "./IndeterminateCheckbox";
import { TablePaginationComponent } from "./TablePaginationComponent";
import { TableSkeleton } from "./TableSkeleton";
import { TbDeviceDesktopSearch } from "react-icons/tb";
import { PaginatorInfo } from "@/types";
// import EmptyTablePlaceHolderMessage from "./EmptyTablePlaceHolderMessage";
// import ColumnSelector from "../dialogs/ColumnSelector";

interface TableProps<T> {
  columns: ColumnDef<T, any>[];
  sumValues?: Record<string, any> | null;
  data: T[];
  loading?: boolean;
  paginatorInfo?: PaginatorInfo;
  showCheckbox?: boolean;
  onRowSelectionChange?: (selection: any) => void;
  storageKey?: string;
  headerComponent?: ReactNode;
  rowSelection?: any;
  getRowId?: any;
  hidePagination?: boolean;
}

const TankStackTable = <T,>({
  columns,
  data,
  loading,
  paginatorInfo,
  hidePagination = false,
  showCheckbox = false,
  onRowSelectionChange,
  rowSelection,
  getRowId,
  headerComponent: HeaderComponent,
  sumValues,
}: TableProps<T>) => {
  // const [columnVisibility, setColumnVisibility] = useState<
  //   Record<string, boolean>
  // >({});

  // () => getStoredVisibility(storageKey)

  // Sync to localStorage when changed
  // useEffect(() => {
  //   setStoredVisibility(columnVisibility, storageKey);
  // }, [columnVisibility]);

  // const { urlQueriesAsObject } = useFilterQuery();
  // const { data, loading } = useListWarehousePickupsQuery({
  //   variables: {
  //     first: urlQueriesAsObject.rowsPerPage || 20,
  //     page: urlQueriesAsObject.page || 1,
  //   },
  //   fetchPolicy: "no-cache",
  // });

  const extendedColumns = showCheckbox
    ? [
      {
        id: "select",
        header: ({ table }: any) => (
          <IndeterminateCheckbox
            checked={table.getIsAllRowsSelected()}
            indeterminate={table.getIsSomeRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
        ),
        cell: ({ row }: { row: Row<T> }) => (
          <IndeterminateCheckbox
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            indeterminate={row.getIsSomeSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
        ),
      },
      ...columns,
    ]
    : columns;

  const table = useReactTable({
    columns: extendedColumns,
    data: data || [],
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: paginatorInfo?.totalPages,
    // getRowId: (row) => String((row as any).id),
    getRowId,
    state: { rowSelection }, // columnVisibility,
    // onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange,
  });

  if (loading) return <TableSkeleton visibleColumnCount={columns.length} />;
  // if (!data || data?.length === 0)
  //   return (
  //     <EmptyTablePlaceHolderMessage
  //       message="noShipments"
  //       headerComponent={HeaderComponent}
  //     />
  //   );

  return (
    <Paper
      sx={{
        // display: "grid",
        // flexDirection: "column",
        // height: "100%", // Assume parent container handles full height
        // width: "100%",
        // gridTemplateRows: "1fr auto",
        // borderRadius: 4,
        // overflow: "hidden", // Prevent extra scrollbar on Paper


        width: '100%',
        display: "grid",
        height: "100%",
        gridTemplateRows: "1fr auto",
      }}
    >
      {/* Table content (scrollable body only) */}
      {HeaderComponent && (
        <Box py={1} px={2}>
          {HeaderComponent}
        </Box>
      )}
      <Box sx={{ flex: 1, overflowY: "auto" }}>
        {table.getRowModel().rows.length === 0 ? <Stack
          justifyContent="center"
          alignItems="center"
          py={5}
          width={"100%"}
          height={"100%"}
        >
          <TbDeviceDesktopSearch size={80} color="text.secondary" />
          <Typography
            textTransform="capitalize"
            color="text.secondary"
            fontSize={20}
            fontWeight={600}
          >
            {"لا توجد بيانات"}
          </Typography>
        </Stack> :
        <Table stickyHeader size="small">
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableCell key={header.id} colSpan={header.colSpan}>
                    {!header.isPlaceholder &&
                      flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {/* {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={extendedColumns.length} sx={{ borderBottom: "none" }}>
                  
                </TableCell>
              </TableRow>
            ) : (
            )} */}
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                style={{
                  ...(showCheckbox && {
                    backgroundColor: row.getIsSelected()
                      ? "#5f3e3f"
                      : "transparent",
                  }),
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                    {/* {[null, undefined, ""].includes(cell.getValue() as any) && <span>ــــ</span>} */}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            {sumValues && table.getRowModel().rows.length > 0 && (
              <TableRow>
                {table.getVisibleLeafColumns().map((col) => (
                  <TableCell key={col.id}>
                    {sumValues[col.id] ??
                      (typeof (col.columnDef as any).accessorKey === "string"
                        ? sumValues[(col.columnDef as any).accessorKey]
                        : null) ??
                      null}
                  </TableCell>
                ))}
              </TableRow>
            )}
          </TableBody>
        </Table>}
      </Box>

      {/* Sticky pagination */}
      {data.length > 0 && !hidePagination && (
        <Box
          sx={{
            position: "sticky",
            bottom: 0,
            zIndex: 1,
            borderTop: "1px solid #ddd",
          }}
        >
          <TablePaginationComponent
            paginatorInfo={paginatorInfo as PaginatorInfo}
          />
        </Box>
      )}
    </Paper>
  );
};

export default TankStackTable;