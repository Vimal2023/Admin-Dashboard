import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_ColumnFiltersState,
  type MRT_PaginationState,
  type MRT_SortingState,
} from "material-react-table";

import { IconButton, Tooltip, Chip, Snackbar, Alert, Box } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

import { useFetchUser } from "./hooks/useFetchUserHook";
import { useState, useMemo } from "react";
import type { User } from "../../mocks/types";
import { useToggleUserStatus } from "./hooks/useToggleUserStatus";
import { columnsMetaData } from "./columnsMetaData";

type ProcessedUser = User & {
  groupName: string;
  role: "admin" | "manager" | "member" | "";
};

export function UsersGrid() {
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  //snackbar part
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "error" | "success";
  }>({
    open: false,
    message: "",
    severity: "error",
  });

  const handleCloseSnackbar = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  //tanstack parts
  const { data, isLoading, isError, refetch } = useFetchUser({
    columnFilters,
    globalFilter,
    pagination,
  });

  const { mutate: toggleUserStatus } = useToggleUserStatus(
    {
      columnFilters,
      globalFilter,
      pagination,
    },
    {
      onSuccess: (message) =>
        setSnackbar({ open: true, message, severity: "success" }),
      onError: (message) =>
        setSnackbar({ open: true, message, severity: "error" }),
    }
  );
  const usersData = useMemo(() => {
    return (
      data?.users?.map((user) => ({
        ...user,
        groupName: user.groups?.[0]?.name || "",
        role: user.groups?.[0]?.role || "",
      })) ?? []
    );
  }, [data]);

  //metadriven columns
  const columns = useMemo<MRT_ColumnDef<ProcessedUser>[]>(
    () =>
      columnsMetaData.map((meta) => {
        if (meta.type === "badge" && meta.key === "status") {
          return {
            accessorKey: meta.key,
            header: meta.header,
            Cell: ({ cell, row }) => {
              const user = row.original;
              const status = cell.getValue<"active" | "inactive">();
              const color = status === "active" ? "success" : "default";
              return (
                <Chip
                  label={status}
                  color={color}
                  onClick={() => toggleUserStatus(user)}
                  sx={{ cursor: "pointer" }}
                />
              );
            },
            size: meta.width,
          };
        }

        if (meta.type === "date") {
          return {
            accessorKey: meta.key,
            header: meta.header,
            Cell: ({ cell }) =>
              new Date(cell.getValue<string>()).toLocaleDateString(),
            size: meta.width,
          };
        }

        if (meta.type === "chiplist" && meta.key === "groups") {
          return {
            accessorKey: meta.key,
            header: meta.header,

            Cell: ({ row }) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {row.original.groups?.map((g) => (
                  <Chip key={g.id} label={g.name} size="small" />
                ))}
              </Box>
            ),
            size: meta.width,
            enableSorting: false,
            filterVariant: "multi-select",
          };
        }

        return {
          accessorKey: meta.key,
          header: meta.header,
          size: meta.width,
          enableSorting: meta.sorting || false,
        };
      }),
    [toggleUserStatus]
  );

  const table = useMaterialReactTable({
    columns,
    data: usersData,
    initialState: { showColumnFilters: true },
    manualFiltering: false,
    manualPagination: true,
    manualSorting: false,
    muiToolbarAlertBannerProps: isError
      ? {
          color: "error",
          children: "Error loading data",
        }
      : undefined,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    renderTopToolbarCustomActions: () => (
      <Tooltip arrow title="Refresh Data">
        <IconButton onClick={() => refetch()}>
          <RefreshIcon />
        </IconButton>
      </Tooltip>
    ),
    rowCount: data?.totalCount ?? 0,
    state: {
      columnFilters,
      globalFilter,
      isLoading,
      pagination,
      showAlertBanner: isError,
      showProgressBars: isLoading,
      sorting,
    },
  });

  return (
    <>
      <MaterialReactTable table={table} />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
