import { SortDirection } from "../enums/SortDirection";
import { AccountStatus } from "../enums/AccountStatus";
import { PageLimit } from "../enums/PageLimit";

export type UserAccountFilters = {
  status?: AccountStatus[];
  roleId?: string[];
  facilityId?: string[];
  page?: number;
  orderBy?: Record<string, SortDirection>;
  nameOrEmailSearch?: string[];
  limit?: PageLimit;
};