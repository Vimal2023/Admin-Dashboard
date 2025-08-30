//query file
import { useQuery, keepPreviousData } from "@tanstack/react-query";

import type { User } from "../../../mocks/types";
import { getUsers } from "../../../api/userApi";
import { type MRT_ColumnFiltersState } from "material-react-table";

export interface FetchUserParams {
  columnFilters: MRT_ColumnFiltersState;
  globalFilter: string;
  pagination: { pageIndex: number; pageSize: number };
}

interface UsersResponse {
  totalCount: number;
  users: User[];
}

export function useFetchUser(params: FetchUserParams) {
  const { pageIndex, pageSize } = params.pagination;
  const { globalFilter } = params;

  return useQuery<UsersResponse>({
    queryKey: ["users-list", params],
    queryFn: () =>
      getUsers({ page: pageIndex, pageSize: pageSize, query: globalFilter }),
    placeholderData: keepPreviousData,
  });
}
