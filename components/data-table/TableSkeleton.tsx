import {
  Box,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useMediaQuery,
  useTheme,
} from "@mui/material";

export const TableSkeleton = ({
  visibleColumnCount = 12,
}: {
  visibleColumnCount?: number;
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Simulated column count: first column is checkbox, rest are data
  const rowCount = isMobile ? 5 : 12;

  return (
    <Paper>
      <TableContainer>
        <Box sx={{ flex: 1, overflowY: "auto" }}></Box>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {/* Checkbox header cell */}
              <TableCell padding="checkbox">
                <Skeleton variant="circular" width={24} height={24} />
              </TableCell>
              {/* Data header skeletons */}
              {Array.from({ length: visibleColumnCount }).map((_, idx) => (
                <TableCell key={idx}>
                  <Skeleton variant="text" width="60%" />
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {Array.from({ length: rowCount }).map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {/* Checkbox cell */}
                <TableCell padding="checkbox">
                  <Skeleton variant="circular" width={20} height={20} />
                </TableCell>
                {/* Row data cells */}
                {Array.from({ length: visibleColumnCount }).map(
                  (_, colIndex) => (
                    <TableCell key={colIndex}>
                      <Skeleton
                        variant="rectangular"
                        width={100}
                        height={24}
                        sx={{ borderRadius: 1 }}
                      />
                    </TableCell>
                  )
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Simulated Pagination Skeleton */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        px={2}
        py={1.5}
      >
        {/* Left placeholder */}
        <Skeleton variant="text" width={80} height={20} />
        {/* Page controls */}
        <Box display="flex" alignItems="center" gap={1}>
          {Array.from({ length: 4 }).map((_, idx) => (
            <Skeleton
              key={idx}
              variant="circular"
              width={32}
              height={32}
              sx={{ borderRadius: "50%" }}
            />
          ))}
        </Box>
      </Box>
    </Paper>
  );
};
