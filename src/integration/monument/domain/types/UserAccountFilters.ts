import { SortDirection } from "../enums/SortDirection";
import { PageLimit } from "../enums/PageLimit";
import { AccountStatus } from "../enums/AccountStatus";

export enum OrderField {
  FirstName = "firstName",
  LastName = "lastName",
  RootRoleName = "rootRoleName",
  Email = "email",
}

export type UserAccountFilters = {
  status?: AccountStatus[];
  roles?: string[];
  facilities?: string[];
  page?: number;
  orderBy?: [OrderField, SortDirection][];
  nameOrEmailSearch?: string[];
  limit?: PageLimit;
};